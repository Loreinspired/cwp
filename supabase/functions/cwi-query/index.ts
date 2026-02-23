// ============================================================
// Clearwater Intelligence — RAG Edge Function
// supabase/functions/cwi-query/index.ts
//
// Gemini-only: text-embedding-004 for retrieval, gemini-2.5-flash
// for both drilling questions and final analysis streaming.
//
// Modes:
//   drill   → 2 clarifying questions (JSON)
//   analyze → embed → similarity search → stream Gemini response
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const GEMINI_MODEL   = "gemini-2.5-flash";
const EMBED_MODEL    = "text-embedding-004";
const GEMINI_BASE    = "https://generativelanguage.googleapis.com/v1beta/models";

// ─── System Prompts ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the Clearwater Intelligence Desk — the AI advisory interface of Clearwater Partners, a Nigerian commercial law firm headquartered in Ado-Ekiti, Ekiti State, with network coverage across Nigeria. The firm specialises in corporate advisory, capital markets, M&A, regulatory compliance, and dispute resolution. We represent the full commercial spectrum — from sole proprietors and startups to multinationals and institutions.

You are a RAG-augmented legal reasoning engine. Draw analysis first from the firm's internal precedents (provided below), then from Nigerian statutes and regulatory frameworks.

KEY STATUTORY REFERENCES:
- CAMA 2020 (Companies and Allied Matters Act) and the Companies Regulations 2021
- NDPA 2023 (Nigeria Data Protection Act) and NDPC guidelines
- BOFIA 2020 (Banks and Other Financial Institutions Act)
- FIRS Transfer Pricing Regulations and BEPS implementation
- Investment and Securities Act 2007 (and the 2024 Amendment)
- Land Use Act 1978
- Arbitration and Mediation Act 2023
- Ekiti State Laws (for matters with local jurisdiction)
- CBN, SEC, FCCPC, NCC, NERC, and CAC regulatory frameworks

INTERNAL PRECEDENTS (retrieved from firm documents):
{context}

CORE RULES:
1. ACCURACY FIRST — If a precedent is relevant, cite the specific file name (e.g. "per the firm's precedent in [file_name]..."). Never cite a document not in the context above.
2. NO HALLUCINATIONS — If a matter is not addressed in the provided context or Nigerian statutes, state: "This specific issue is not covered in the firm's current internal precedents — a partner would need to advise directly."
3. HUMAN-CENTRIC LENS — Analyse through the client's commercial objectives and business health, not merely technical compliance.
4. PRINCIPAL-LED TONE — Authoritative, analytically precise, and reassuring. Direct. Never casual.
5. NIGERIAN REGULATORY PRECISION — Specify which regulator and which statutory provision governs each point.

MANDATORY RESPONSE STRUCTURE:

**Legal Issue**
One sentence identifying the core legal question.

**Analysis**
2–3 paragraphs of substantive legal reasoning. Reference firm precedents and Nigerian statutes. Be specific about provisions, timelines, and thresholds.

**Strategic Considerations**
- [First commercial or risk consideration]
- [Second consideration]
- [Third consideration, if applicable]

**Action Items**
1. [Concrete next step with any deadline or filing requirement]
2. [Next step]
3. [Next step]

**Disclaimer**
This preliminary analysis is provided for orientation purposes only and does not constitute legal advice. Contact the Intelligence Desk to engage Clearwater Partners formally.`;

const DRILLING_PROMPT = `You are the intake assistant at Clearwater Intelligence Desk — the AI interface of Clearwater Partners, a Nigerian commercial law firm.

A prospective client has described a legal matter. Generate exactly 2 high-value clarifying questions. The questions must:
- Be specific to the matter described (not generic)
- Target the key legal distinctions that determine the applicable Nigerian statutory framework (e.g. public vs. private company, nature of the asset, existing encumbrances, jurisdictional considerations)
- Draw on Nigerian law specifics: CAMA 2020, CBN/SEC licensing, Land Use Act, Ekiti State Laws, etc.
- Be concise (one sentence each)

Respond ONLY with valid JSON in this exact format, no other text:
{"questions": ["First question?", "Second question?"]}

Matter submitted by client:
{scenario}`;

// ─── Gemini Helpers ───────────────────────────────────────────────────────────

async function geminiGenerate(
  apiKey: string,
  systemInstruction: string,
  userMessage: string,
  stream = false,
): Promise<Response> {
  const endpoint = stream
    ? `${GEMINI_BASE}/${GEMINI_MODEL}:streamGenerateContent?alt=sse&key=${apiKey}`
    : `${GEMINI_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  return fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      system_instruction: { parts: [{ text: systemInstruction }] },
      contents: [{ role: "user", parts: [{ text: userMessage }] }],
      generationConfig: { temperature: 0.2, maxOutputTokens: 1400 },
    }),
  });
}

async function geminiEmbed(apiKey: string, text: string): Promise<number[]> {
  const res = await fetch(
    `${GEMINI_BASE}/${EMBED_MODEL}:embedContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: `models/${EMBED_MODEL}`,
        content: { parts: [{ text }] },
        taskType: "RETRIEVAL_QUERY",
      }),
    },
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error((err as any)?.error?.message || `Gemini embed error ${res.status}`);
  }
  const data = await res.json();
  return data.embedding?.values ?? [];
}

// ─── Serve ────────────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  const geminiKey = Deno.env.get("GEMINI_API_KEY") || Deno.env.get("VITE_GEMINI_API_KEY");
  if (!geminiKey) {
    return json({ error: "GEMINI_API_KEY is not configured on this function." }, 500);
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    const { scenario, email, clarifications, mode } = await req.json();

    if (!scenario?.trim()) {
      return json({ error: "scenario is required" }, 400);
    }

    // ── MODE: drill ──────────────────────────────────────────────────────────
    if (mode === "drill") {
      const prompt = DRILLING_PROMPT.replace("{scenario}", scenario.slice(0, 1500));
      const drillingRes = await geminiGenerate(geminiKey, "", prompt, false);

      if (!drillingRes.ok) {
        const err = await drillingRes.json().catch(() => ({}));
        throw new Error((err as any)?.error?.message || `Gemini drill error ${drillingRes.status}`);
      }

      const data = await drillingRes.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      let questions: string[] = [];
      try {
        // Strip markdown fences if Gemini wraps the JSON
        const cleaned = raw.replace(/^```json?\s*/i, "").replace(/```\s*$/, "").trim();
        questions = JSON.parse(cleaned).questions || [];
      } catch { /* return empty */ }

      return json({ questions });
    }

    // ── MODE: analyze (RAG + stream) ─────────────────────────────────────────

    // 1. Build full query string
    const fullQuery = clarifications
      ? `${scenario.trim()}\n\nClient clarifications:\n${clarifications}`
      : scenario.trim();

    // 2. Embed the query via Gemini text-embedding-004
    const queryEmbedding = await geminiEmbed(geminiKey, fullQuery.slice(0, 8000));

    if (!queryEmbedding.length) {
      throw new Error("Embedding generation returned empty vector.");
    }

    // 3. Similarity search in Supabase pgvector
    let context =
      "No directly relevant internal precedents found. Respond based on Nigerian statutory law and general commercial law principles.";
    const sources: string[] = [];

    const { data: matchedDocs, error: matchErr } = await supabase.rpc(
      "match_documents",
      {
        query_embedding: queryEmbedding,
        match_count: 5,
        match_threshold: 0.65,
      },
    );

    if (matchErr) {
      console.error("Similarity search error:", matchErr.message);
    }

    if (matchedDocs && matchedDocs.length > 0) {
      context = matchedDocs
        .map((doc: any, i: number) => {
          const src = doc.file_name || "Internal Precedent";
          if (!sources.includes(src)) sources.push(src);
          const attribution = doc.partner_author
            ? `${src} (authored by ${doc.partner_author})`
            : src;
          return `[Document ${i + 1} — ${attribution} | Relevance: ${(doc.similarity * 100).toFixed(0)}%]\n${doc.content}`;
        })
        .join("\n\n---\n\n");
    }

    // 4. Log session (fire-and-forget)
    if (email) {
      supabase
        .from("cwi_sessions")
        .insert({
          email,
          query: fullQuery,
          clarifications: clarifications || null,
          sources_cited: sources,
          session_origin: "web",
        })
        .then(({ error }) => {
          if (error) console.error("Session log error:", error.message);
        });
    }

    // 5. Build prompt and stream via Gemini
    const systemPrompt = SYSTEM_PROMPT.replace("{context}", context);
    const userMessage = clarifications
      ? `Client matter:\n${scenario}\n\nClient's clarifications:\n${clarifications}`
      : `Client matter:\n${scenario}`;

    const completionRes = await geminiGenerate(geminiKey, systemPrompt, userMessage, true);

    if (!completionRes.ok) {
      const err = await completionRes.json().catch(() => ({}));
      throw new Error((err as any)?.error?.message || `Gemini stream error ${completionRes.status}`);
    }

    // 6. Translate Gemini SSE → OpenAI-compatible SSE for the frontend
    //    Gemini SSE lines: data: {"candidates":[{"content":{"parts":[{"text":"..."}]}}]}
    //    We emit:          data: {"choices":[{"delta":{"content":"..."}}]}
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = completionRes.body!.getReader();
        const decoder = new TextDecoder();

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            for (const line of chunk.split("\n")) {
              const trimmed = line.trim();
              if (!trimmed.startsWith("data:")) continue;
              const payload = trimmed.slice(5).trim();
              if (!payload || payload === "[DONE]") continue;

              try {
                const parsed = JSON.parse(payload);
                const text = parsed.candidates?.[0]?.content?.parts?.[0]?.text;
                if (text) {
                  const compat = JSON.stringify({
                    choices: [{ delta: { content: text } }],
                  });
                  controller.enqueue(encoder.encode(`data: ${compat}\n\n`));
                }
              } catch { /* skip malformed lines */ }
            }
          }
        } finally {
          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        ...CORS,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
        "X-CWI-Sources": JSON.stringify(sources),
      },
    });
  } catch (err: any) {
    console.error("CWI Edge Function error:", err);
    return json({ error: err.message || "Internal server error" }, 500);
  }
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS, "Content-Type": "application/json" },
  });
}

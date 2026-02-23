// ============================================================
// Clearwater Intelligence — RAG Edge Function
// supabase/functions/cwi-query/index.ts
//
// Modes:
//   drill   → generate 2 high-value clarifying questions
//   analyze → embed query, similarity search, stream GPT-4o response
// ============================================================

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ─── System Prompts ───────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the Clearwater Intelligence Desk — the AI advisory interface of Clearwater Partners, a Nigerian commercial law firm headquartered in Ado-Ekiti, Ekiti State, with network coverage across Nigeria. The firm specialises in corporate advisory, capital markets, M&A, regulatory compliance, and dispute resolution.

You are a RAG-augmented legal reasoning engine. You draw your analysis first from the firm's internal precedents (provided below), and second from Nigerian statutes and regulatory frameworks.

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
1. ACCURACY FIRST — If a precedent from the firm's documents is relevant, cite the specific file name in your analysis (e.g. "per the firm's precedent in [file_name]..."). Never cite a document that is not in the context above.
2. NO HALLUCINATIONS — If the matter is not addressed in the provided context or Nigerian statutes, explicitly state: "This specific issue is not covered in the firm's current internal precedents or my statutory database — a partner would need to advise directly."
3. HUMAN-CENTRIC LENS — Analyse legal problems through the client's commercial objectives and business health, not merely technical compliance. Ask: what outcome does the client actually need?
4. PRINCIPAL-LED TONE — Authoritative, analytically precise, and reassuring. Direct. Never casual, speculative, or verbose.
5. NIGERIAN REGULATORY PRECISION — Always specify which regulator (CBN, SEC, CAC, FIRS, NDPC, etc.) and which statutory provision governs each point.

MANDATORY RESPONSE STRUCTURE (always follow this format):

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

A prospective client has described a legal matter. Before providing a full analysis, you must generate exactly 2 high-value clarifying questions. The questions must:
- Be specific to the matter described (not generic)
- Target the key legal distinctions that determine the applicable Nigerian statutory framework (e.g. public vs. private company, nature of the asset, existing encumbrances, jurisdictional considerations)
- Draw on Nigerian law specifics: CAMA 2020, CBN/SEC licensing, Land Use Act, Ekiti State Laws, etc.
- Be concise (one sentence each)

Respond ONLY with valid JSON in this exact format, no other text:
{"questions": ["First question?", "Second question?"]}

Matter submitted by client:
{scenario}`;

// ─── Serve ────────────────────────────────────────────────────────────────────

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: CORS });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );
  const openaiKey = Deno.env.get("OPENAI_API_KEY")!;

  try {
    const { scenario, email, clarifications, mode } = await req.json();

    if (!scenario?.trim()) {
      return json({ error: "scenario is required" }, 400);
    }

    // ── MODE: drill ──────────────────────────────────────────
    if (mode === "drill") {
      const drillingRes = await openai(openaiKey, {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: DRILLING_PROMPT.replace("{scenario}", scenario.slice(0, 1500)),
          },
        ],
        temperature: 0.4,
        max_tokens: 300,
        response_format: { type: "json_object" },
      });

      const raw = drillingRes.choices?.[0]?.message?.content || "{}";
      let questions: string[] = [];
      try {
        questions = JSON.parse(raw).questions || [];
      } catch { /* return empty */ }

      return json({ questions });
    }

    // ── MODE: analyze (RAG + stream) ─────────────────────────

    // 1. Build the full query string
    const fullQuery = clarifications
      ? `${scenario.trim()}\n\nClient clarifications:\n${clarifications}`
      : scenario.trim();

    // 2. Embed the query
    const embedRes = await fetch("https://api.openai.com/v1/embeddings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiKey}`,
      },
      body: JSON.stringify({
        input: fullQuery.slice(0, 8000),
        model: "text-embedding-3-small",
      }),
    });
    const embedData = await embedRes.json();
    const queryEmbedding = embedData.data?.[0]?.embedding;

    if (!queryEmbedding) {
      throw new Error("Embedding generation failed — check your OpenAI API key.");
    }

    // 3. Similarity search
    let context =
      "No directly relevant internal precedents found. Respond based on Nigerian statutory law and general commercial law principles.";
    const sources: string[] = [];

    const { data: matchedDocs, error: matchErr } = await supabase.rpc(
      "match_documents",
      {
        query_embedding: queryEmbedding,
        match_count: 5,
        match_threshold: 0.65,
      }
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

    // 4. Log session to Supabase (fire-and-forget — don't block the stream)
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

    // 5. Build final prompt and stream GPT-4o
    const systemPrompt = SYSTEM_PROMPT.replace("{context}", context);
    const userMessage =
      clarifications
        ? `Client matter:\n${scenario}\n\nClient's clarifications:\n${clarifications}`
        : `Client matter:\n${scenario}`;

    const completionRes = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userMessage },
          ],
          temperature: 0.2,
          max_tokens: 1400,
          stream: true,
        }),
      }
    );

    if (!completionRes.ok) {
      const err = await completionRes.json().catch(() => ({}));
      throw new Error(err?.error?.message || `OpenAI error ${completionRes.status}`);
    }

    // 6. Pipe the OpenAI SSE stream back to the client
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
            const lines = chunk.split("\n");
            for (const line of lines) {
              const trimmed = line.trim();
              if (trimmed.startsWith("data:")) {
                controller.enqueue(encoder.encode(trimmed + "\n\n"));
              }
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

async function openai(key: string, body: Record<string, unknown>) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error?.message || `OpenAI error ${res.status}`);
  }
  return res.json();
}

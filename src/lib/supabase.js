/**
 * supabase.js — Clearwater Partners
 * Singleton Supabase client for the React frontend.
 *
 * Uses the ANON key (safe for browser). The SERVICE ROLE key
 * must NEVER be used here — it lives only in the ingestion
 * script and Supabase Edge Functions.
 *
 * SETUP:
 *   Add to your .env file:
 *     VITE_SUPABASE_URL=https://your-project.supabase.co
 *     VITE_SUPABASE_ANON_KEY=eyJ...
 */

import { createClient } from '@supabase/supabase-js';

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Returns null if not configured — components must handle this gracefully.
export const supabase = supabaseUrl && supabaseAnon
    ? createClient(supabaseUrl, supabaseAnon)
    : null;

/** The Edge Function URL for the CWI query endpoint. */
export const CWI_EDGE_URL = supabaseUrl
    ? `${supabaseUrl}/functions/v1/cwi-query`
    : null;

/** Log a completed CWI session. Called from CWIIntake after stream ends. */
export async function logCWISession({ email, query, clarifications, response, sources, actionItems }) {
    if (!supabase) return;
    await supabase.from('cwi_sessions').insert({
        email,
        query,
        clarifications: clarifications || null,
        response,
        sources_cited: sources || [],
        action_items: actionItems || [],
        session_origin: 'web',
    });
}

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

/**
 * Save a CWI session to Supabase.
 * Falls back gracefully if Supabase is not configured.
 */
export async function saveCWISession({ sessionId, messages, name, email, phone, leadCaptured }) {
    if (!supabase) return;
    try {
        const { error } = await supabase.from('cwi_sessions').upsert({
            session_id: sessionId,
            messages,
            name: name || null,
            email: email || null,
            phone: phone || null,
            lead_captured: leadCaptured || false,
            updated_at: new Date().toISOString(),
        }, { onConflict: 'session_id' });
        if (error) console.warn('[CWI] Supabase save error:', error.message);
    } catch (e) {
        console.warn('[CWI] Supabase unreachable:', e.message);
    }
}

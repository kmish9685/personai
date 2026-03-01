import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth } from '@clerk/nextjs/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function PATCH(req: Request) {
    try {
        const { userId } = await auth();

        if (!userId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
            return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
        }

        const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
            auth: { persistSession: false }
        });

        const { decisionId, reaction } = await req.json();

        if (!decisionId || !reaction) {
            return NextResponse.json({ error: 'Missing decisionId or reaction' }, { status: 400 });
        }

        // 1. Verify Ownership
        const { data: decision, error: fetchError } = await supabase
            .from('decisions')
            .select('user_id')
            .eq('id', decisionId)
            .single();

        if (fetchError || !decision) {
            return NextResponse.json({ error: 'Decision not found' }, { status: 404 });
        }

        if (decision.user_id !== userId) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Perform Update
        const { error } = await supabase
            .from('decisions')
            .update({
                gut_reaction: reaction,
                gut_vs_ai: reaction.alignment
            })
            .eq('id', decisionId);

        if (error) {
            console.error('Gut check save error:', error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Gut check API error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

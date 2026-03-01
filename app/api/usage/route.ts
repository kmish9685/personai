import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth, currentUser } from '@clerk/nextjs/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const FREE_LIMIT = 5;

export async function GET(req: NextRequest) {
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await currentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
        return NextResponse.json({ error: "Supabase credentials are missing!" }, { status: 500 });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    try {
        const userEmail = user.emailAddresses[0]?.emailAddress;

        // Try finding user by email first, then by user_id
        let userPlanData = null;
        if (userEmail) {
            const { data } = await supabase
                .from('users')
                .select('id, plan, subscription_end_date, user_id')
                .eq('email', userEmail)
                .single();
            userPlanData = data;
        }

        if (!userPlanData) {
            const { data } = await supabase
                .from('users')
                .select('id, plan, subscription_end_date, user_id')
                .eq('user_id', user.id)
                .single();
            userPlanData = data;
        }

        let isPaidUser = false;
        if (userPlanData?.plan === 'pro') {
            if (userPlanData.subscription_end_date) {
                const endDate = new Date(userPlanData.subscription_end_date);
                isPaidUser = endDate > new Date();
            } else {
                isPaidUser = true; // Pro without end date
            }
        }

        // Get free tier count
        const { count: analysisCount } = await supabase
            .from('decisions')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

        const used = analysisCount || 0;
        const remaining = Math.max(0, FREE_LIMIT - used);

        return NextResponse.json({
            isPaid: isPaidUser,
            used,
            remaining,
            limit: FREE_LIMIT
        });

    } catch (e: any) {
        console.error('❌ Usage API Error:', e);
        return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
    }
}

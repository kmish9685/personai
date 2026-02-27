export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Plus, Clock, CheckCircle, AlertTriangle, ArrowRight, Trash2, Target, Zap } from 'lucide-react';
import DecisionCard from '@/components/decision/DecisionCard';

export default async function DashboardPage() {
    const user = await currentUser();
    if (!user) return redirect('/login');

    // Bypass RLS using Service Role Key for now (Internal Dashboard)
    // Ideally we should use standard client + RLS, but this guarantees data access for the demo.
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        return <div className="text-red-500 p-10">Configuration Error: Missing Service Key</div>;
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey
    );

    const { data: decisions, error } = await supabase
        .from('decisions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

    if (error) {
        console.error("Dashboard Fetch Error:", error);
        return <div className="text-red-500 p-10">Error loading decisions.</div>;
    }

    // Get usage data for the banner
    let usageData = { isPaid: false, remaining: 5, limit: 5, used: 0 };
    try {
        const userEmail = user.emailAddresses[0]?.emailAddress;

        // 1. Check Paid Status
        let userPlanData = null;
        if (userEmail) {
            const { data } = await supabase.from('users').select('plan, subscription_end_date').eq('email', userEmail).single();
            userPlanData = data;
        }
        if (!userPlanData) {
            const { data } = await supabase.from('users').select('plan, subscription_end_date').eq('user_id', user.id).single();
            userPlanData = data;
        }

        let isPaidUser = false;
        if (userPlanData?.plan === 'pro') {
            if (userPlanData.subscription_end_date) {
                isPaidUser = new Date(userPlanData.subscription_end_date) > new Date();
            } else {
                isPaidUser = true;
            }
        }

        // 2. Prepare Data
        usageData.isPaid = isPaidUser;
        usageData.used = decisions?.length || 0;
        usageData.remaining = Math.max(0, usageData.limit - usageData.used);
    } catch (e) {
        console.error("Dashboard Usage Fetch Error:", e);
    }

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-4">
                    <div>
                        <h1 className="text-3xl font-light text-white mb-2">My Decisions</h1>
                        <p className="text-zinc-500">History of your tough choices.</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                        {!usageData.isPaid && (
                            <div className="hidden md:flex flex-col items-end mr-2">
                                <span className={`text-sm font-medium ${usageData.remaining <= 1 ? 'text-red-400' : usageData.remaining <= 2 ? 'text-orange-400' : 'text-zinc-400'}`}>
                                    {usageData.remaining} / {usageData.limit} free left
                                </span>
                                {usageData.remaining <= 2 && (
                                    <Link href="/analyze/new" className="text-xs text-[#5e6ad2] hover:text-[#7c85e0] transition-colors mt-0.5 font-medium flex items-center gap-1">
                                        <Zap size={10} /> Upgrade for unlimited
                                    </Link>
                                )}
                            </div>
                        )}
                        <Link href="/analyze/new" className="bg-white text-black hover:bg-zinc-200 px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition-colors w-full md:w-auto justify-center">
                            <Plus size={18} /> Make New Decision
                        </Link>
                    </div>
                </div>

                {/* Mobile Usage Banner (prominent if low) */}
                {!usageData.isPaid && usageData.remaining <= 2 && (
                    <div className={`md:hidden mb-8 p-4 rounded-xl border flex items-center justify-between ${usageData.remaining === 0
                            ? 'bg-red-500/10 border-red-500/30'
                            : 'bg-orange-500/10 border-orange-500/30'
                        }`}>
                        <div>
                            <div className={`font-bold text-sm ${usageData.remaining === 0 ? 'text-red-400' : 'text-orange-400'}`}>
                                {usageData.remaining === 0 ? 'Free limit reached' : `Only ${usageData.remaining} free left`}
                            </div>
                            <div className={`text-xs mt-1 ${usageData.remaining === 0 ? 'text-red-400/70' : 'text-orange-400/70'}`}>
                                Upgrade for unlimited analysis
                            </div>
                        </div>
                        <Link href="/analyze/new" className={`px-4 py-2 rounded-lg text-xs font-bold transition-colors ${usageData.remaining === 0
                                ? 'bg-red-500 text-white hover:bg-red-600'
                                : 'bg-orange-500 text-white hover:bg-orange-600'
                            }`}>
                            Upgrade
                        </Link>
                    </div>
                )}

                {/* Empty State */}
                {(!decisions || decisions.length === 0) && (
                    <div className="border border-zinc-800 rounded-2xl p-16 text-center bg-zinc-900/30">
                        <div className="w-16 h-16 bg-zinc-900 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Clock size={32} className="text-zinc-600" />
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">No decisions tracked yet</h2>
                        <p className="text-zinc-500 mb-8 max-w-md mx-auto">Stop overthinking. Use the decision engine to get clarity on your next big move in minutes, not weeks.</p>
                        <Link href="/analyze/new" className="text-white border border-white/20 hover:bg-white/10 px-6 py-3 rounded-lg inline-flex items-center gap-2 transition-colors">
                            Values.Start Checkbox Analysis <ArrowRight size={16} />
                        </Link>
                    </div>
                )}

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {decisions?.map((decision: any) => (
                        <DecisionCard key={decision.id} decision={decision} />
                    ))}
                </div>

            </div>
        </div>
    );
}

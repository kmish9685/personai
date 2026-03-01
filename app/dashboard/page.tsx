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

    const pendingReviewDecisions = decisions?.filter((d: any) => {
        const createdDate = new Date(d.created_at);
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        return createdDate < sevenDaysAgo;
    }) || [];

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

                {/* Accountability Check-In (Experimental Hook) */}
                {pendingReviewDecisions.length > 0 && (
                    <div className="mb-12 animate-pulse-slow">
                        <div className="bg-gradient-to-r from-amber-500/20 via-black to-black border-2 border-amber-500/30 rounded-2xl p-6 md:p-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12"><Target size={120} /></div>

                            <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
                                <div>
                                    <div className="flex items-center gap-2 text-amber-500 font-bold text-xs uppercase tracking-widest mb-2">
                                        <AlertTriangle size={14} /> Weekly Reality Check
                                    </div>
                                    <h2 className="text-2xl font-bold text-white mb-2">You have {pendingReviewDecisions.length} decisions requiring an update.</h2>
                                    <p className="text-zinc-400 text-sm max-w-xl">
                                        It's been over 7 days since you made these choices. Did you execute? Returning to your decisions increases execution success by 40%.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-3 w-full md:w-auto">
                                    <Link
                                        href={`/analyze/${pendingReviewDecisions[0].id}`}
                                        className="bg-amber-500 text-black hover:bg-amber-400 px-6 py-3 rounded-lg font-bold transition-all text-center flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                                    >
                                        Update Latest: {pendingReviewDecisions[0].title.substring(0, 20)}...
                                    </Link>
                                    <div className="text-[10px] text-zinc-600 text-center uppercase tracking-tighter">
                                        Accountability Loop Active
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-white/5 flex flex-wrap gap-4">
                                {pendingReviewDecisions.slice(0, 3).map((d: any) => (
                                    <Link
                                        key={d.id}
                                        href={`/analyze/${d.id}`}
                                        className="text-[11px] text-zinc-500 hover:text-amber-400 transition-colors flex items-center gap-1 bg-white/5 px-2 py-1 rounded"
                                    >
                                        <Clock size={10} /> {d.title}
                                    </Link>
                                ))}
                            </div>
                        </div>
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
        </div >
    );
}

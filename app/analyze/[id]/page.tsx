import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import DecisionStatus from '@/components/decision/DecisionStatus';
import GutCheckIntegration from '@/components/decision/GutCheckIntegration';
import { DecisionChat } from '@/components/decision/DecisionChat';

import { ArrowLeft, AlertTriangle, TrendingUp, Skull, CheckCircle, Heart } from 'lucide-react';

export default async function AnalysisResultPage(props: { params: Promise<{ id: string }> }) {
    const params = await props.params;
    const { id } = params;
    const user = await currentUser();
    if (!user) return redirect('/login');

    // Check for Service Role Key
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceRoleKey) {
        console.error("CRITICAL: SUPABASE_SERVICE_ROLE_KEY is missing in environment variables!");
        return <div className="text-red-500 p-10">System Configuration Error. Please contact support.</div>;
    }

    // Bypass RLS using Service Role Key
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        serviceRoleKey
    );

    const { data: decision, error } = await supabase
        .from('decisions')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !decision) {
        console.error("Decision Fetch Error:", error);
        return (
            <div className="text-white p-10 max-w-2xl mx-auto">
                <h1 className="text-2xl font-bold text-red-500 mb-4">Decision Not Found</h1>
                <div className="bg-zinc-900 p-6 rounded-lg border border-red-500/20 font-mono text-sm space-y-2">
                    <p><span className="text-zinc-500">Decision ID:</span> <span className="text-amber-500">{params.id}</span></p>
                    <p><span className="text-zinc-500">User ID:</span> <span className="text-blue-400">{user.id}</span></p>
                    <p><span className="text-zinc-500">Service Key:</span> <span className={serviceRoleKey ? "text-green-500" : "text-red-500"}>{serviceRoleKey ? "Present (Starts with " + serviceRoleKey.substring(0, 5) + "...)" : "MISSING"}</span></p>
                    {error && (
                        <div className="mt-4 pt-4 border-t border-white/10">
                            <p className="text-red-400 font-bold">Supabase Error:</p>
                            <pre className="whitespace-pre-wrap text-xs text-red-300 mt-2">{JSON.stringify(error, null, 2)}</pre>
                        </div>
                    )}
                    {!error && !decision && <p className="text-yellow-500 mt-4">Database query returned no data (null) for this ID.</p>}
                </div>
                <div className="mt-6 flex gap-4">
                    <Link href="/analyze/new" className="px-4 py-2 bg-white text-black rounded hover:bg-zinc-200">Try Again</Link>
                    <Link href="/" className="px-4 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700">Home</Link>
                </div>
            </div>
        );
    }

    // Manual Security Check
    if (decision.user_id !== user.id) {
        return <div className="text-red-500 p-10">Unauthorized access to this decision.</div>;
    }

    const result = decision.analysis_result;
    const { recommendation, options_analysis, kill_signals, decision_compression } = result;

    return (
        <div className="min-h-screen bg-black text-white p-6 md:p-12">
            <GutCheckIntegration
                decisionId={decision.id}
                verdict={recommendation.verdict}
                existingReaction={decision.gut_reaction}
            />

            <div className="max-w-5xl mx-auto">
                <Link href="/" className="inline-flex items-center text-zinc-500 hover:text-white mb-8 transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </Link>

                {/* Header */}
                <div className="mb-10">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
                        <div className="flex items-center gap-4">
                            <h1 className="text-3xl font-light text-white">Decision Clarity</h1>
                            <DecisionStatus decisionId={decision.id} initialStatus={decision.status} />
                        </div>
                    </div>
                    <p className="text-zinc-500">Analysis for: <span className="text-white">{decision.title}</span></p>
                </div>

                {/* Gut Check Results (If Available) */}
                {decision.gut_reaction && (
                    <div className={`mb-10 border rounded-2xl p-6 relative overflow-hidden ${decision.gut_reaction.alignment === 'agrees' ? 'bg-green-500/5 border-green-500/20' :
                        decision.gut_reaction.alignment === 'disagrees' ? 'bg-red-500/5 border-red-500/20' :
                            'bg-yellow-500/5 border-yellow-500/20'
                        }`}>
                        <div className="flex items-center gap-3 mb-2 relative z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${decision.gut_reaction.alignment === 'agrees' ? 'bg-green-500/20' :
                                decision.gut_reaction.alignment === 'disagrees' ? 'bg-red-500/20' :
                                    'bg-yellow-500/20'
                                }`}>
                                <Heart size={20} className={
                                    decision.gut_reaction.alignment === 'agrees' ? 'text-green-500' :
                                        decision.gut_reaction.alignment === 'disagrees' ? 'text-red-500' :
                                            'text-yellow-500'
                                } />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold text-white">Your Gut Reaction</h2>
                                <p className="text-sm text-zinc-400 capitalize">{decision.gut_reaction.feeling} ({decision.gut_reaction.alignment} with AI)</p>
                            </div>
                        </div>

                        <p className={`mt-4 text-sm leading-relaxed relative z-10 ${decision.gut_reaction.alignment === 'agrees' ? 'text-green-200/80' :
                            decision.gut_reaction.alignment === 'disagrees' ? 'text-red-200/80' :
                                'text-yellow-200/80'
                            }`}>
                            {decision.gut_reaction.alignment === 'agrees' && "Your intuition matches the logical analysis. You should proceed with high confidence."}
                            {decision.gut_reaction.alignment === 'disagrees' && "Warning: The AI logic points one way, but your gut wants the opposite. Usually, your gut knows best. Re-read the analysis to see if your gut reaction is fear or true intuition."}
                            {decision.gut_reaction.alignment === 'neutral' && "You're still uncertain. Try the 5-year visualization exercise at the bottom of the page to unlock more clarity."}
                        </p>
                    </div>
                )}

                {/* Kill Signals - PROMOTED TO TOP */}
                <div className="bg-gradient-to-br from-red-500/10 to-black border-2 border-red-500/40 rounded-2xl p-8 mb-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                            <Skull size={24} className="text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-red-500 font-bold tracking-widest uppercase text-sm">Abort Signals</h2>
                            <p className="text-zinc-400 text-sm">Watch for these — they'll tell you when to quit</p>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        {kill_signals.map((ks: any, i: number) => (
                            <div key={i} className="bg-black/40 border border-red-500/30 p-5 rounded-xl hover:border-red-500/50 transition-colors">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="text-sm font-bold text-red-400">{ks.timeframe}</div>
                                    <div className="text-xs bg-red-500/20 text-red-300 px-3 py-1 rounded-full">
                                        {ks.action}
                                    </div>
                                </div>
                                <div className="text-base text-white font-medium leading-relaxed">{ks.signal}</div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center pt-4 border-t border-red-500/20">
                        <p className="text-zinc-500 text-sm">💡 Kill signals are often MORE valuable than the verdict — they give you objective exit criteria</p>
                    </div>
                </div>

                {/* Recommendation Card */}
                <div className="bg-gradient-to-br from-amber-500/10 to-black border border-amber-500/30 rounded-2xl p-8 mb-10 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-20"><TrendingUp size={100} /></div>

                    <h2 className="text-amber-500 font-bold tracking-widest uppercase text-xs mb-2">Recommendation</h2>
                    <h3 className="text-3xl font-bold text-white mb-4">{recommendation.verdict}</h3>

                    {/* Conversational Intro */}
                    {recommendation.companion_intro && (
                        <div className="mb-6 text-xl text-zinc-300 font-light italic border-l-2 border-[#5e6ad2] pl-4">
                            "{recommendation.companion_intro}"
                        </div>
                    )}

                    <p className="text-lg text-zinc-300 leading-relaxed mb-6 max-w-3xl">{recommendation.reasoning}</p>

                    {recommendation.decision_type && (
                        <div className="bg-black/30 border border-white/10 p-5 rounded-xl mb-6 max-w-3xl relative z-10">
                            <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                                ⚖️ Classification: <span className="text-[#5e6ad2]">{recommendation.decision_type}</span>
                            </h4>
                            {recommendation.reversibility_strategy && (
                                <p className="text-zinc-400 text-sm leading-relaxed">{recommendation.reversibility_strategy}</p>
                            )}
                        </div>
                    )}

                    <div className="flex flex-col md:flex-row gap-4 mb-6">
                        <div className="flex-1 inline-flex items-center gap-2 bg-black/40 backdrop-blur px-4 py-3 rounded-lg border border-white/5">
                            <span className="text-zinc-400 text-sm">Conviction Score:</span>
                            <span className="text-amber-500 font-bold text-lg">{recommendation.conviction_score}%</span>
                        </div>
                        {recommendation.certainty_score && (
                            <div className="flex-1 inline-flex items-center gap-2 bg-black/40 backdrop-blur px-4 py-3 rounded-lg border border-white/5">
                                <span className="text-zinc-400 text-sm">Certainty Score:</span>
                                <span className="text-blue-400 font-bold text-lg">{recommendation.certainty_score}%</span>
                            </div>
                        )}
                    </div>

                    {recommendation.conditional_factors && recommendation.conditional_factors.length > 0 && (
                        <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl mb-4">
                            <h4 className="text-amber-500 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                <AlertTriangle size={12} /> Conditional Factors
                            </h4>
                            <ul className="space-y-2">
                                {recommendation.conditional_factors.map((factor: string, i: number) => (
                                    <li key={i} className="text-sm text-zinc-300 flex items-start gap-2">
                                        <span className="text-amber-500 mt-1">•</span> {factor}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Detailed Analysis */}
                <div className="mb-12">
                    <h3 className="text-2xl font-light mb-6 text-white">Detailed Analysis</h3>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {options_analysis.map((opt: any, i: number) => (
                            <div key={i} className="bg-[#0F0F0F] border border-white/5 p-6 rounded-2xl">
                                <h4 className="text-lg font-bold text-white mb-4 border-b border-white/5 pb-2">{opt.title}</h4>

                                <div className="grid grid-cols-1 gap-6">
                                    <div>
                                        <p className="text-xs font-bold text-zinc-500 uppercase mb-2">Second-Order Consequences</p>
                                        <ul className="space-y-1">
                                            {opt.consequences.map((c: string, idx: number) => (
                                                <li key={idx} className="text-sm text-zinc-400 flex items-start gap-2">
                                                    <span className="text-zinc-600 mt-1">→</span> {c}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-zinc-500 uppercase mb-2">What must be true</p>
                                        <ul className="space-y-1">
                                            {opt.requirements.map((r: string, idx: number) => (
                                                <li key={idx} className="text-sm text-zinc-400 flex items-start gap-2">
                                                    <CheckCircle size={14} className="text-emerald-500/50 mt-1 shrink-0" /> {r}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Feature Discovery Nudge */}
                <div className="mb-12 bg-gradient-to-br from-amber-500/5 to-transparent border border-amber-500/10 rounded-2xl p-8">
                    <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                        💡 Want deeper clarity?
                    </h3>
                    <p className="text-sm text-zinc-400 mb-6">
                        Run these optional exercises to validate this verdict against your personal values and long-term vision.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Link
                            href={{
                                pathname: '/analyze/new',
                                query: {
                                    step: 'values',
                                    title: decision.title,
                                    context: decision.input_data?.context || ''
                                }
                            }}
                            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all group"
                        >
                            <div className="text-amber-500 text-xs font-bold mb-1 uppercase tracking-widest">Values Check</div>
                            <div className="text-zinc-400 text-sm group-hover:text-zinc-300 transition-colors">
                                Does this verdict align with what YOU actually optimize for?
                            </div>
                        </Link>
                        <Link
                            href={{
                                pathname: '/analyze/new',
                                query: {
                                    step: 'viz',
                                    title: decision.title,
                                    context: decision.input_data?.context || ''
                                }
                            }}
                            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all group"
                        >
                            <div className="text-amber-500 text-xs font-bold mb-1 uppercase tracking-widest">5-Year Visualization</div>
                            <div className="text-zinc-400 text-sm group-hover:text-zinc-300 transition-colors">
                                Picture yourself 5 years down each path. Which one feels right?
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Follow-up / Decision Thread Chat */}
                <div className="mb-12">
                    <DecisionChat
                        decisionId={decision.id}
                        title={decision.title}
                        context={decision.input_data?.context || 'No specific context provided.'}
                        verdict={recommendation.verdict}
                        initialPersona={decision.input_data?.personaMode || 'elon'}
                    />
                </div>
            </div>
        </div>
    );
}

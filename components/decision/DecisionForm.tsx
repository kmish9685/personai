'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AlertCircle, Loader2, ArrowRight, ArrowLeft, Check, Target, Clock, Shield, LifeBuoy, Crosshair, Sparkles } from 'lucide-react';
import { Paywall } from '@/components/Paywall';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

interface DecisionFormProps {
    initialValues?: any;
    vizData?: any;
    initialTitle?: string;
    initialContext?: string;
    personaMode?: 'challenger' | 'supportive';
    threadId?: string | null;
}

// --- Quiz Configuration ---
const STEPS = [
    {
        id: 'area',
        question: "What area is this decision about?",
        subtitle: "Pick the closest match",
        icon: Target,
        options: [
            { id: 'career', label: 'Career', emoji: '💼' },
            { id: 'startup', label: 'Startup / Business', emoji: '🚀' },
            { id: 'investment', label: 'Money / Investment', emoji: '💰' },
            { id: 'education', label: 'Education', emoji: '🎓' },
            { id: 'relationship', label: 'Relationship', emoji: '❤️' },
            { id: 'other', label: 'Other', emoji: '✦', hasInput: true },
        ]
    },
    {
        id: 'timeline',
        question: "What's your timeline?",
        subtitle: "When do you need to decide?",
        icon: Clock,
        options: [
            { id: 'now', label: 'Right now', emoji: '⚡' },
            { id: 'week', label: 'This week', emoji: '📅' },
            { id: 'month', label: 'This month', emoji: '🗓️' },
            { id: '3months', label: '1-3 months', emoji: '⏳' },
            { id: 'no_rush', label: 'No rush', emoji: '🧘' },
        ]
    },
    {
        id: 'risk',
        question: "What's at stake?",
        subtitle: "What could you lose?",
        icon: Shield,
        options: [
            { id: 'money_small', label: 'Money (< $1K)', emoji: '💵' },
            { id: 'money_medium', label: 'Money ($1K-$10K)', emoji: '💰' },
            { id: 'money_large', label: 'Money ($10K+)', emoji: '🏦' },
            { id: 'career', label: 'Job / Career', emoji: '💼' },
            { id: 'relationship', label: 'Relationship', emoji: '❤️' },
            { id: 'time', label: 'Time (months/years)', emoji: '⏰' },
            { id: 'reputation', label: 'Reputation', emoji: '🎭' },
        ]
    },
    {
        id: 'fallback',
        question: "If this fails, what's your Plan B?",
        subtitle: "Be honest with yourself",
        icon: LifeBuoy,
        options: [
            { id: 'return', label: 'Go back to current situation', emoji: '🔄' },
            { id: 'pivot', label: 'Try something else', emoji: '🔀' },
            { id: 'no_fallback', label: 'No fallback (all in)', emoji: '🎲' },
            { id: 'other', label: 'Other', emoji: '✦', hasInput: true },
        ]
    },
];

type QuizAnswers = Record<string, string>;

export function DecisionForm({ initialValues, vizData, initialTitle = '', initialContext = '', personaMode = 'challenger', threadId = null }: DecisionFormProps) {
    const router = useRouter();

    // Quiz state
    const [currentStep, setCurrentStep] = useState(0);
    const [answers, setAnswers] = useState<QuizAnswers>({});
    const [otherInputs, setOtherInputs] = useState<Record<string, string>>({});
    const [showOtherInput, setShowOtherInput] = useState<Record<string, boolean>>({});

    // Text step state
    const [title, setTitle] = useState(initialTitle);
    const [context, setContext] = useState(initialContext);

    // Kill signals state
    const [killSignals, setKillSignals] = useState({
        moneyLimit: '',
        timeLimit: '',
        custom: '',
    });

    // Submission state
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [showPaywall, setShowPaywall] = useState(false);
    const [showAchievement, setShowAchievement] = useState(false);

    // Usage state
    const [usageData, setUsageData] = useState<{ isPaid: boolean; remaining: number; limit: number; used: number } | null>(null);

    // Fetch usage on mount
    useEffect(() => {
        const fetchUsage = async () => {
            try {
                const res = await fetch('/api/usage');
                if (res.ok) {
                    const data = await res.json();
                    setUsageData(data);
                }
            } catch (e) {
                console.error("Failed to fetch usage data:", e);
            }
        };
        fetchUsage();
    }, []);

    // Total steps: quiz options (4) + text input (1) + kill signals (1) = 6
    const TOTAL_STEPS = STEPS.length + 2; // +1 for text, +1 for kill signals
    const progress = ((currentStep + 1) / TOTAL_STEPS) * 100;

    const isQuizStep = currentStep < STEPS.length;
    const isTextStep = currentStep === STEPS.length;
    const isKillSignalStep = currentStep === STEPS.length + 1;

    const handleOptionSelect = (stepId: string, optionId: string, hasInput?: boolean) => {
        if (hasInput) {
            setShowOtherInput(prev => ({ ...prev, [stepId]: true }));
            setAnswers(prev => ({ ...prev, [stepId]: optionId }));
            return; // Don't auto-advance for "Other"
        }

        setShowOtherInput(prev => ({ ...prev, [stepId]: false }));
        setAnswers(prev => ({ ...prev, [stepId]: optionId }));

        // Auto-advance after short delay
        setTimeout(() => {
            setCurrentStep(prev => prev + 1);
        }, 300);
    };

    const handleOtherConfirm = (stepId: string) => {
        if (otherInputs[stepId]?.trim()) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleTextNext = () => {
        if (!title.trim()) return;
        setCurrentStep(prev => prev + 1);
    };

    const handleSubmit = async () => {
        if (!title.trim()) return;

        // Show achievement briefly
        setShowAchievement(true);
        await new Promise(resolve => setTimeout(resolve, 2500));
        setShowAchievement(false);

        setIsSubmitting(true);
        setError('');

        try {
            // Build structured context from quiz answers
            const quizContext = Object.entries(answers).map(([stepId, optionId]) => {
                const step = STEPS.find(s => s.id === stepId);
                const option = step?.options.find(o => o.id === optionId);
                const customValue = otherInputs[stepId];
                const displayValue = optionId === 'other' && customValue ? customValue : option?.label;
                return `${step?.question} → ${displayValue}`;
            }).join('\n');

            const killSignalText = [
                killSignals.moneyLimit && `Stop if I lose more than $${killSignals.moneyLimit}`,
                killSignals.timeLimit && `Stop if it doesn't work in ${killSignals.timeLimit} months`,
                killSignals.custom && `Stop if: ${killSignals.custom}`,
            ].filter(Boolean).join('\n');

            const fullContext = [
                '--- STRUCTURED QUIZ ANSWERS ---',
                quizContext,
                '',
                '--- USER DESCRIPTION ---',
                context || '(No additional context provided)',
                '',
                killSignalText ? '--- KILL SIGNALS (User-defined exit conditions) ---' : '',
                killSignalText,
            ].filter(Boolean).join('\n');

            const payload = {
                title,
                context: fullContext,
                options: [],
                constraints: `Timeline: ${answers.timeline || 'unspecified'}. Fallback: ${answers.fallback || 'unspecified'}. Risk: ${answers.risk || 'unspecified'}.`,
                decisionType: answers.area || 'custom',
                values_profile: initialValues,
                five_year_viz: vizData?.scenarios,
                viz_clarity_achieved: vizData?.clarityAchieved,
                kill_signals: killSignals,
                personaMode,
                thread_id: threadId,
            };

            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            const responseData = await res.json();

            if (res.status === 403 && responseData.error === 'FREE_LIMIT_REACHED') {
                setShowPaywall(true);
                setIsSubmitting(false);
                return;
            }

            if (!res.ok) {
                throw new Error(responseData.error || `HTTP ${res.status}: Analysis failed`);
            }

            if (responseData.remaining_free !== undefined && responseData.remaining_free !== 'unlimited' && usageData) {
                setUsageData(prev => prev ? { ...prev, remaining: responseData.remaining_free } : null);
            }

            if (!responseData.id) {
                throw new Error('No decision ID returned from API');
            }

            router.push(`/analyze/${responseData.id}`);
        } catch (err: any) {
            console.error('Analysis error:', err);
            setError(err.message || 'Failed to generate analysis. Please try again.');
            setIsSubmitting(false);
        }
    };

    // --- Achievement Overlay ---
    if (showAchievement) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-2xl mx-auto text-center py-20"
            >
                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                    className="w-20 h-20 rounded-full bg-[#5e6ad2]/20 border border-[#5e6ad2]/40 flex items-center justify-center mx-auto mb-6"
                >
                    <Sparkles className="text-[#5e6ad2]" size={32} />
                </motion.div>
                <motion.h2
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-2xl font-light text-white mb-3"
                >
                    You're more prepared than 90% of people
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-zinc-500 text-sm"
                >
                    Most people wing it. You just defined your constraints, risks, and exit conditions.
                </motion.p>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    className="mt-8"
                >
                    <Loader2 size={20} className="animate-spin text-[#5e6ad2] mx-auto" />
                    <p className="text-xs text-zinc-600 mt-2">Running analysis...</p>
                </motion.div>
            </motion.div>
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto">
            {/* Usage Banner */}
            {usageData && !usageData.isPaid && !showAchievement && (
                <div className={clsx(
                    "mb-6 flex items-center justify-between p-3 rounded-lg border text-sm animate-fade-in",
                    usageData.remaining > 2 ? "bg-white/[0.03] border-white/10 text-zinc-400" :
                        usageData.remaining > 0 ? "bg-orange-500/10 border-orange-500/30 text-orange-200" :
                            "bg-red-500/10 border-red-500/30 text-red-200 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                )}>
                    <div className="flex items-center gap-2 font-medium">
                        {usageData.remaining === 0 ? (
                            <><AlertCircle size={16} className="text-red-400" /> Free limit reached</>
                        ) : usageData.remaining === 1 ? (
                            <><AlertCircle size={16} className="text-orange-400 animate-pulse" /> This is your last free decision</>
                        ) : (
                            <><Target size={16} className={usageData.remaining > 2 ? "text-zinc-500" : "text-orange-400"} /> {usageData.remaining} of {usageData.limit} free decisions left</>
                        )}
                    </div>
                </div>
            )}

            {/* Progress Bar */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-zinc-600 font-mono">
                        {currentStep + 1} / {TOTAL_STEPS}
                    </span>
                    <span className="text-xs text-zinc-600">
                        {Math.round(progress)}% complete
                    </span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-[#5e6ad2] to-[#7c85e0] rounded-full"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                </div>
            </div>

            {/* Error Display */}
            {error && (
                <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 flex items-start gap-3">
                    <AlertCircle size={20} className="text-red-500 shrink-0 mt-0.5" />
                    <div className="text-sm text-red-300">{error}</div>
                </div>
            )}

            {/* Step Content */}
            <AnimatePresence mode="wait">
                {/* --- QUIZ STEPS (Button Choices) --- */}
                {isQuizStep && (
                    <motion.div
                        key={`quiz-${currentStep}`}
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.2 }}
                    >
                        {(() => {
                            const step = STEPS[currentStep];
                            const StepIcon = step.icon;
                            return (
                                <div>
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="w-10 h-10 rounded-xl bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 flex items-center justify-center">
                                            <StepIcon size={18} className="text-[#5e6ad2]" />
                                        </div>
                                        <div>
                                            <h2 className="text-xl font-light text-white">{step.question}</h2>
                                            <p className="text-xs text-zinc-500">{step.subtitle}</p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
                                        {step.options.map((option) => (
                                            <button
                                                key={option.id}
                                                onClick={() => handleOptionSelect(step.id, option.id, option.hasInput)}
                                                className={clsx(
                                                    "group relative p-4 rounded-xl border text-left transition-all duration-200",
                                                    answers[step.id] === option.id
                                                        ? "bg-[#5e6ad2]/15 border-[#5e6ad2]/40 ring-1 ring-[#5e6ad2]/20"
                                                        : "bg-white/[0.02] border-white/10 hover:border-white/20 hover:bg-white/[0.04]"
                                                )}
                                            >
                                                <div className="text-xl mb-2">{option.emoji}</div>
                                                <div className={clsx(
                                                    "text-sm font-medium transition-colors",
                                                    answers[step.id] === option.id ? "text-[#5e6ad2]" : "text-white"
                                                )}>
                                                    {option.label}
                                                </div>
                                                {answers[step.id] === option.id && (
                                                    <div className="absolute top-2 right-2">
                                                        <Check size={14} className="text-[#5e6ad2]" />
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {/* "Other" text input */}
                                    {showOtherInput[step.id] && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-4"
                                        >
                                            <div className="flex gap-2">
                                                <input
                                                    type="text"
                                                    value={otherInputs[step.id] || ''}
                                                    onChange={(e) => setOtherInputs(prev => ({ ...prev, [step.id]: e.target.value }))}
                                                    placeholder="Type your answer..."
                                                    className="flex-1 bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white text-sm placeholder:text-zinc-600 focus:border-[#5e6ad2]/50 focus:outline-none"
                                                    autoFocus
                                                    onKeyDown={(e) => e.key === 'Enter' && handleOtherConfirm(step.id)}
                                                />
                                                <button
                                                    onClick={() => handleOtherConfirm(step.id)}
                                                    className="px-4 py-3 bg-[#5e6ad2] hover:bg-[#4f5bc4] text-white rounded-lg text-sm font-medium transition-colors"
                                                >
                                                    Next
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            );
                        })()}
                    </motion.div>
                )}

                {/* --- TEXT STEP --- */}
                {isTextStep && (
                    <motion.div
                        key="text-step"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 rounded-xl bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 flex items-center justify-center">
                                <Target size={18} className="text-[#5e6ad2]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-light text-white">Describe your decision</h2>
                                <p className="text-xs text-zinc-500">Be specific. The AI works from what you give it.</p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-widest">
                                    The Decision *
                                </label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="e.g., Should I quit my job to build my startup?"
                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white text-lg placeholder:text-zinc-600 focus:border-[#5e6ad2]/50 focus:outline-none transition-colors"
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-zinc-400 mb-2 uppercase tracking-widest">
                                    Additional Context <span className="text-zinc-600">(optional)</span>
                                </label>
                                <textarea
                                    value={context}
                                    onChange={(e) => setContext(e.target.value)}
                                    placeholder="Anything the AI should know: your situation, numbers, dependencies..."
                                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-600 focus:border-[#5e6ad2]/50 focus:outline-none transition-colors min-h-[120px] font-mono text-sm"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleTextNext}
                            disabled={!title.trim()}
                            className="mt-6 w-full py-4 bg-[#5e6ad2] hover:bg-[#4f5bc4] disabled:bg-[#5e6ad2]/30 disabled:cursor-not-allowed text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2"
                        >
                            Next: Define Kill Signals <ArrowRight size={16} />
                        </button>
                    </motion.div>
                )}

                {/* --- KILL SIGNALS STEP --- */}
                {isKillSignalStep && (
                    <motion.div
                        key="kill-signals"
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -30 }}
                        transition={{ duration: 0.2 }}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <Crosshair size={18} className="text-red-400" />
                            </div>
                            <div>
                                <h2 className="text-xl font-light text-white">Define your Kill Signals</h2>
                                <p className="text-xs text-zinc-500">Under what conditions will you STOP and walk away?</p>
                            </div>
                        </div>

                        <p className="text-sm text-zinc-400 mt-4 mb-6 leading-relaxed">
                            Most people drift for months on vibes. Kill signals force accountability <em>before</em> you start.
                            Define at least one.
                        </p>

                        <div className="space-y-4">
                            {/* Money Kill Signal */}
                            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 focus-within:border-[#5e6ad2]/30 transition-colors">
                                <label className="block text-xs font-bold text-red-400 mb-2 uppercase tracking-widest">
                                    💰 Money Limit
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-zinc-500 text-sm">Stop if I lose more than $</span>
                                    <input
                                        type="text"
                                        value={killSignals.moneyLimit}
                                        onChange={(e) => setKillSignals(prev => ({ ...prev, moneyLimit: e.target.value }))}
                                        placeholder="5,000"
                                        className="flex-1 bg-transparent border-b border-white/10 text-white py-1 px-2 text-sm focus:outline-none focus:border-[#5e6ad2]/50"
                                    />
                                </div>
                            </div>

                            {/* Time Kill Signal */}
                            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 focus-within:border-[#5e6ad2]/30 transition-colors">
                                <label className="block text-xs font-bold text-red-400 mb-2 uppercase tracking-widest">
                                    ⏰ Time Limit
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-zinc-500 text-sm">Stop if it doesn't work in</span>
                                    <input
                                        type="text"
                                        value={killSignals.timeLimit}
                                        onChange={(e) => setKillSignals(prev => ({ ...prev, timeLimit: e.target.value }))}
                                        placeholder="6"
                                        className="w-16 bg-transparent border-b border-white/10 text-white py-1 px-2 text-sm text-center focus:outline-none focus:border-[#5e6ad2]/50"
                                    />
                                    <span className="text-zinc-500 text-sm">months</span>
                                </div>
                            </div>

                            {/* Custom Kill Signal */}
                            <div className="bg-white/[0.02] border border-white/10 rounded-xl p-4 focus-within:border-[#5e6ad2]/30 transition-colors">
                                <label className="block text-xs font-bold text-red-400 mb-2 uppercase tracking-widest">
                                    🎯 Custom Condition
                                </label>
                                <div className="flex items-center gap-2">
                                    <span className="text-zinc-500 text-sm">Stop if:</span>
                                    <input
                                        type="text"
                                        value={killSignals.custom}
                                        onChange={(e) => setKillSignals(prev => ({ ...prev, custom: e.target.value }))}
                                        placeholder="e.g., my co-founder leaves, or I can't get 10 users"
                                        className="flex-1 bg-transparent border-b border-white/10 text-white py-1 px-2 text-sm focus:outline-none focus:border-[#5e6ad2]/50"
                                    />
                                </div>
                            </div>
                        </div>

                        <p className="text-xs text-zinc-600 mt-4 mb-6">
                            These will be included in your analysis. The AI will hold you accountable.
                        </p>

                        <button
                            onClick={handleSubmit}
                            disabled={isSubmitting || !title.trim()}
                            className="w-full py-5 bg-[#5e6ad2] hover:bg-[#4f5bc4] disabled:bg-[#5e6ad2]/50 text-white font-bold text-lg rounded-xl transition-all transform hover:scale-[1.02] disabled:hover:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 size={20} className="animate-spin" />
                                    Running Analysis...
                                </>
                            ) : (
                                <>
                                    <Sparkles size={18} />
                                    Analyze My Decision
                                </>
                            )}
                        </button>

                        <p className="text-center text-zinc-600 text-xs mt-4 uppercase tracking-widest">
                            ⚡ Analysis completes in ~30 seconds
                        </p>
                        {usageData && !usageData.isPaid && usageData.remaining !== null && (
                            <p className={clsx("text-center text-xs mt-2",
                                usageData.remaining > 0 ? "text-[#5e6ad2]/60" : "text-red-400"
                            )}>
                                {usageData.remaining > 0
                                    ? `${usageData.remaining} free ${usageData.remaining === 1 ? 'analysis' : 'analyses'} remaining`
                                    : 'You need to upgrade to run this analysis'
                                }
                            </p>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Back Button (visible on all steps except first) */}
            {currentStep > 0 && !showAchievement && (
                <button
                    onClick={handleBack}
                    className="mt-6 flex items-center gap-2 text-zinc-500 hover:text-white text-sm transition-colors mx-auto"
                >
                    <ArrowLeft size={14} /> Back
                </button>
            )}

            {/* Paywall Modal */}
            {showPaywall && (
                <Paywall
                    onClose={() => setShowPaywall(false)}
                    onSuccess={() => {
                        setShowPaywall(false);
                        handleSubmit();
                    }}
                />
            )}
        </div>
    );
}

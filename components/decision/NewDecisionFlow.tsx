'use client';

import { useState } from 'react';
import { DecisionForm } from '@/components/decision/DecisionForm';
import FiveYearViz, { FiveYearScenario } from '@/components/FiveYearViz';
import ValuesQuiz, { ValuesProfile } from '@/components/ValuesQuiz';
import { ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';

interface NewDecisionFlowProps {
    initialStep?: string;
    initialTitle?: string;
    initialContext?: string;
    threadId?: string | null;
}

export default function NewDecisionFlow({
    initialStep = 'form',
    initialTitle = '',
    initialContext = '',
    threadId = null
}: NewDecisionFlowProps) {
    const [step, setStep] = useState<'viz' | 'values' | 'form'>(
        (initialStep === 'viz' || initialStep === 'values') ? initialStep : 'form'
    );
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [personaMode, setPersonaMode] = useState<'challenger' | 'supportive'>('challenger');

    // Store data from previous steps to pass to final form
    const [vizData, setVizData] = useState<{ scenarios: FiveYearScenario[], clarityAchieved: boolean } | null>(null);
    const [valuesData, setValuesData] = useState<ValuesProfile | null>(null);

    const handleVizComplete = (scenarios: FiveYearScenario[], clarityAchieved: boolean) => {
        setVizData({ scenarios, clarityAchieved });
        setStep('form');
    };

    const handleValuesComplete = (values: ValuesProfile) => {
        setValuesData(values);
        setStep('form');
    };

    return (
        <div className="max-w-4xl mx-auto">
            {/* Progress / Navigation */}
            <div className="mb-8 flex items-center justify-between text-zinc-500 text-sm">
                <Link href="/" className="flex items-center hover:text-white transition-colors">
                    <ArrowLeft size={16} className="mr-2" /> Cancel
                </Link>

                {/* Advanced Options Toggle */}
                {step === 'form' && (
                    <button
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className="flex items-center gap-2 text-xs bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 px-3 py-1.5 rounded-full hover:bg-[#5e6ad2]/20 transition-colors text-[#5e6ad2]"
                    >
                        {showAdvanced ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        ⚡ Advanced Options
                    </button>
                )}
            </div>

            {/* Advanced Options Panel (Only show on form step) */}
            {step === 'form' && showAdvanced && (
                <div className="mb-6 bg-zinc-900/50 border border-white/10 rounded-2xl p-6 animate-fade-in">

                    <div className="mb-6">
                        <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-widest">Persona Tone</h3>
                        <div className="flex gap-4">
                            <button
                                onClick={() => setPersonaMode('challenger')}
                                className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all ${personaMode === 'challenger'
                                    ? 'bg-red-500/10 border-red-500/40 text-red-200'
                                    : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'
                                    }`}
                            >
                                👿 Devil's Advocate (Challenge Me)
                            </button>
                            <button
                                onClick={() => setPersonaMode('supportive')}
                                className={`flex-1 p-3 rounded-xl border text-sm font-medium transition-all ${personaMode === 'supportive'
                                    ? 'bg-[#5e6ad2]/15 border-[#5e6ad2]/40 text-[#5e6ad2]'
                                    : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10'
                                    }`}
                            >
                                🤝 Supportive Partner (Validate Me)
                            </button>
                        </div>
                    </div>

                    <h3 className="text-sm font-bold text-white mb-4 uppercase tracking-widest">Optional: Boost Accuracy</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button
                            onClick={() => setStep('viz')}
                            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all"
                        >
                            <div className="text-[#5e6ad2] text-xs font-bold mb-1">5-YEAR VISUALIZATION</div>
                            <div className="text-zinc-400 text-sm">Often reveals the answer in 10 minutes</div>
                        </button>
                        <button
                            onClick={() => setStep('values')}
                            className="p-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-left transition-all"
                        >
                            <div className="text-[#5e6ad2] text-xs font-bold mb-1">VALUES CLARIFICATION</div>
                            <div className="text-zinc-400 text-sm">+15% decision alignment accuracy</div>
                        </button>
                    </div>
                </div>
            )}

            {step === 'viz' && (
                <div className="animate-fade-in">
                    <FiveYearViz
                        onComplete={handleVizComplete}
                        onSkip={() => setStep('form')}
                    />
                </div>
            )}

            {step === 'values' && (
                <div className="animate-fade-in">
                    <ValuesQuiz
                        onComplete={handleValuesComplete}
                        onSkip={() => setStep('form')}
                    />
                </div>
            )}

            {step === 'form' && (
                <div className="animate-fade-in">
                    <DecisionForm
                        initialValues={valuesData}
                        vizData={vizData}
                        initialTitle={initialTitle}
                        initialContext={initialContext}
                        personaMode={personaMode}
                        threadId={threadId}
                    />
                </div>
            )}
        </div>
    );
}


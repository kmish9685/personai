import Link from 'next/link';
import { ArrowLeft, Check, X } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Persona AI vs Character AI - Why Founders Need Decision Engines',
    description: 'Compare Persona AI and Character.AI. See why Persona AI is the ultimate decision engine for entrepreneurs, replacing entertainment roleplay with hard constraints.',
};

export default function CompareCharacterAI() {
    return (
        <div className="min-h-screen font-sans selection:bg-[#5e6ad2]/30" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            {/* Header */}
            <header className="fixed top-0 w-full z-50 h-[52px] flex items-center px-6" style={{ background: 'rgba(10,10,11,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                        <ArrowLeft size={16} style={{ color: 'var(--text-secondary)' }} />
                        <span className="font-semibold text-[14px] tracking-[-0.02em] font-display" style={{ color: 'var(--text-primary)' }}>Back to Home</span>
                    </Link>
                </div>
            </header>

            {/* Content */}
            <div className="pt-32 pb-24 px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-6" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
                    <span className="text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--text-secondary)' }}>Comparison</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-semibold mb-6 tracking-tight">Persona AI vs Character AI</h1>
                <p className="text-xl leading-relaxed mb-12" style={{ color: 'var(--text-secondary)' }}>
                    Character AI is for entertainment, roleplay, and casual conversation. Persona AI is a decision engine that simulates the strategic frameworks of world-class operators to help you make high-conviction choices.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Persona AI */}
                    <div className="p-8 rounded-2xl relative overflow-hidden" style={{ background: 'var(--bg-elevated)', border: '1px solid #5e6ad2' }}>
                        <h2 className="text-2xl font-semibold mb-6">Persona AI</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Focuses on business & career decisions</span></li>
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Uses documented mental models (e.g. Inversion)</span></li>
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Provides hard boundaries and "Kill Signals"</span></li>
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Eliminates user indecision</span></li>
                        </ul>
                    </div>

                    {/* Character AI */}
                    <div className="p-8 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                        <h2 className="text-2xl font-semibold mb-6">Character AI</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Focuses on open roleplay</span></li>
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Simulates arbitrary personalities</span></li>
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Keeps users chatting endlessly</span></li>
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Optimized for engagement, not action</span></li>
                        </ul>
                    </div>
                </div>

                <h2 className="text-3xl font-semibold mb-6">Why Builders Choose Persona AI</h2>
                <div className="prose prose-invert border-l-2 pl-6 mb-12" style={{ borderColor: '#5e6ad2' }}>
                    <p className="text-[16px] leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                        If you want to talk to a fictional character for fun, Character AI is incredible. But if you have 6 months of runway left and need to ruthlessly prioritize your product roadmap, you don't want a chatty companion.
                    </p>
                    <p className="text-[16px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Persona AI uses the specific mental models of founders like Elon Musk and Paul Graham. We don't emulate their casual tone; we emulate their rigid problem-solving mechanics. Our tool forces constraints, evaluates risks, and delivers a binary verdict.
                    </p>
                </div>

                <div className="text-center pt-8">
                    <Link href="/analyze/new" className="inline-flex items-center gap-2 h-12 px-8 rounded-lg font-medium text-[15px] text-white transition-all hover:opacity-90" style={{ background: '#5e6ad2' }}>
                        Experience the Decision Engine
                    </Link>
                </div>
            </div>
        </div>
    );
}

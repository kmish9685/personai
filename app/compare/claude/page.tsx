import Link from 'next/link';
import { ArrowLeft, Check, X } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Persona AI vs Claude - The Alternative for Decision Engineering',
    description: 'Compare Persona AI and Anthropic Claude. While Claude is an excellent writer and coder, Persona AI forces strict decision frameworks, binary verdicts, and kill signals for founders.',
};

export default function CompareClaude() {
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

                <h1 className="text-4xl sm:text-5xl font-semibold mb-6 tracking-tight">Persona AI vs Claude</h1>
                <p className="text-xl leading-relaxed mb-12" style={{ color: 'var(--text-secondary)' }}>
                    Claude by Anthropic is one of the most powerful conversational models available, excelling at writing, coding, and long-context analysis. But when faced with a critical business decision, founders don't need a conversational partner—they need a strict analytical framework.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Persona AI */}
                    <div className="p-8 rounded-2xl relative overflow-hidden" style={{ background: 'var(--bg-elevated)', border: '1px solid #5e6ad2' }}>
                        <h2 className="text-2xl font-semibold mb-6">Persona AI</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Enforces mental models (Inversion, Leverage)</span></li>
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Outputs definitive YES/NO kill signals</span></li>
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Compresses decisions instead of expanding them</span></li>
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Built exclusively for founders & executives</span></li>
                        </ul>
                    </div>

                    {/* Claude */}
                    <div className="p-8 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                        <h2 className="text-2xl font-semibold mb-6">Claude</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Highly conversational and expansive</span></li>
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Aims for safety and nuanced hedging</span></li>
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Provides long lists of pros and cons</span></li>
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Built for general knowledge work</span></li>
                        </ul>
                    </div>
                </div>

                <h2 className="text-3xl font-semibold mb-6">The "Nuance Trap"</h2>
                <div className="prose prose-invert border-l-2 pl-6 mb-12" style={{ borderColor: '#5e6ad2' }}>
                    <p className="text-[16px] leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                        Claude is programmed to be helpful, harmless, and honest. In practice, this means when you ask it a high-stakes question like, "Should I fire my co-founder?", Claude will give you highly empathetic, nuanced advice. It will explore both sides endlessly. This is the <strong>Nuance Trap</strong>.
                    </p>
                    <p className="text-[16px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Persona AI bypasses the nuance trap. It applies the ruthless logic of top-tier operators. It will examine your runway, the equity split, and the opportunity cost, and it will give you a binary verdict: <em>Yes, you must fire them now, or the company dies in 6 months.</em> It prioritizes survival over empathy.
                    </p>
                </div>

                <div className="text-center pt-8">
                    <Link href="/analyze/new" className="inline-flex items-center gap-2 h-12 px-8 rounded-lg font-medium text-[15px] text-white transition-all hover:opacity-90" style={{ background: '#5e6ad2' }}>
                        Try the Decision Engine
                    </Link>
                </div>
            </div>
        </div>
    );
}

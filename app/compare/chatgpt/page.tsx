import Link from 'next/link';
import { ArrowLeft, Check, X } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Persona AI vs ChatGPT - Which is better for Decision Making?',
    description: 'Compare Persona AI and ChatGPT. See why founders choose Persona AI over ChatGPT for strategic decision making, kill signals, and binary verdicts.',
};

export default function CompareChatGPT() {
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

                <h1 className="text-4xl sm:text-5xl font-semibold mb-6 tracking-tight">Persona AI vs ChatGPT</h1>
                <p className="text-xl leading-relaxed mb-12" style={{ color: 'var(--text-secondary)' }}>
                    ChatGPT is the ultimate generalist. It can write code, draft emails, and brainstorm ideas. But when it comes to high-stakes decisions, you don't need a brainstorming buddy—you need a decision engine.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Persona AI */}
                    <div className="p-8 rounded-2xl relative overflow-hidden" style={{ background: 'var(--bg-elevated)', border: '1px solid #5e6ad2' }}>
                        <h2 className="text-2xl font-semibold mb-6">Persona AI</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Enforces structured decision frameworks</span></li>
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Delivers binary YES/NO verdicts</span></li>
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Identifies active "Kill Signals"</span></li>
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Optimized for founders and executives</span></li>
                        </ul>
                    </div>

                    {/* ChatGPT */}
                    <div className="p-8 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                        <h2 className="text-2xl font-semibold mb-6">ChatGPT</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Provides conversational options</span></li>
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Hedges answers ("it depends")</span></li>
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Acts as an agreeable assistant</span></li>
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Optimized for general mass market</span></li>
                        </ul>
                    </div>
                </div>

                <h2 className="text-3xl font-semibold mb-6">Why Founders Choose Persona AI</h2>
                <div className="prose prose-invert border-l-2 pl-6 mb-12" style={{ borderColor: '#5e6ad2' }}>
                    <p className="text-[16px] leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                        When you ask ChatGPT "Should I quit my job to build a startup?", it will give you a bulleted list of pros and cons. It leaves the cognitive load of deciding entirely on your shoulders.
                    </p>
                    <p className="text-[16px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        When you ask Persona AI the exact same question, it computes constraints. It asks for your runway, your risk tolerance, and it runs a pre-mortem. Ultimately, it gives you a direct verdict and concrete conditions under which you should kill the idea entirely. It doesn't chat; it decides.
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

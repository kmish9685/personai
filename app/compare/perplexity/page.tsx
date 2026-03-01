import Link from 'next/link';
import { ArrowLeft, Check, X } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Persona AI vs Perplexity - Discovery vs Decision Making',
    description: 'Compare Persona AI and Perplexity AI. See why Perplexity is the best tool for researching facts, while Persona AI is the only tool for engineering strategic decisions.',
};

export default function ComparePerplexity() {
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

                <h1 className="text-4xl sm:text-5xl font-semibold mb-6 tracking-tight">Persona AI vs Perplexity</h1>
                <p className="text-xl leading-relaxed mb-12" style={{ color: 'var(--text-secondary)' }}>
                    Perplexity is an answers engine. It is the best tool in the world for finding out <em>what is</em>. Persona AI is a decision engine. It is the best tool for deciding <em>what you should do about it</em>.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Persona AI */}
                    <div className="p-8 rounded-2xl relative overflow-hidden" style={{ background: 'var(--bg-elevated)', border: '1px solid #5e6ad2' }}>
                        <h2 className="text-2xl font-semibold mb-6">Persona AI</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Focuses on internal constraints & strategy</span></li>
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Computes subjective tradeoffs</span></li>
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Delivers convicted YES/NO outcomes</span></li>
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Used for closing the execution gap</span></li>
                        </ul>
                    </div>

                    {/* Perplexity */}
                    <div className="p-8 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                        <h2 className="text-2xl font-semibold mb-6">Perplexity AI</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Focuses on external facts & web citations</span></li>
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Presents multiple objective viewpoints</span></li>
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Leaves the final synthesis to the user</span></li>
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Used for research and fact-finding</span></li>
                        </ul>
                    </div>
                </div>

                <h2 className="text-3xl font-semibold mb-6">Information vs. Action</h2>
                <div className="prose prose-invert border-l-2 pl-6 mb-12" style={{ borderColor: '#5e6ad2' }}>
                    <p className="text-[16px] leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                        If you need to know the market size of B2B SaaS in Europe, use Perplexity. It will cite sources, scrape the live web, and give you an immaculately accurate summary of the landscape.
                    </p>
                    <p className="text-[16px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        But if you need to know if <strong>YOU</strong>—a solo founder with 4 months of runway and a background in design—should build a B2B SaaS tool in Europe right now? Perplexity cannot answer that. Persona AI can. We ingest your specific constraints, run them through proven entrepreneurial mental models, and give you a verdict.
                    </p>
                </div>

                <div className="text-center pt-8">
                    <Link href="/analyze/new" className="inline-flex items-center gap-2 h-12 px-8 rounded-lg font-medium text-[15px] text-white transition-all hover:opacity-90" style={{ background: '#5e6ad2' }}>
                        Stop Researching. Start Deciding.
                    </Link>
                </div>
            </div>
        </div>
    );
}

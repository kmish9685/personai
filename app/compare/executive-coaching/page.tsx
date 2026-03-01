import Link from 'next/link';
import { ArrowLeft, Check, X } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Persona AI vs Executive Coaching - The AI Alternative to $500/hr Advice',
    description: 'Can AI replace executive coaches? Compare Persona AI decision-making algorithms vs traditional human executive coaching for founders and CEOs.',
};

export default function CompareExecutiveCoaching() {
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

                <h1 className="text-4xl sm:text-5xl font-semibold mb-6 tracking-tight">Persona AI vs Executive Coaching</h1>
                <p className="text-xl leading-relaxed mb-12" style={{ color: 'var(--text-secondary)' }}>
                    High-performance founders rely on executive coaches to clarify their thinking. Persona AI digitizes the analytical rigor of world-class coaching into an instant, ruthless decision engine.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                    {/* Persona AI */}
                    <div className="p-8 rounded-2xl relative overflow-hidden" style={{ background: 'var(--bg-elevated)', border: '1px solid #5e6ad2' }}>
                        <h2 className="text-2xl font-semibold mb-6">Persona AI</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Immediate analysis (under 30 seconds)</span></li>
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Simulates top 1% billionaire frameworks</span></li>
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Zero emotional bias or social friction</span></li>
                            <li className="flex items-start gap-3"><Check size={20} style={{ color: '#4dac68' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Costs a fraction of a single therapy hour</span></li>
                        </ul>
                    </div>

                    {/* Executive Coach */}
                    <div className="p-8 rounded-2xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)' }}>
                        <h2 className="text-2xl font-semibold mb-6">Executive Coaching</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Requires scheduling over weeks/months</span></li>
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Subject to normal human cognitive biases</span></li>
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Can unconsciously validate your bad ideas</span></li>
                            <li className="flex items-start gap-3"><X size={20} style={{ color: '#e05d5d' }} className="shrink-0 mt-0.5" /> <span className="text-[15px]">Typically costs $300-$1000+ per hour</span></li>
                        </ul>
                    </div>
                </div>

                <h2 className="text-3xl font-semibold mb-6">When to Use Which</h2>
                <div className="prose prose-invert border-l-2 pl-6 mb-12" style={{ borderColor: '#5e6ad2' }}>
                    <p className="text-[16px] leading-relaxed mb-4" style={{ color: 'var(--text-secondary)' }}>
                        A great human executive coach is invaluable for deep behavioral change, emotional support, and navigating complex interpersonal office politics over a multi-year horizon. We do not replace deep psychological work.
                    </p>
                    <p className="text-[16px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        However, when you need strict, analytical <strong>strategic clarity</strong> on a product pivot, a firing decision, or an acquisition offer at 2:00 AM on a Sunday, you can't wait for a Zoom call. Persona AI applies the documented mental models of operators like Paul Graham and Peter Thiel to your immediate problem, enforcing constraints and producing a binary action plan immediately.
                    </p>
                </div>

                <div className="text-center pt-8">
                    <Link href="/analyze/new" className="inline-flex items-center gap-2 h-12 px-8 rounded-lg font-medium text-[15px] text-white transition-all hover:opacity-90" style={{ background: '#5e6ad2' }}>
                        Get Immediate Clarity
                    </Link>
                </div>
            </div>
        </div>
    );
}

import Link from 'next/link';
import { ArrowLeft, BookOpen } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Decision Framework Guides | Persona AI',
    description: 'Learn the core mental models used by Persona AI, including Inversion, Leverage Analysis, and First Principles thinking. The ultimate repository of decision engineering frameworks.',
};

export default function GuidesIndex() {
    const guides = [
        {
            id: 'inversion-framework',
            title: 'The Inversion Framework',
            description: 'How to solve impossible problems by figuring out how to guarantee failure, and avoiding those steps.',
            author: 'Inspired by Charlie Munger & Elon Musk',
            date: 'Updated automatically via Persona AI'
        },
        {
            id: 'leverage-analysis',
            title: 'Leverage Analysis',
            description: 'Understanding permissionless leverage, code, and media to build wealth without renting out your time.',
            author: 'Inspired by Naval Ravikant',
            date: 'Updated automatically via Persona AI'
        }
    ];

    return (
        <div className="min-h-screen font-sans selection:bg-[#5e6ad2]/30" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            <header className="fixed top-0 w-full z-50 h-[52px] flex items-center px-6" style={{ background: 'rgba(10,10,11,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                        <ArrowLeft size={16} style={{ color: 'var(--text-secondary)' }} />
                        <span className="font-semibold text-[14px] tracking-[-0.02em] font-display" style={{ color: 'var(--text-primary)' }}>Back to Home</span>
                    </Link>
                </div>
            </header>

            <div className="pt-32 pb-24 px-6 lg:px-8 max-w-4xl mx-auto">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-6" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
                    <BookOpen size={14} style={{ color: '#5e6ad2' }} />
                    <span className="text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--text-secondary)' }}>Definitive Guides</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-semibold mb-6 tracking-tight">The Decision Library</h1>
                <p className="text-xl leading-relaxed mb-16" style={{ color: 'var(--text-secondary)' }}>
                    Persona AI does not chat; it computes. It uses specific, documented mental models to ingest constraints and output verdicts. Read our definitive guides on how these underlying algorithms work.
                </p>

                <div className="grid gap-6">
                    {guides.map((guide) => (
                        <Link
                            key={guide.id}
                            href={`/guides/${guide.id}`}
                            className="group block p-8 rounded-2xl transition-all hover:-translate-y-1"
                            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}
                        >
                            <h2 className="text-2xl font-semibold mb-3 group-hover:text-[#5e6ad2] transition-colors">{guide.title}</h2>
                            <p className="text-[16px] leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
                                {guide.description}
                            </p>
                            <div className="flex items-center justify-between text-[13px] font-medium" style={{ color: 'var(--text-tertiary)' }}>
                                <span>{guide.author}</span>
                                <span className="uppercase tracking-[0.06em] text-[11px] group-hover:text-white transition-colors">Read Guide →</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

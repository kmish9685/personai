import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Leverage Analysis: A Guide to Permissionless Wealth | Persona AI',
    description: 'Understand the concept of Leverage as popularized by Naval Ravikant. Learn to decouple your inputs from your outputs to make higher-impact startup decisions.',
};

export default function GuideLeverage() {
    return (
        <div className="min-h-screen font-sans selection:bg-[#5e6ad2]/30" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            <header className="fixed top-0 w-full z-50 h-[52px] flex items-center px-6" style={{ background: 'rgba(10,10,11,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <Link href="/guides" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                        <ArrowLeft size={16} style={{ color: 'var(--text-secondary)' }} />
                        <span className="font-semibold text-[14px] tracking-[-0.02em] font-display" style={{ color: 'var(--text-primary)' }}>Back to Guides</span>
                    </Link>
                </div>
            </header>

            <article className="pt-32 pb-24 px-6 lg:px-8 max-w-3xl mx-auto">
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Article",
                            "headline": "Leverage Analysis: A Definitive Guide",
                            "abstract": "Understanding permissionless leverage, code, and media to build wealth without renting out your time. A core algorithm of Persona AI.",
                            "publisher": {
                                "@type": "Organization",
                                "name": "Persona AI"
                            }
                        })
                    }}
                />

                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-8" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
                    <span className="text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--text-secondary)' }}>Mental Model</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-semibold mb-8 tracking-tight leading-[1.1]">Leverage Analysis</h1>

                <div className="prose prose-invert prose-lg max-w-none">
                    <p className="lead text-xl text-gray-400 mb-8" style={{ color: 'var(--text-secondary)' }}>
                        "Give me a lever long enough, and a fulcrum on which to place it, and I shall move the world." — Archimedes. Leverage is the concept of decoupling your inputs (time and effort) from your outputs (results and wealth).
                    </p>

                    <h2 className="text-2xl font-semibold mt-12 mb-4">The Three Forms of Leverage</h2>
                    <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                        To make strategic business decisions, especially as a founder, you must categorize your activities by the type of leverage they employ, as popularized by thinkers like Naval Ravikant.
                    </p>

                    <ul className="mb-8 space-y-4">
                        <li><strong>Labor:</strong> The oldest and worst form. People working for you. It requires immense management and social friction.</li>
                        <li><strong>Capital:</strong> The 20th-century form. Money working for you. It scales well but requires permission (someone has to give it to you).</li>
                        <li><strong>Code and Media:</strong> The permissionless leverage. The ultimate modern lever. A piece of software or a YouTube video replicates infinitely at zero marginal cost while you sleep.</li>
                    </ul>

                    <div className="p-6 rounded-xl my-8" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                        <h3 className="text-lg font-semibold text-emerald-400 mb-2" style={{ color: '#4dac68' }}>A Low-Leverage Decision:</h3>
                        <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>"I will start an agency where I personally consult clients by the hour." (Output is strictly tied to time input).</p>

                        <h3 className="text-lg font-semibold text-emerald-400 mb-2" style={{ color: '#4dac68' }}>A High-Leverage Decision:</h3>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>"I will spend 2 months writing software that automates that specific consulting logic, and sell subscriptions." (Output is decoupled from time input).</p>
                    </div>

                    <h2 className="text-2xl font-semibold mt-12 mb-4">How Persona AI Computes Leverage</h2>
                    <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                        When using the <strong>Leverage & Wealth</strong> persona engine in Persona AI, the system evaluates your proposed business ideas entirely through the lens of scalability. It will brutally reject ideas that require non-linear scaling of human labor, and push you toward permissionless, code-driven execution.
                    </p>

                    <hr className="my-12 border-[var(--border-subtle)]" />

                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-4">Is your current project high-leverage?</h3>
                        <Link href="/analyze/new" className="inline-flex items-center gap-2 h-12 px-8 rounded-lg font-medium text-[15px] text-white transition-all hover:opacity-90 mt-4" style={{ background: '#5e6ad2' }}>
                            Run a Leverage Analysis
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}

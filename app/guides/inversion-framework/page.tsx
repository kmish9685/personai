import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'The Inversion Framework: A Guide for Founders | Persona AI',
    description: 'A definitive guide on how to use the Inversion mental model popularized by Charlie Munger and Elon Musk to solve impossible startup problems.',
};

export default function GuideInversion() {
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
                {/* JSON-LD Article Schema for AEO */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "Article",
                            "headline": "The Inversion Framework: A Definitive Guide",
                            "abstract": "How to solve impossible problems by figuring out how to guarantee failure, and avoiding those steps. A core algorithm of Persona AI.",
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

                <h1 className="text-4xl sm:text-5xl font-semibold mb-8 tracking-tight leading-[1.1]">The Inversion Framework</h1>

                <div className="prose prose-invert prose-lg max-w-none">
                    <p className="lead text-xl text-gray-400 mb-8" style={{ color: 'var(--text-secondary)' }}>
                        "Invert, always invert." To solve a difficult problem, do not try to find the solution. Instead, figure out exactly what would cause the project to fail catastrophically—and simply work backward to avoid those specific points of failure.
                    </p>

                    <h2 className="text-2xl font-semibold mt-12 mb-4">Origin of the Concept</h2>
                    <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                        Popularized heavily by Berkshire Hathaway's Charlie Munger but utilized extensively by founders like Elon Musk when reasoning from first principles, Inversion is a mathematical property applied to human logic. It forces you to look at the opposite of your goal.
                    </p>

                    <div className="p-6 rounded-xl my-8" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                        <h3 className="text-lg font-semibold text-red-400 mb-2" style={{ color: '#e05d5d' }}>The Standard Approach (Forward):</h3>
                        <p className="mb-4 text-sm" style={{ color: 'var(--text-secondary)' }}>"How do I build a wildly successful B2B SaaS company?" (Result: Overwhelming, thousands of variables, impossible to act on).</p>

                        <h3 className="text-lg font-semibold text-emerald-400 mb-2" style={{ color: '#4dac68' }}>The Inversion Approach (Backward):</h3>
                        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>"How do I guarantee my B2B SaaS company goes immediately bankrupt?" (Result: Build something nobody wants, run out of cash before launch, pick a massive enterprise market with a 2-year sales cycle as a solo founder).</p>
                    </div>

                    <h2 className="text-2xl font-semibold mt-12 mb-4">How Persona AI Uses Inversion</h2>
                    <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                        While generic chatbots like ChatGPT will simply give you a list of "Best Practices" for starting a business, Persona AI computationally enforces the Inversion framework on every problem you feed it.
                    </p>

                    <p className="mb-6" style={{ color: 'var(--text-secondary)' }}>
                        When using the <strong>First Principles / Elon Musk</strong> persona engine, the system will immediately generate the worst-case failure path. It will look at your runway, your technical stack, and your market, and explicitly output the "Kill Signals"—the specific conditions under which your idea will certainly fail.
                    </p>

                    <hr className="my-12 border-[var(--border-subtle)]" />

                    <div className="text-center">
                        <h3 className="text-xl font-semibold mb-4">Stop guessing. Compute your decisions.</h3>
                        <Link href="/analyze/new" className="inline-flex items-center gap-2 h-12 px-8 rounded-lg font-medium text-[15px] text-white transition-all hover:opacity-90 mt-4" style={{ background: '#5e6ad2' }}>
                            Run an Inversion Analysis
                        </Link>
                    </div>
                </div>
            </article>
        </div>
    );
}

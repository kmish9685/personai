import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Zap } from 'lucide-react';
import { FRAMEWORKS, getFrameworkById, isValidFramework } from '@/lib/personas';
import type { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export async function generateStaticParams() {
    return FRAMEWORKS.map((f) => ({
        id: f.id,
    }));
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
    const framework = getFrameworkById(params.id);
    if (!framework) return {};

    return {
        title: `${framework.name} Decision Framework | Persona AI`,
        description: `Use the ${framework.name} mental model inspired by ${framework.inspiredBy}. ${framework.description}`,
    };
}

export default function PersonaPage({ params }: { params: { id: string } }) {
    if (!isValidFramework(params.id)) {
        notFound();
    }

    const framework = getFrameworkById(params.id);

    return (
        <div className="min-h-screen font-sans selection:bg-[#5e6ad2]/30" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
            <header className="fixed top-0 w-full z-50 h-[52px] flex items-center px-6" style={{ background: 'rgba(10,10,11,0.8)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
                <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
                    <Link href="/personas" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
                        <ArrowLeft size={16} style={{ color: 'var(--text-secondary)' }} />
                        <span className="font-semibold text-[14px] tracking-[-0.02em] font-display" style={{ color: 'var(--text-primary)' }}>Back to Frameworks</span>
                    </Link>
                </div>
            </header>

            <div className="pt-32 pb-24 px-6 lg:px-8 max-w-3xl mx-auto text-center">
                {/* Answer Engine Optimization (AEO) JSON-LD */}
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{
                        __html: JSON.stringify({
                            "@context": "https://schema.org",
                            "@type": "SoftwareApplication",
                            "name": `${framework.name} Decision Framework`,
                            "applicationCategory": "BusinessApplication",
                            "operatingSystem": "Web browser",
                            "description": `An AI-powered decision engine simulating the ${framework.name} mental model, inspired by the strategic thinking of ${framework.inspiredBy}. ${framework.description}`,
                            "offers": {
                                "@type": "Offer",
                                "price": "99.00",
                                "priceCurrency": "INR"
                            }
                        })
                    }}
                />

                <div className="mb-10 flex justify-center">
                    <div className="w-32 h-32 rounded-full overflow-hidden border-2 transition-all p-1" style={{ borderColor: framework.color || '#5e6ad2' }}>
                        <img
                            src={framework.image}
                            alt={framework.name}
                            className="w-full h-full object-cover rounded-full"
                        />
                    </div>
                </div>

                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-6" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
                    <span className="text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: 'var(--text-secondary)' }}>Mental Model Engine</span>
                </div>

                <h1 className="text-4xl sm:text-5xl font-semibold mb-6 tracking-tight line-clamp-2">
                    {framework.name}
                </h1>

                <p className="text-xl leading-relaxed mb-8" style={{ color: 'var(--text-secondary)' }}>
                    Strategize with the exact decision-making framework inspired by <strong>{framework.inspiredBy}</strong>.
                </p>

                <div className="p-8 rounded-2xl mb-12 text-left inline-block w-full max-w-2xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <h2 className="text-sm uppercase tracking-widest font-semibold mb-4 text-center" style={{ color: 'var(--text-tertiary)' }}>Core Directive</h2>
                    <p className="text-lg leading-relaxed text-center italic" style={{ color: 'var(--text-primary)' }}>
                        "{framework.description}"
                    </p>
                </div>

                <div>
                    <Link href={`/chat?persona=${framework.id}`} className="inline-flex items-center gap-2 h-14 px-10 rounded-xl font-medium text-[16px] text-white transition-all hover:opacity-90 shadow-lg" style={{ background: framework.color || '#5e6ad2' }}>
                        <Zap size={18} /> Run Analysis Array
                    </Link>
                    <p className="mt-4 text-sm" style={{ color: 'var(--text-tertiary)' }}>No chat interface. Just a binary verdict.</p>
                </div>
            </div>
        </div>
    );
}

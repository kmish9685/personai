'use client';

const TESTIMONIALS = [
    {
        quote: "I fired my co-founder after a 20-minute session with the Simplicity framework. It was brutal, but it was the right call. Saved my company.",
        author: "Tech Founder",
        role: "Seed Stage SaaS",
        metric: "Saved 6mo Runway"
    },
    {
        quote: "The Inversion framework tore apart my unit economics. I realized I was scaling a loss. Pivoted to enterprise sales the next week.",
        author: "Growth Lead",
        role: "E-commerce Aggregator",
        metric: "+40% Margins"
    },
    {
        quote: "I stopped asking my friends for advice. They are too nice. This thing doesn't care about my feelings, only my success.",
        author: "Solopreneur",
        role: "Indie Hacker",
        metric: "Launched in 4 Days"
    }
];

export default function TestimonialSection() {
    return (
        <section className="relative z-10 px-6 lg:px-8 py-24 border-y" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-14">
                    <h2 className="text-3xl sm:text-[44px] font-semibold mb-3" style={{ letterSpacing: '-0.03em' }}>Wall of truth.</h2>
                    <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>Real founders. Real breakthroughs.</p>
                </div>

                {/* Linear testimonial strip: 1px gap grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px]" style={{ background: 'var(--border-subtle)' }}>
                    {TESTIMONIALS.map((t, i) => (
                        <div key={i} className="p-8 relative" style={{ background: 'var(--bg-base)' }}>
                            {/* Linear-style quote mark — subtle, using accent */}
                            <div className="text-[40px] leading-none font-serif mb-4 opacity-15" style={{ color: '#5e6ad2' }}>"</div>

                            <p className="text-[15px] leading-relaxed mb-8" style={{ color: 'var(--text-secondary)', fontStyle: 'normal' }}>
                                {t.quote}
                            </p>

                            <div className="mt-auto pt-5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-[13px] font-medium" style={{ color: 'var(--text-primary)' }}>{t.author}</div>
                                        <div className="text-[11px] uppercase tracking-[0.06em]" style={{ color: 'var(--text-tertiary)' }}>{t.role}</div>
                                    </div>
                                    <div className="text-[11px] font-medium px-2 py-1 rounded" style={{ background: 'rgba(77,172,104,0.12)', color: '#4dac68' }}>
                                        {t.metric}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

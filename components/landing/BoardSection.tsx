'use client';

import { PERSONAS } from '@/lib/personas';
import { Brain, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function BoardSection() {
    return (
        <section className="relative z-10 px-6 lg:px-8 py-24 border-y" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-6" style={{ background: 'rgba(94,106,210,0.15)', border: '1px solid rgba(94,106,210,0.2)' }}>
                        <Brain size={12} style={{ color: '#5e6ad2' }} />
                        <span className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: '#5e6ad2' }}>Decision Frameworks</span>
                    </div>
                    <h2 className="text-3xl sm:text-[44px] font-semibold mb-4" style={{ letterSpacing: '-0.03em' }}>
                        Your personal{' '}
                        <span className="text-gradient">decision frameworks.</span>
                    </h2>
                    <p className="text-[15px] max-w-xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                        Don't just chat. Decide. Each framework is engineered to attack your problem from a specific, high-leverage angle.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px]" style={{ background: 'var(--border-subtle)' }}>
                    {PERSONAS.map((persona) => (
                        <div key={persona.id} className="group p-6 flex items-start gap-5 transition-all" style={{ background: 'var(--bg-base)' }}>
                            {/* Avatar */}
                            <div className="shrink-0 relative">
                                <div className="w-14 h-14 rounded-lg overflow-hidden transition-all" style={{ border: '1px solid var(--border-default)' }}>
                                    <img
                                        src={persona.image}
                                        alt={persona.name}
                                        className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-300"
                                    />
                                </div>
                                <div className="absolute -bottom-1.5 -right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-semibold transition-colors" style={{ background: 'var(--bg-base)', border: '1px solid var(--border-default)', color: 'var(--text-tertiary)' }}>
                                    {persona.name.charAt(0)}
                                </div>
                            </div>

                            {/* Content */}
                            <div>
                                <h3 className="text-[15px] font-semibold mb-0.5 group-hover:text-[#5e6ad2] transition-colors" style={{ color: 'var(--text-primary)' }}>{persona.name}</h3>
                                <div className="text-[11px] font-medium uppercase tracking-[0.06em] mb-2" style={{ color: 'var(--text-tertiary)' }}>{persona.tagline}</div>
                                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                                    {persona.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-12 text-center">
                    <Link href="/personas" className="inline-flex items-center gap-2 text-[13px] font-medium transition-colors hover:text-white group" style={{ color: 'var(--text-secondary)' }}>
                        Explore all frameworks <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

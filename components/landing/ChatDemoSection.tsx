'use client';

import { MessageSquare, User, Bot, Zap, X } from 'lucide-react';

export default function ChatDemoSection() {
    return (
        <section className="relative z-10 px-6 lg:px-8 py-24 border-t" style={{ background: 'var(--bg-base)', borderColor: 'var(--border-subtle)' }}>
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-14">
                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-6" style={{ background: 'rgba(94,106,210,0.15)', border: '1px solid rgba(94,106,210,0.2)' }}>
                        <MessageSquare size={12} style={{ color: '#5e6ad2' }} />
                        <span className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: '#5e6ad2' }}>Framework Chat Mode</span>
                    </div>
                    <h2 className="text-3xl sm:text-[44px] font-semibold mb-3" style={{ letterSpacing: '-0.03em' }}>Don't chat. Decide.</h2>
                    <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>Standard bots agree with you. Frameworks challenge you.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px]" style={{ background: 'var(--border-subtle)' }}>

                    {/* LEFT: Standard Chatbot */}
                    <div className="p-8 opacity-60 hover:opacity-100 transition-opacity duration-300" style={{ background: 'var(--bg-base)' }}>
                        <div className="mb-5">
                            <h3 className="text-[11px] font-medium uppercase tracking-[0.06em]" style={{ color: 'var(--text-tertiary)' }}>Standard AI Chat</h3>
                        </div>
                        <div className="space-y-5">
                            {/* User Message */}
                            <div className="flex gap-3">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--bg-active)' }}><User size={13} style={{ color: 'var(--text-secondary)' }} /></div>
                                <div className="rounded-lg p-3 text-[13px] max-w-[85%]" style={{ background: 'var(--bg-elevated)', color: 'var(--text-primary)' }}>
                                    I'm worried my pricing is too high at $99. Should I lower it?
                                </div>
                            </div>

                            {/* Bot Message */}
                            <div className="flex gap-3">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--bg-active)' }}><Bot size={13} style={{ color: 'var(--text-tertiary)' }} /></div>
                                <div className="rounded-lg p-3 text-[13px] space-y-2" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                                    <p>Pricing is a difficult decision. There are pros and cons to lowering it.</p>
                                    <p>If you lower it, you might get more customers, but your margin will decrease. If you keep it high, you confirm premium value.</p>
                                    <p>Maybe you could try A/B testing or running a discount campaign to see what happens?</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Inversion Framework */}
                    <div className="p-8 relative" style={{ background: 'var(--bg-elevated)' }}>
                        <div className="absolute top-4 right-4 opacity-10"><Zap size={20} style={{ color: '#5e6ad2' }} /></div>
                        <div className="mb-5">
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em]" style={{ color: '#5e6ad2' }}>Inversion Framework</h3>
                        </div>
                        <div className="space-y-5">
                            {/* User Message */}
                            <div className="flex gap-3">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0" style={{ background: 'var(--bg-active)' }}><User size={13} style={{ color: 'var(--text-secondary)' }} /></div>
                                <div className="rounded-lg p-3 text-[13px] max-w-[85%]" style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }}>
                                    I'm worried my pricing is too high at $99. Should I lower it?
                                </div>
                            </div>

                            {/* Bot Message */}
                            <div className="flex gap-3">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 overflow-hidden" style={{ background: 'rgba(94,106,210,0.15)', boxShadow: '0 0 8px rgba(94,106,210,0.3)' }}>
                                    <img src="/personas/elon.jpg" className="w-full h-full object-cover opacity-80" alt="Elon" />
                                </div>
                                <div className="rounded-lg p-3 text-[13px] space-y-2" style={{ background: 'rgba(94,106,210,0.08)', border: '1px solid rgba(94,106,210,0.15)', color: 'var(--text-primary)' }}>
                                    <p className="accent-label mb-1">Thinking from First Principles:</p>
                                    <p>Wrong question. The price is irrelevant if the value is infinite.</p>
                                    <p>If the product actually works, $99 is free. If it doesn't, $0 is too expensive.</p>
                                    <p className="font-semibold pl-3" style={{ borderLeft: '2px solid #5e6ad2' }}>Fix the product, not the price.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}

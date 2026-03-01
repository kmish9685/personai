'use client';

import Link from 'next/link';
import { Mail, MapPin, Phone } from 'lucide-react';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

function ContactContent() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-white/30">
            {/* Background Decor */}
            <div className="fixed inset-0 z-0 pointer-events-none">
                <div className="absolute top-[20%] right-[20%] w-[40%] h-[40%] bg-white/5 rounded-full blur-[120px]" />
            </div>

            {/* Header */}
            <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <img src="/logo.png" alt="Persona AI" className="w-8 h-8 rounded-lg" />
                            <span className="font-bold text-lg tracking-tight text-white">Persona AI</span>
                        </Link>

                        <div className="flex items-center gap-6">
                            <Link href="/about" className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white transition-colors">About</Link>
                            <Link href="/#pricing" className="hidden sm:block text-sm font-medium text-zinc-400 hover:text-white transition-colors">Pricing</Link>
                            <Link
                                href="/chat"
                                className="px-5 py-2 text-sm font-medium bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full transition-all backdrop-blur-md"
                            >
                                Start Now
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="relative z-10 max-w-3xl mx-auto px-4 py-20">
                <h1 className="text-4xl sm:text-5xl font-bold mb-8 tracking-tight">Get in touch</h1>
                <p className="text-xl text-zinc-400 mb-12 leading-relaxed">
                    Have a question or feedback? We're here to help. Reach out to us directly.
                </p>

                <div className="grid gap-6">
                    <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                            <Mail className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-1">Email</h3>
                            <a href="mailto:kmish9685@gmail.com" className="text-lg font-medium text-white hover:underline">kmish9685@gmail.com</a>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                            <Phone className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-1">Phone</h3>
                            <a href="tel:+917805096980" className="text-lg font-medium text-white hover:underline">+91 7805096980</a>
                        </div>
                    </div>

                    <div className="p-6 rounded-2xl bg-[#0A0A0A] border border-white/5 hover:border-white/10 transition-colors flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center flex-shrink-0">
                            <MapPin className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-widest mb-1">Location</h3>
                            <p className="text-lg font-medium text-white">Bengaluru, India</p>
                        </div>
                    </div>
                </div>
            </main>

            <footer className="py-12 border-t border-white/5 text-center text-zinc-600 text-sm">
                © 2025 Persona AI. All rights reserved.
            </footer>
        </div>
    );
}

export default function ContactPage() {
    return (
        <Suspense fallback={null}>
            <ContactContent />
        </Suspense>
    );
}

'use client';

import Link from 'next/link';
import ChatDemoSection from '@/components/landing/ChatDemoSection';
import { Suspense, useState, useEffect } from 'react';
import { ArrowRight, Check, X, Target, Brain, ShieldAlert, Zap, BarChart3, HelpCircle, ChevronLeft, ChevronRight, Sparkles, Clock, Users, TrendingUp, Eye, Shield } from 'lucide-react';
import { SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import BoardSection from '@/components/landing/BoardSection';
import ComparisonSection from '@/components/landing/ComparisonSection';
import TestimonialSection from '@/components/landing/TestimonialSection';
import { Paywall } from '@/components/Paywall';
import { useRouter } from 'next/navigation';

function LandingPageContent() {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [currency, setCurrency] = useState<'INR' | 'USD'>('USD');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [showPaywall, setShowPaywall] = useState(false);
  const { user } = useUser();
  const router = useRouter();

  const pricing = {
    INR: { monthly: 149, annual: 83, symbol: "₹", fullAnnual: 999 },
    USD: { monthly: 4.99, annual: 3.25, symbol: "$", fullAnnual: 39 }
  };

  const frames = [
    {
      title: "The Problem",
      subtitle: "Endless chat, hedged advice, and zero clarity.",
      icon: <X className="text-[#e05d5d]" size={20} />,
      tag: "Traditional AI",
      content: "Chatbots keep you talking. They say \"it depends\" and give you more options, not fewer. You leave more confused than when you started."
    },
    {
      title: "The Solution",
      subtitle: "Structured analysis. Binary verdict.",
      icon: <Check className="text-[#4dac68]" size={20} />,
      tag: "Decision Frameworks",
      content: "We enforce constraints. Inversion, pre-mortem, and opportunity cost frameworks synthesized into a single verdict, a conviction score, and clear kill signals. Decision compression."
    },
    {
      title: "The Result",
      subtitle: "Execute with absolute confidence.",
      icon: <Zap className="text-[#5e6ad2]" size={20} />,
      tag: "The Outcome",
      content: "Move from indecision to action in under a minute. No tokens, no noise. Engineering-grade clarity on your most important choices."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentFrame((prev) => (prev + 1) % frames.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen font-sans selection:bg-[#5e6ad2]/30 overflow-x-hidden" style={{ background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Background gradient — subtle purple glow from top (Linear exact) */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div style={{ position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)', width: '90%', height: '50%', background: 'radial-gradient(ellipse 80% 60% at 50% 40%, rgba(94,106,210,0.08), transparent)', borderRadius: '50%', filter: 'blur(80px)' }} />
      </div>

      {/* ─── HEADER — Linear marketing nav ─── */}
      <header className="fixed top-0 w-full z-50 h-[52px] flex items-center px-6" style={{ background: 'rgba(10,10,11,0.8)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity mr-8">
            <img src="/logo.png" alt="Persona AI" className="w-6 h-6 rounded-md" />
            <span className="font-semibold text-[14px] tracking-[-0.02em] font-display" style={{ color: 'var(--text-primary)' }}>Persona AI</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 flex-1">
            <Link href="#pricing" className="px-2.5 py-1 text-[13px] rounded transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>Pricing</Link>
            <Link href="/personas" className="px-2.5 py-1 text-[13px] rounded transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>Frameworks</Link>
          </nav>

          <div className="flex items-center gap-2">
            <SignedIn>
              <Link href="/dashboard" className="px-2.5 py-1 text-[13px] rounded transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>

            <SignedOut>
              <Link href="/login" className="hidden sm:block px-2.5 py-1 text-[13px] rounded transition-colors hover:text-white" style={{ color: 'var(--text-secondary)' }}>
                Log in
              </Link>
              <Link
                href="/analyze/new"
                className="h-8 px-3 text-[13px] font-medium rounded-md transition-all flex items-center gap-1.5 text-white hover:opacity-90 font-display"
                style={{ background: '#5e6ad2' }}
              >
                Get started <ArrowRight size={13} />
              </Link>
            </SignedOut>
          </div>
        </div>
      </header>

      {/* Spacer for fixed header */}
      <div className="h-[52px]" />

      {/* ─── 1. HERO — Linear hero pattern ─── */}
      <section className="relative z-10 px-6 lg:px-8 pt-20 sm:pt-28 pb-20 text-center hero-gradient">
        <div className="max-w-[800px] mx-auto">
          {/* Badge — Linear hero-badge pattern */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-6 animate-fade-up" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#5e6ad2]" />
            <span className="text-[12px]" style={{ color: 'var(--text-secondary)' }}>The decision engine for builders</span>
            <ArrowRight size={11} style={{ color: 'var(--text-tertiary)' }} />
          </div>

          {/* H1 — Linear exact: clamp(40px,6vw,72px), 600 weight, -0.04em */}
          <h1 className="font-semibold leading-[1.05] mb-5 animate-fade-up" style={{ fontSize: 'clamp(40px, 6vw, 72px)', letterSpacing: '-0.04em', animationDelay: '0.1s' }}>
            Clarify what you{' '}
            <span className="text-gradient">already know.</span>
          </h1>

          {/* Tagline — Linear exact: 16-18px, --text-secondary */}
          <p className="max-w-[480px] mx-auto leading-relaxed mb-8 animate-fade-up" style={{ fontSize: '16px', color: 'var(--text-secondary)', lineHeight: '1.6', animationDelay: '0.2s' }}>
            You don't need another chatbot. You need a <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Kill Signal</strong>, a <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Binary Verdict</strong>, and a <strong style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Values Reality Check</strong>.
          </p>

          {/* CTA Group — Linear hero-cta-group */}
          <div className="flex items-center justify-center gap-2 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Link href="/analyze/new" className="h-10 px-5 rounded-lg font-medium text-[14px] transition-all flex items-center gap-2 text-white hover:opacity-90 font-display" style={{ background: '#5e6ad2', letterSpacing: '-0.01em' }}>
              Get started <ArrowRight size={14} />
            </Link>
            <Link href="/personas" className="h-10 px-5 rounded-lg font-medium text-[14px] transition-all flex items-center gap-2 hover:text-white" style={{ background: 'transparent', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
              Try Frameworks
            </Link>
          </div>

          {/* 3-Frame Carousel — elevated card with hero shadow */}
          <div className="relative max-w-3xl mx-auto mt-16 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="rounded-[10px] p-8 sm:p-10 min-h-[260px] flex flex-col justify-center relative overflow-hidden group" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-hero)' }}>
              {/* Progress Bars */}
              <div className="absolute top-0 left-0 right-0 flex gap-1 p-3">
                {frames.map((_, i) => (
                  <div key={i} className="h-[2px] flex-1 rounded-full overflow-hidden" style={{ background: 'var(--border-default)' }}>
                    <div
                      className={`h-full ${currentFrame === i ? 'w-full' : 'w-0'}`}
                      style={{ background: '#5e6ad2', transition: currentFrame === i ? 'width 5000ms linear' : 'width 0ms' }}
                    />
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center" key={currentFrame}>
                <div className="mb-4 p-2.5 rounded-md" style={{ background: 'var(--bg-active)', border: '1px solid var(--border-subtle)' }}>
                  {frames[currentFrame].icon}
                </div>
                <div className="accent-label mb-2">{frames[currentFrame].tag}</div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-3" style={{ letterSpacing: '-0.02em' }}>{frames[currentFrame].title}</h2>
                <p className="text-[15px] max-w-xl leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {frames[currentFrame].content}
                </p>
              </div>

              {/* Nav Arrows */}
              <button
                onClick={() => setCurrentFrame((prev) => (prev - 1 + frames.length) % frames.length)}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)' }}
              >
                <ChevronLeft size={16} style={{ color: 'var(--text-secondary)' }} />
              </button>
              <button
                onClick={() => setCurrentFrame((prev) => (prev + 1) % frames.length)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-subtle)' }}
              >
                <ChevronRight size={16} style={{ color: 'var(--text-secondary)' }} />
              </button>
            </div>
          </div>

          {/* Social Proof Strip */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 py-6 border-t" style={{ borderColor: 'var(--border-subtle)' }}>
            {[
              { val: '~30s', label: 'To Full Clarity' },
              { val: '6', label: 'Mental Models' },
              { val: '4.8', label: 'Clarity Score' },
              { val: '92%', label: 'Worth It' }
            ].map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <span className="text-[15px] font-semibold" style={{ color: 'var(--text-primary)' }}>{s.val}</span>
                <span className="text-[10px] font-medium uppercase tracking-[0.06em]" style={{ color: 'var(--text-tertiary)' }}>{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── BOARDROOM ─── */}
      <BoardSection />

      {/* ─── 2. NOT ANOTHER CHATBOT — 1px gap grid ─── */}
      <section className="relative z-10 px-6 lg:px-8 py-24 border-y" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-[44px] font-semibold mb-3" style={{ letterSpacing: '-0.03em' }}>Not another chatbot.</h2>
            <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>We don't chat. We compute decisions.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px]" style={{ background: 'var(--border-subtle)' }}>
            {/* Standard AI */}
            <div className="p-8 opacity-50" style={{ background: 'var(--bg-base)' }}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] mb-6" style={{ color: 'var(--text-tertiary)' }}>Standard AI</h3>
              <ul className="space-y-3 text-[14px]" style={{ color: 'var(--text-tertiary)' }}>
                <li className="flex items-start gap-2"><X size={14} className="mt-0.5 shrink-0" /> "It depends on your goals..."</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-0.5 shrink-0" /> Walls of text</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-0.5 shrink-0" /> Zero accountability</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-0.5 shrink-0" /> Hallucinates facts</li>
              </ul>
            </div>

            {/* Generic AI Copilots */}
            <div className="p-8 opacity-70" style={{ background: 'var(--bg-base)' }}>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] mb-6" style={{ color: 'var(--text-secondary)' }}>Generic AI Copilots</h3>
              <ul className="space-y-3 text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                <li className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0" /> Fun mimicry</li>
                <li className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0" /> Good for brainstorming</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-0.5 shrink-0" /> Still indecisive</li>
                <li className="flex items-start gap-2"><X size={14} className="mt-0.5 shrink-0" /> Entertainment focused</li>
              </ul>
            </div>

            {/* Decision Engine */}
            <div className="p-8 relative overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
              <div className="absolute top-0 right-0 p-4 opacity-5"><Zap size={40} style={{ color: '#5e6ad2' }} /></div>
              <h3 className="text-[11px] font-semibold uppercase tracking-[0.06em] mb-6" style={{ color: '#5e6ad2' }}>Decision Engine</h3>
              <ul className="space-y-3 text-[14px]" style={{ color: 'var(--text-primary)' }}>
                <li className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0" style={{ color: '#5e6ad2' }} /> <span className="font-medium">Kill Signals (When to quit)</span></li>
                <li className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0" style={{ color: '#5e6ad2' }} /> <span className="font-medium">Values Alignment Check</span></li>
                <li className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0" style={{ color: '#5e6ad2' }} /> <span className="font-medium">5-Year Visualization</span></li>
                <li className="flex items-start gap-2"><Check size={14} className="mt-0.5 shrink-0" style={{ color: '#5e6ad2' }} /> <span className="font-medium">Binary Verdict (YES/NO)</span></li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ─── COMPARISON SECTION ─── */}
      <ComparisonSection />

      {/* ─── CHAT DEMO ─── */}
      <ChatDemoSection />

      {/* ─── 3. REAL OUTCOMES ─── */}
      <section className="relative z-10 px-6 lg:px-8 py-24 border-y" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-[44px] font-semibold mb-3" style={{ letterSpacing: '-0.03em' }}>Real outcomes.</h2>
            <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>From "maybe" to "move."</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[1px]" style={{ background: 'var(--border-subtle)' }}>
            <div className="p-8" style={{ background: 'var(--bg-base)' }}>
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium" style={{ background: 'rgba(224,93,93,0.12)', color: '#e05d5d' }}>
                  <ShieldAlert size={11} /> Kill Signal Detected
                </span>
              </div>
              <h3 className="font-semibold text-[17px] mb-4" style={{ letterSpacing: '-0.01em' }}>"Should I quit my job to build this MVP?"</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-[0.06em] block mb-1" style={{ color: 'var(--text-tertiary)' }}>User Values</span>
                  <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>Security &gt; Freedom. 3 month runway.</p>
                </div>
                <div>
                  <span className="accent-label block mb-1">Verdict</span>
                  <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    <strong className="font-semibold">NO (Wait)</strong> — Your values prioritize security, but your runway is too short. <span style={{ color: '#e05d5d', fontWeight: 500 }}>Kill Signal:</span> If you don't have a paying pilot in 2 weeks, you will run out of cash.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-8" style={{ background: 'var(--bg-base)' }}>
              <div className="mb-4">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-medium" style={{ background: 'rgba(77,172,104,0.12)', color: '#4dac68' }}>
                  <TrendingUp size={11} /> High Conviction
                </span>
              </div>
              <h3 className="font-semibold text-[17px] mb-4" style={{ letterSpacing: '-0.01em' }}>"Which target market should we focus on?"</h3>
              <div className="space-y-4">
                <div>
                  <span className="text-[11px] font-medium uppercase tracking-[0.06em] block mb-1" style={{ color: 'var(--text-tertiary)' }}>User Values</span>
                  <p className="text-[14px]" style={{ color: 'var(--text-secondary)' }}>Speed &gt; Quality. Solo Founder.</p>
                </div>
                <div>
                  <span className="accent-label block mb-1">Verdict</span>
                  <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-primary)' }}>
                    <strong className="font-semibold">SME/Prosumer</strong> — Enterprise sales take 6 months. You value speed. Do not go upmarket yet.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 4. HOW IT WORKS ─── */}
      <section className="relative z-10 px-6 lg:px-8 py-24" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-[44px] font-semibold mb-3" style={{ letterSpacing: '-0.03em' }}>How it works.</h2>
            <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>From brain fog to binary verdict in 3 steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-[60px] left-[12%] right-[12%] h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(94,106,210,0.2), transparent)' }} />

            {[
              {
                num: "01",
                title: "Describe your decision",
                desc: "Type what you're stuck on in plain English. Include your situation, stakes, and constraints.",
                label: "Example Input",
                detail: '"Should I quit my $120K job to build my SaaS full-time? 50 beta users, 5 paying, wife is pregnant, 3 months savings..."'
              },
              {
                num: "02",
                title: "AI computes your decision",
                desc: "6 decision frameworks analyze constraints, extract options, and stress-test every path. ~30 seconds.",
                label: "What happens",
                items: [
                  { color: '#4dac68', text: 'Constraint analysis' },
                  { color: '#f2b84b', text: 'Option stress-testing' },
                  { color: '#e05d5d', text: 'Kill signal detection' },
                ]
              },
              {
                num: "03",
                title: "Get your verdict",
                desc: "A clear YES or NO with conviction score, kill signals, and conditional factors. No hedging.",
                label: "Example Output",
                output: [
                  { key: 'Verdict', value: 'NO (Wait)', color: '#e05d5d' },
                  { key: 'Conviction', value: '87%', color: '#f2b84b' },
                  { key: 'Kill Signal', value: '🔴 Active', color: '#e05d5d' }
                ]
              },
              {
                num: "04",
                title: "Follow-up Threads",
                desc: "Treat the AI like a continuing advisor. Ask follow-up questions without re-explaining the context.",
                label: "Follow-Up Chat",
                detail: '"What if I get a bridge loan from my family instead?"',
                items: [
                  { color: '#5e6ad2', text: 'Context retained invisibly' },
                  { color: '#5e6ad2', text: 'Persona adapts instantly' }
                ]
              }
            ].map((step, i) => (
              <div key={i} className="relative group">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-md mb-5 text-[13px] font-semibold transition-all" style={{ background: 'rgba(94,106,210,0.15)', border: '1px solid rgba(94,106,210,0.2)', color: '#5e6ad2' }}>
                    {step.num}
                  </div>
                  <h3 className="text-[17px] font-semibold mb-2" style={{ letterSpacing: '-0.01em', color: 'var(--text-primary)' }}>{step.title}</h3>
                  <p className="text-[14px] leading-relaxed mb-5" style={{ color: 'var(--text-secondary)' }}>{step.desc}</p>
                  <div className="rounded-md p-4 text-left" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
                    <div className="accent-label mb-2">{step.label}</div>
                    {step.detail && (
                      <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)' }}>{step.detail}</p>
                    )}
                    {step.items && (
                      <div className="space-y-2">
                        {step.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-[12px]" style={{ color: 'var(--text-secondary)' }}>
                            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: item.color, animationDelay: `${idx * 0.2}s` }} />
                            {item.text}
                          </div>
                        ))}
                      </div>
                    )}
                    {step.output && (
                      <div className="space-y-2">
                        {step.output.map((row, idx) => (
                          <div key={idx} className="flex items-center justify-between">
                            <span className="text-[12px]" style={{ color: 'var(--text-tertiary)' }}>{row.key}</span>
                            <span className="text-[12px] font-semibold" style={{ color: row.color }}>{row.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link href="/analyze/new" className="inline-flex items-center gap-2 h-10 px-5 rounded-lg font-medium text-[14px] text-white transition-all hover:opacity-90" style={{ background: '#5e6ad2' }}>
              Try it free <ArrowRight size={14} />
            </Link>
            <p className="text-[12px] mt-3" style={{ color: 'var(--text-tertiary)' }}>5 free analyses · No credit card required</p>
          </div>
        </div>
      </section>

      {/* ─── NEW: STRATEGIC COMPANION (Backlog Features) ─── */}
      <section className="relative z-10 px-6 lg:px-8 py-24 border-t" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full mb-6" style={{ background: 'rgba(94,106,210,0.1)', border: '1px solid rgba(94,106,210,0.2)' }}>
              <Sparkles size={14} style={{ color: '#5e6ad2' }} />
              <span className="text-[12px] font-semibold uppercase tracking-[0.06em]" style={{ color: '#5e6ad2' }}>Beyond a Calculator</span>
            </div>
            <h2 className="text-3xl sm:text-[44px] font-semibold mb-3" style={{ letterSpacing: '-0.03em' }}>Your strategic companion.</h2>
            <p className="text-[15px] max-w-2xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Decisions aren't made in a vacuum. We built Persona AI to remember your context, challenge your assumptions, and adapt to the stakes of your specific situation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-8 rounded-2xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
              <Clock className="mb-5" size={24} style={{ color: '#5e6ad2' }} />
              <h3 className="font-semibold text-[16px] mb-3" style={{ color: 'var(--text-primary)' }}>Decision Threads & Follow-ups</h3>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Real decisions evolve over time. Maintain persistent chat threads where the engine automatically tracks your financial runway, constraints, and past verdicts. Ask follow-up questions without re-explaining yourself.
              </p>
            </div>

            <div className="p-8 rounded-2xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
              <Shield className="mb-5" size={24} style={{ color: '#e05d5d' }} />
              <h3 className="font-semibold text-[16px] mb-3" style={{ color: 'var(--text-primary)' }}>Devil's Advocate Mode</h3>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Already know what you want to do? The engine detects when you are simply seeking validation and will forcibly construct the strongest possible counter-argument to test your conviction.
              </p>
            </div>

            <div className="p-8 rounded-2xl" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
              <Users className="mb-5" size={24} style={{ color: '#4dac68' }} />
              <h3 className="font-semibold text-[16px] mb-3" style={{ color: 'var(--text-primary)' }}>Adaptive Tone</h3>
              <p className="text-[14px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                Not every problem requires a brutal reality check. The system dynamically adjusts its tone—delivering hard truths from Elon for business pivots, or nuanced wisdom from Naval for life choices.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5. BUILT FOR BUILDERS ─── */}
      <section className="relative z-10 px-6 lg:px-8 py-24 border-y" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-[44px] font-semibold mb-3" style={{ letterSpacing: '-0.03em' }}>Built for builders.</h2>
            <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>If you recognize yourself here, this tool was made for you.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[1px]" style={{ background: 'var(--border-subtle)' }}>
            {[
              { icon: '🔥', title: 'Solo Founders', desc: 'No co-founder to debate with. No board to validate ideas. You need an unbiased second brain.' },
              { icon: '⚡', title: 'Startup CEOs', desc: 'Pivot or double down? Hire or outsource? Fire or coach? High-stakes decisions that keep you up at night.' },
              { icon: '🎯', title: 'Career Switchers', desc: 'Quit the corporate job? Take the offer? Start freelancing? Life-changing decisions need structure, not opinions.' },
              { icon: '💡', title: 'Indie Hackers', desc: 'Which feature to build next? When to launch? How to price? Stop guessing, start computing.' }
            ].map((card, i) => (
              <div key={i} className="p-6 transition-all" style={{ background: 'var(--bg-base)' }}>
                <div className="text-xl mb-3">{card.icon}</div>
                <h3 className="font-semibold text-[14px] mb-2" style={{ color: 'var(--text-primary)' }}>{card.title}</h3>
                <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST BAR ─── */}
      <section className="relative z-10 px-6 lg:px-8 py-14 border-b" style={{ background: 'var(--bg-base)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'Decisions Analyzed' },
              { value: '4.8/5', label: 'Clarity Score' },
              { value: '30s', label: 'Avg. Analysis Time' },
              { value: '92%', label: 'Said "Worth It"' }
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{stat.value}</div>
                <div className="text-[10px] font-medium uppercase tracking-[0.06em]" style={{ color: 'var(--text-tertiary)' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <TestimonialSection />

      {/* ─── THE CLARITY LOOP ─── */}
      <section className="relative z-10 px-6 lg:px-8 py-24" style={{ background: 'var(--bg-base)' }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-[44px] font-semibold mb-3" style={{ letterSpacing: '-0.03em' }}>The clarity loop.</h2>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {[
              { icon: <Target size={20} />, label: '1. Values & Viz' },
              { icon: <Brain size={20} />, label: '2. Engine' },
              { icon: <ShieldAlert size={20} />, label: '3. Kill Signals' },
              { icon: <Zap size={20} />, label: '4. Gut Check' }
            ].map((step, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center transition-all" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)', color: 'var(--text-secondary)' }}>
                  {step.icon}
                </div>
                <span className="text-[10px] font-medium uppercase tracking-[0.06em]" style={{ color: 'var(--text-tertiary)' }}>{step.label}</span>
              </div>
            ))}
          </div>

          {/* Desktop arrows */}
          <div className="hidden md:flex justify-between px-24 -mt-10">
            {[1, 2, 3].map(i => <ArrowRight key={i} size={14} style={{ color: 'var(--border-default)' }} />)}
          </div>
        </div>
      </section>

      {/* ─── 6. PRICING ─── */}
      <section id="pricing" className="relative z-10 px-6 lg:px-8 py-24 border-t" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-[44px] font-semibold mb-3" style={{ letterSpacing: '-0.03em' }}>Simple pricing.</h2>
            <p className="text-[15px]" style={{ color: 'var(--text-secondary)' }}>No tokens. No noise. Clear pricing for clear decisions.</p>
          </div>

          {/* Toggles */}
          <div className="flex flex-col items-center gap-5 mb-14">
            <div className="flex items-center p-1 rounded-lg" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border-default)' }}>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-md text-[13px] font-medium transition-all ${billingCycle === 'monthly' ? 'text-white' : ''}`}
                style={billingCycle === 'monthly' ? { background: '#5e6ad2' } : { color: 'var(--text-secondary)' }}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('annual')}
                className={`px-5 py-2 rounded-md text-[13px] font-medium transition-all flex items-center gap-2 ${billingCycle === 'annual' ? 'text-white' : ''}`}
                style={billingCycle === 'annual' ? { background: '#5e6ad2' } : { color: 'var(--text-secondary)' }}
              >
                Annual <span className="text-[10px] px-1.5 py-0.5 rounded text-[11px] font-semibold" style={{ background: 'rgba(94,106,210,0.2)' }}>−45%</span>
              </button>
            </div>

            <div className="flex items-center gap-4 text-[12px] font-medium tracking-[0.06em]" style={{ color: 'var(--text-tertiary)' }}>
              <button onClick={() => setCurrency('INR')} className={`transition-all uppercase ${currency === 'INR' ? 'text-white' : ''}`}>India (INR)</button>
              <div className="w-1 h-1 rounded-full" style={{ background: 'var(--border-default)' }} />
              <button onClick={() => setCurrency('USD')} className={`transition-all uppercase ${currency === 'USD' ? 'text-white' : ''}`}>International (USD)</button>
            </div>
          </div>

          {/* Pricing Card */}
          <div className="max-w-lg mx-auto">
            <div className="rounded-[10px] p-8 sm:p-10 relative overflow-hidden" style={{ background: 'var(--bg-elevated)', border: '1px solid rgba(94,106,210,0.2)', boxShadow: '0 0 40px rgba(94,106,210,0.05)' }}>
              <div className="absolute top-5 right-6 accent-label px-2.5 py-1 rounded" style={{ background: 'rgba(94,106,210,0.15)' }}>Founding Member</div>

              <div className="mb-8">
                <h3 className="text-xl font-semibold mb-4" style={{ letterSpacing: '-0.02em' }}>Unlimited Access</h3>
                <div className="flex items-baseline gap-1">
                  <span className="text-xl" style={{ color: 'var(--text-tertiary)' }}>{pricing[currency].symbol}</span>
                  <span className="text-[56px] font-semibold leading-none" style={{ letterSpacing: '-0.04em' }}>{pricing[currency][billingCycle]}</span>
                  <span className="text-[13px] font-medium ml-1" style={{ color: 'var(--text-tertiary)' }}>/ mo</span>
                </div>
                {billingCycle === 'annual' && (
                  <p className="mt-2 text-[13px] font-medium" style={{ color: '#5e6ad2' }}>
                    {pricing[currency].symbol}{pricing[currency].fullAnnual} billed annually — founding price
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {[
                  'Unlimited Decision Analysis',
                  'All 6 Decision Frameworks',
                  'Binary Verdicts & Kill Signals',
                  'Decision Context Threads',
                  'Continuous Chat Memory',
                  'Priority Model Inference'
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-[14px]" style={{ color: 'var(--text-secondary)' }}>
                    <Check size={14} className="shrink-0" style={{ color: '#5e6ad2' }} />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => {
                  if (!user) {
                    router.push('/login?redirect_url=' + encodeURIComponent('/#pricing'));
                  } else {
                    setShowPaywall(true);
                  }
                }}
                className="block w-full py-3 rounded-md text-center font-medium text-[14px] text-white transition-all hover:opacity-90 cursor-pointer"
                style={{ background: '#5e6ad2' }}
              >
                Gain Absolute Clarity
              </button>

              <div className="mt-5 flex items-center justify-center gap-5 opacity-20">
                {['Visa', 'Mastercard', 'Razorpay'].map(p => (
                  <div key={p} className="text-[10px] font-semibold uppercase tracking-[0.06em]">{p}</div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-14 text-center text-[10px] font-medium uppercase tracking-[0.15em] flex flex-wrap items-center justify-center gap-4" style={{ color: 'var(--text-tertiary)' }}>
            <span>No token limits</span>
            <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border-default)' }} />
            <span>No conversational fluff</span>
            <span className="w-1 h-1 rounded-full" style={{ background: 'var(--border-default)' }} />
            <span>Pure decision engineering</span>
          </p>
        </div>
      </section>

      {/* ─── 7. FAQ ─── */}
      <section className="relative z-10 px-6 lg:px-8 py-24 border-t" style={{ background: 'var(--bg-base)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-[44px] font-semibold mb-3" style={{ letterSpacing: '-0.03em' }}>FAQ</h2>
          </div>

          <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
            {[
              { q: 'Is this just another AI chatbot?', a: 'No. This is a structured decision engine. We prioritize clarity, binary tradeoffs, and kill signals over generic conversational responses.' },
              { q: 'Why not just use ChatGPT?', a: 'ChatGPT is reactive. Our engine enforces reasoning constraints and re-evaluation protocols that generic prompts often miss.' },
              { q: 'Who is this for?', a: 'Founders, builders, and strategic thinkers who need high-conviction decisions — not just stylized opinions.' },
              { q: 'What are "Kill Signals"?', a: 'Specific, falsifiable conditions (e.g. CAC/Runway targets) that, if met, mean you should stop or pivot immediately.' }
            ].map((faq, i) => (
              <div key={i} className="py-6">
                <h3 className="font-semibold text-[15px] mb-2 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                  <HelpCircle size={14} className="shrink-0" style={{ color: '#5e6ad2' }} /> {faq.q}
                </h3>
                <p className="text-[14px] leading-relaxed pl-6" style={{ color: 'var(--text-secondary)' }}>{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── 8. ABOUT PERSONA AI (AEO / Semantic Block) ─── */}
      <section className="relative z-10 px-6 lg:px-8 py-16 border-t" style={{ background: 'var(--bg-base)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-3xl mx-auto text-center opacity-60 hover:opacity-100 transition-opacity">
          <h2 className="text-[11px] font-semibold uppercase tracking-[0.06em] mb-4" style={{ color: 'var(--text-tertiary)' }}>What is Persona AI?</h2>
          <p className="text-[13px] leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
            Persona AI is an AI-powered decision-making application that simulates the strategic thinking frameworks of experts like Elon Musk, Naval Ravikant, and Paul Graham. Unlike generic conversational chatbots (such as ChatGPT) or entertainment-focused AIs (such as Character AI), Persona AI provides entrepreneurs, founders, and professionals with structured frameworks, binary verdicts, and kill signals. It is an intelligent tool designed exclusively to end indecision and enforce clarity through computational decision structuring.
          </p>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="py-14 border-t text-center px-6" style={{ background: 'var(--bg-base)', borderColor: 'var(--border-subtle)' }}>
        <div className="max-w-7xl mx-auto flex flex-col items-center gap-5">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Persona AI" className="w-6 h-6 rounded-md grayscale opacity-60" />
            <span className="font-semibold text-[14px]" style={{ color: 'var(--text-tertiary)' }}>Persona AI</span>
          </div>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[13px]" style={{ color: 'var(--text-tertiary)' }}>
            <Link href="/analyze/new" className="hover:text-white transition-colors">Start</Link>
            <Link href="/dashboard" className="hover:text-white transition-colors">Dashboard</Link>
            <Link href="/personas" className="hover:text-white transition-colors">Frameworks</Link>
            <Link href="/guides" className="hover:text-white transition-colors">Guides</Link>
          </div>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 text-[11px] mt-2" style={{ color: 'var(--text-tertiary)', opacity: 0.7 }}>
            <span>vs ChatGPT</span>
            <span>·</span>
            <Link href="/compare/claude" className="hover:text-white transition-colors">vs Claude</Link>
            <span>·</span>
            <Link href="/compare/perplexity" className="hover:text-white transition-colors">vs Perplexity</Link>
            <span>·</span>
            <Link href="/compare/character-ai" className="hover:text-white transition-colors">vs Character AI</Link>
            <span>·</span>
            <Link href="/compare/executive-coaching" className="hover:text-white transition-colors">vs Executive Coaching</Link>
          </div>
          <p className="text-[11px] tracking-[0.06em]" style={{ color: 'var(--text-tertiary)' }}>
            © 2026 Persona AI. Decision compression for builders.
          </p>
        </div>
      </footer>

      {showPaywall && (
        <Paywall
          defaultCurrency={currency}
          defaultBillingCycle={billingCycle}
          onClose={() => setShowPaywall(false)}
          onSuccess={() => {
            setShowPaywall(false);
            router.push('/dashboard?upgrade=success');
          }}
        />
      )}
    </div>
  );
}

export default function LandingPage() {
  return (
    <Suspense fallback={null}>
      <LandingPageContent />
    </Suspense>
  );
}

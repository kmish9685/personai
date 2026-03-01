'use client';

import { useState, useRef, useEffect, Fragment } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Transition } from '@headlessui/react';
import { User, ChevronDown, Check, LogOut, Sparkles, Lock, LogIn, AlertCircle, X } from 'lucide-react';
import { Message } from '../types/chat';
import { sendMessage } from '../lib/api';
import { Paywall } from './Paywall';
import { FeedbackModal } from './FeedbackModal';
import { PersonaSwitcher } from './PersonaSwitcher';
import { useClerk, useUser } from '@clerk/nextjs';
import { useSearchParams, useRouter } from 'next/navigation';
import clsx from 'clsx';
import Link from 'next/link';
import posthog from 'posthog-js';
import { getPersonaById } from '@/lib/personas';
import { MultiPersonaView } from './MultiPersonaView';
import { ThinkingCard } from './ThinkingCard';
import { PersonaResponse } from '@/types/chat';
import { getUserPlan } from '@/app/actions/getUserPlan';
import { StressTestView } from './StressTestView';

// Simple Toast Component
function Toast({ message, onClose }: { message: string, onClose: () => void }) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#1A1A1A] border border-zinc-700 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 min-w-[300px]"
        >
            <AlertCircle size={18} className="text-[#5e6ad2]" />
            <p className="text-sm font-medium">{message}</p>
        </motion.div>
    );
}

export function Chat() {
    const { user } = useUser();
    const { signOut, openSignIn } = useClerk();
    const searchParams = useSearchParams();
    const router = useRouter();

    // Get persona from URL or default to elon
    const personaId = searchParams.get('persona') || 'elon';
    const personaData = getPersonaById(personaId);

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPaywall, setShowPaywall] = useState(false);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [remaining, setRemaining] = useState<number>(10);
    const [plan, setPlan] = useState<string>('free');

    // Fetch plan from Supabase on mount
    useEffect(() => {
        async function fetchPlan() {
            if (user) {
                // Optimistic check from metadata
                if (user.publicMetadata?.plan === 'pro') {
                    setPlan('pro');
                }

                // Authoritative check from Supabase
                try {
                    const { plan } = await getUserPlan();
                    if (plan === 'pro') setPlan('pro');
                } catch (error) {
                    console.error("Failed to fetch plan:", error);
                }
            }
        }
        fetchPlan();
    }, [user]);

    const [dismissedFreshThinking, setDismissedFreshThinking] = useState(false);
    const [toastMessage, setToastMessage] = useState<string | null>(null);
    const [mode, setMode] = useState<'single' | 'multi'>('single');
    const [multiPersonaResponses, setMultiPersonaResponses] = useState<PersonaResponse[] | null>(null);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Initial Scroll & Check for Upgrade Trigger
    useEffect(() => {
        setTimeout(scrollToBottom, 100);
        const dismissed = localStorage.getItem('freshThinkingDismissed');
        if (dismissed) setDismissedFreshThinking(true);

        if (searchParams.get('upgrade') === 'true') {
            setShowPaywall(true);
        }

        // Instant Unlock on Payment Success
        if (searchParams.get('payment') === 'success') {
            posthog.capture('payment_success', { plan: 'founding_99' });
            setRemaining(9999);
            setPlan('pro');
            setShowPaywall(false);
            setToastMessage("Payment Successful! You are now a Founding Member.");
            // Optional: Clean URL
            router.replace('/chat');
        }
    }, [searchParams, router]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    const handleDismissFreshThinking = () => {
        setDismissedFreshThinking(true);
        localStorage.setItem('freshThinkingDismissed', 'true');
    };

    // Handle Sending
    async function handleSend() {
        if (!input.trim() || loading || remaining === 0) {
            // If try to send when remaining is 0 (and button disabled, but just in case)
            if (remaining === 0) {
                if (!user) {
                    router.push('/login');
                } else {
                    setShowPaywall(true);
                }
            }
            return;
        }

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);

        posthog.capture('message_sent', {
            persona: personaId,
            is_authenticated: !!user
        });

        const updatedMessages = [...messages, userMsg];
        try {
            // Prepare history (last 10 messages context)
            const history = messages.slice(-10).map(m => ({
                role: m.role,
                content: m.content
            }));

            const data = await sendMessage(input, personaId, mode, history);

            if (data.mode === 'multi' && data.responses) {
                // Multi-persona mode: Display all responses
                setMultiPersonaResponses(data.responses);
                // Also add a summary message to chat
                const summaryMsg: Message = {
                    role: 'assistant',
                    content: `Received responses from all 6 personas. See below for their perspectives.`
                };
                setMessages(prev => [...prev, summaryMsg]);
            } else if (data.response) {
                // Single persona mode: Display single response
                const aiMsg: Message = {
                    role: 'assistant',
                    content: data.response,
                    reasoning: data.reasoning,
                    assumptions: data.assumptions,
                    missingData: data.missingData,
                    preMortem: data.preMortem,
                    biasCheck: data.biasCheck
                };
                setMessages(prev => [...prev, aiMsg]);
                setMultiPersonaResponses(null);
            }

            if (data.remaining_free !== undefined) {
                setRemaining(data.remaining_free);
                if (data.plan) setPlan(data.plan);

                if (data.remaining_free === 0) {
                    // Logic: Limit Reached after this message.
                    setToastMessage("Daily limit reached. Resets in 24 hours.");
                    setTimeout(() => {
                        if (!user) {
                            // 1. Force Login first
                            router.push('/login');
                        } else {
                            setShowPaywall(true);
                        }
                    }, 2000); // Give them 2s to see the toast
                }
            }
        } catch (error: any) {
            // Check if error contains waitTime
            const waitTime = error.waitTime;

            if (waitTime) {
                setToastMessage(`Daily limit reached. Resets in ${waitTime} hours.`);
            } else {
                setToastMessage("Limit reached. Upgrade for unlimited access.");
            }

            if (!user) {
                router.push('/login');
            } else {
                setShowPaywall(true);
            }
        } finally {
            setLoading(false);
            setTimeout(() => inputRef.current?.focus(), 100);
        }
    }

    // Dynamic Empty State based on persona
    const getEmptyStateText = () => {
        const emptyStates: Record<string, string> = {
            elon: "Don't ask me for permission. Validate your constraints. State your decision.",
            naval: "Clear thinking requires removing ego. Tell me your decision, I'll tell you the leverage.",
            paul: "Most startup ideas are bad. Let's see if yours is one of them. What are you building?",
            bezos: "Good intentions don't work. Mechanisms do. Show me your plan.",
            jobs: "Is it good, or is it crap? Don't waste my time. Show me the product decision.",
            thiel: "Competition is for losers. Tell me your secret plan."
        };
        return emptyStates[personaId] || "Silence is golden, but I'm expensive. Ask me something.";
    };

    return (
        <div className="w-full h-[100dvh] flex flex-col bg-black text-white overflow-hidden font-sans relative">

            {/* Header */}
            <header className="sticky top-0 z-30 w-full border-b border-gray-800 bg-black/95 backdrop-blur">
                <div className="flex items-center justify-between px-4 h-14 max-w-5xl mx-auto w-full">

                    {/* Left: Logo + Active Persona */}
                    <div className="flex items-center gap-3">
                        <Link href="/" className="flex items-center gap-2">
                            <img src="/logo.png" alt="Persona AI" className="w-8 h-8 rounded-md opacity-90" />
                            <span className="font-semibold text-sm hidden lg:inline-block tracking-tight text-zinc-100">Persona AI</span>
                        </Link>
                        <div className="hidden sm:flex items-center gap-2 text-xs text-gray-400">
                            <span>•</span>
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full overflow-hidden border border-gray-600">
                                    <img src={personaData.image} alt={personaData.name} className="w-full h-full object-cover" />
                                </div>
                                <span className="text-white font-medium">{personaData.name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Controls */}
                    <div className="flex items-center gap-3 sm:gap-4">

                        {/* Mode Toggle */}
                        <button
                            onClick={() => setMode(mode === 'single' ? 'multi' : 'single')}
                            className={clsx(
                                "px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                                mode === 'multi'
                                    ? "bg-[#FF9500] text-black border-[#FF9500]"
                                    : "bg-[#1A1A1A] text-gray-400 border-gray-700 hover:border-[#FF9500]"
                            )}
                        >
                            {mode === 'single' ? 'Single' : 'All 6'}
                        </button>

                        {/* Persona Switcher */}
                        <PersonaSwitcher currentFramework={personaId} />

                        {/* Message Count */}
                        <span className={clsx("text-xs font-mono hidden sm:block", remaining === 0 ? "text-red-500" : "text-gray-500")}>
                            {remaining}/10
                        </span>

                        {/* Profile Dropdown (Headless UI Menu) */}
                        <Menu as="div" className="relative">
                            <Menu.Button className="w-8 h-8 rounded-full flex items-center justify-center transition-all border border-zinc-700 bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white hover:border-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-zinc-700">
                                {user?.imageUrl ? (
                                    <img src={user.imageUrl} alt="Profile" className="w-full h-full rounded-full object-cover" />
                                ) : (
                                    <User size={16} />
                                )}
                            </Menu.Button>

                            <Transition
                                as={Fragment}
                                enter="transition ease-out duration-100"
                                enterFrom="transform opacity-0 scale-95"
                                enterTo="transform opacity-100 scale-100"
                                leave="transition ease-in duration-75"
                                leaveFrom="transform opacity-100 scale-100"
                                leaveTo="transform opacity-0 scale-95"
                            >
                                <Menu.Items className="absolute right-0 mt-2 w-64 origin-top-right bg-[#0F0F0F] border border-zinc-800 rounded-xl shadow-2xl overflow-hidden z-50 ring-1 ring-white/5 focus:outline-none">
                                    <div className="p-4 border-b border-zinc-800/50 bg-zinc-900/30">
                                        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1">Signed in as</p>
                                        <p className="text-sm font-semibold text-white truncate">
                                            {user?.primaryEmailAddress?.emailAddress || "Guest User"}
                                        </p>
                                    </div>

                                    <div className="p-2">
                                        <Menu.Item>
                                            {({ active }) => (
                                                <button
                                                    onClick={() => setShowPaywall(true)}
                                                    className={clsx(
                                                        "w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-between group",
                                                        active ? "bg-[#FF9500]/10 text-[#FF9500]" : "text-[#FF9500]"
                                                    )}
                                                >
                                                    <span>Upgrade to Pro</span>
                                                    <span className="bg-[#FF9500]/10 text-[#FF9500] text-[10px] px-1.5 py-0.5 rounded border border-[#FF9500]/20">NEW</span>
                                                </button>
                                            )}
                                        </Menu.Item>

                                        {!user ? (
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => router.push('/login')}
                                                        className={clsx(
                                                            "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 mt-1",
                                                            active ? "bg-zinc-800 text-white" : "text-zinc-400"
                                                        )}
                                                    >
                                                        <LogIn size={14} />
                                                        Log In / Sign Up
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        ) : (
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={() => signOut()}
                                                        className={clsx(
                                                            "w-full text-left px-3 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2 mt-1",
                                                            active ? "bg-zinc-800 text-white" : "text-zinc-400"
                                                        )}
                                                    >
                                                        <LogOut size={14} />
                                                        Log Out
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        )}
                                    </div>
                                </Menu.Items>
                            </Transition>
                        </Menu>

                    </div>
                </div>
            </header>

            {/* Fresh Thinking Card */}
            {!dismissedFreshThinking && (
                <div className="px-4 py-3 bg-black border-b border-white/5 animate-fade-in relative z-20">
                    <div className="bg-[#1A1A1A] border border-orange-500 rounded-xl p-4 relative max-w-3xl mx-auto shadow-[0_0_20px_rgba(255,149,0,0.1)]">
                        <button
                            onClick={handleDismissFreshThinking}
                            className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
                        >
                            <X size={16} />
                        </button>

                        <h3 className="text-base font-semibold mb-2 text-white flex items-center gap-2">
                            ⚡ FRESH THINKING MODE
                        </h3>

                        <p className="text-sm text-gray-300 leading-relaxed mb-3">
                            Decisions under uncertainty, stripped to reality.
                        </p>

                        <p className="text-sm text-gray-300 leading-relaxed mb-3">
                            Every conversation starts clean. No chat history, no bias from past questions.
                            Just pure, context-free brutal honesty.
                        </p>

                        <p className="text-sm text-gray-300 leading-relaxed mb-3">
                            Why? Insights are perishable. Yesterday's advice doesn't apply to today's decisions.
                        </p>

                        <p className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-widest font-bold">
                            SIMULATED REASONING • NOT A HUMAN
                        </p>
                    </div>
                </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar bg-black">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full max-w-lg mx-auto text-center px-4 animate-fade-in opacity-80">
                        <h1 className="text-2xl font-bold text-zinc-800 mb-2 select-none tracking-tight">
                            PERSONA AI
                        </h1>
                        <p className="text-lg text-zinc-500 font-medium leading-relaxed">
                            "{getEmptyStateText()}"
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6 max-w-3xl mx-auto pb-8">
                        <AnimatePresence initial={false}>
                            {messages.map((msg, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={clsx(
                                            "relative max-w-[85%] text-[15px] leading-relaxed",
                                            msg.role === 'user'
                                                ? "bg-[#0A84FF] text-white rounded-2xl rounded-br-none px-5 py-3.5 shadow-sm ml-auto"
                                                : "w-full pl-0 sm:pl-4" // No background for AI, just spacing
                                        )}
                                    >
                                        {/* User Label (Only for user) */}
                                        {msg.role === 'user' && (
                                            <p className="text-[10px] font-bold uppercase mb-1 opacity-70 tracking-wider text-blue-100 text-right">
                                                You
                                            </p>
                                        )}

                                        {/* AI: Thinking Card (Rendered OUTSIDE the answer text flow) */}
                                        {msg.role === 'assistant' && msg.reasoning && (
                                            <div className="mb-4">
                                                <ThinkingCard
                                                    content={msg.reasoning}
                                                    personaId={personaId}
                                                />
                                            </div>
                                        )}

                                        {/* Message Content / Answer */}
                                        <div className={clsx(
                                            "whitespace-pre-wrap",
                                            msg.role === 'assistant' ? "text-gray-200 font-sans text-lg" : ""
                                        )}>
                                            {msg.content}
                                        </div>

                                        {/* AI: Stress Test & Other Metadata */}
                                        {msg.role === 'assistant' && (
                                            <div className="mt-4">
                                                <StressTestView
                                                    assumptions={msg.assumptions}
                                                    missingData={msg.missingData}
                                                    preMortem={msg.preMortem}
                                                    biasCheck={msg.biasCheck}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>

                        {/* Multi-Persona Responses - Displayed here */}
                        {multiPersonaResponses && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="w-full mt-4"
                            >
                                <MultiPersonaView responses={multiPersonaResponses} />
                            </motion.div>
                        )}

                        {loading && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start w-full">
                                <div className="bg-[#1A1A1A] rounded-2xl p-4 border border-white/5 flex items-center gap-2">
                                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                    <div className="w-2 h-2 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                                </div>
                            </motion.div>
                        )}
                        <div ref={messagesEndRef} className="h-4" />
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="sticky bottom-0 w-full bg-black border-t border-gray-800 px-4 pt-3 pb-safe-area-bottom shadow-[0_-10px_40px_rgba(0,0,0,0.5)] z-40">
                <div className="max-w-3xl mx-auto pb-[max(1rem,env(safe-area-inset-bottom))]">
                    <div className="relative group">
                        <input
                            ref={inputRef}
                            type="text"
                            placeholder="State a decision (e.g. 'I want to drop out of college'). We will break it..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            disabled={loading || remaining === 0}
                            className="
                                w-full bg-[#1A1A1A] border border-gray-700 rounded-full 
                                px-5 py-3.5 pr-14 text-white placeholder-gray-500
                                focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500
                                text-[16px] transition-all
                            "
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || loading || remaining === 0}
                            className="
                                absolute right-2 top-1/2 -translate-y-1/2
                                w-9 h-9 rounded-full bg-orange-500 
                                flex items-center justify-center
                                disabled:bg-gray-700 disabled:cursor-not-allowed
                                hover:bg-orange-400 transition-all hover:scale-105 active:scale-95
                                shadow-lg shadow-orange-500/20
                            "
                        >
                            <span className="text-black font-bold text-xl leading-none mb-0.5">↑</span>
                        </button>
                    </div>

                    <p className="text-[10px] sm:text-xs text-gray-500 text-center mt-3 leading-tight font-medium">
                        SIMULATED. NOT A REAL PERSON.<br />
                        Free messages: <span className={remaining === 0 ? "text-red-500" : ""}>{remaining}/10</span> • Insight is perishable. Calls not saved.
                    </p>
                </div>
            </div>

            {/* Modals and Toasts */}
            {showPaywall && (
                <Paywall
                    onClose={() => {
                        setShowPaywall(false);
                        // Trigger Feedback Modal on Paywall Abandonment
                        setTimeout(() => setShowFeedbackModal(true), 300);
                    }}
                    onSuccess={() => setRemaining(9999)}
                />
            )}
            <FeedbackModal isOpen={showFeedbackModal} onClose={() => setShowFeedbackModal(false)} />
            <AnimatePresence>
                {toastMessage && <Toast message={toastMessage} onClose={() => setToastMessage(null)} />}
            </AnimatePresence>
        </div>
    );
}


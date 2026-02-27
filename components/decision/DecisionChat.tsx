'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, AlertCircle, Bot } from 'lucide-react';
import { Message } from '@/types/chat';
import { sendMessage } from '@/lib/api';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';
import { PersonaSwitcher } from '@/components/PersonaSwitcher';

interface DecisionChatProps {
    decisionId: string;
    title: string;
    context: string;
    verdict: string;
    initialPersona?: string;
}

export function DecisionChat({ decisionId, title, context, verdict, initialPersona = 'elon' }: DecisionChatProps) {
    const { user } = useUser();
    const router = useRouter();

    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentPersona, setCurrentPersona] = useState(initialPersona);

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, loading]);

    // Construct the hidden context block that we prepend to the history on the first message
    const getHiddenContext = () => {
        return `[SYSTEM CONTEXT - INVISIBLE TO USER]
We are discussing a specific decision the user just made using your framework.
Decision Title: "${title}"
User Context: "${context}"
Your Original Verdict: "${verdict}"

Instructions: 
1. Act as the persona they selected.
2. Ensure your advice perfectly references the specific details of the decision above.
3. If they ask a vague question like "what if I fail?", answer it in the context of the decision above.
4. Keep answers short, punchy, and strictly in character.
[END SYSTEM CONTEXT]`;
    };

    async function handleSend() {
        if (!input.trim() || loading) return;

        const userMsg: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setLoading(true);
        setError(null);

        try {
            // Build history. If this is the FIRST message, inject the system context invisibly.
            let apiHistory = [...messages];

            if (apiHistory.length === 0) {
                apiHistory = [{ role: 'system', content: getHiddenContext() }];
            } else {
                // Even if it's not the first message, ensure the first message in the array is the context
                if (apiHistory[0]?.role !== 'system') {
                    apiHistory = [{ role: 'system', content: getHiddenContext() }, ...apiHistory];
                }
            }

            // Map frontend Message type to API history type
            const formattedHistory = apiHistory.map(m => ({
                role: m.role as 'user' | 'assistant' | 'system',
                content: m.content
            }));

            const data = await sendMessage(input, currentPersona, 'single', formattedHistory);

            if (data.response) {
                const aiMsg: Message = {
                    role: 'assistant',
                    content: data.response,
                };
                setMessages(prev => [...prev, aiMsg]);
            }

        } catch (err: any) {
            console.error("Chat error:", err);
            setError(err.message || 'Failed to send message. You may have hit a limit.');
            if (!user) {
                setTimeout(() => router.push('/login'), 2000);
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="bg-[#0F0F0F] border border-white/5 rounded-2xl flex flex-col overflow-hidden max-h-[600px]">
            {/* Chat Header */}
            <div className="p-4 border-b border-white/5 bg-black/40 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <Bot size={18} className="text-[#5e6ad2]" /> Follow-up Questions
                    </h3>
                    <p className="text-xs text-zinc-500 mt-1">Chat with an AI about this specific decision.</p>
                </div>
                <div>
                    {/* Reuse the PersonaSwitcher but capture its changes if possible, 
                        or just pass a callback. For now, we'll let it use the URL query 
                        params and read from it via searchParams in a real app, but here 
                        we'll build a simplified local selector. */}
                    <select
                        value={currentPersona}
                        onChange={(e) => setCurrentPersona(e.target.value)}
                        className="bg-zinc-900 border border-white/10 text-xs text-white uppercase tracking-widest font-bold rounded-lg px-3 py-2 outline-none focus:border-[#5e6ad2]"
                    >
                        <option value="elon">Elon Musk</option>
                        <option value="naval">Naval Ravikant</option>
                        <option value="paul">Paul Graham</option>
                        <option value="bezos">Jeff Bezos</option>
                        <option value="jobs">Steve Jobs</option>
                        <option value="thiel">Peter Thiel</option>
                    </select>
                </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px] custom-scrollbar bg-black/20">
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-70 p-6">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Bot size={24} className="text-zinc-500" />
                        </div>
                        <p className="text-sm text-zinc-400 max-w-sm">
                            Ask a follow up question. The AI knows the context of your decision and its original verdict.
                        </p>
                    </div>
                ) : (
                    messages.filter(m => m.role !== 'system').map((msg, idx) => (
                        <div key={idx} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={clsx(
                                "max-w-[85%] text-sm leading-relaxed p-4 rounded-2xl",
                                msg.role === 'user'
                                    ? "bg-[#5e6ad2] text-white rounded-br-none shadow-sm"
                                    : "bg-zinc-900 border border-white/5 text-zinc-200 rounded-bl-none"
                            )}>
                                {msg.role === 'assistant' && (
                                    <div className="text-[10px] font-bold uppercase mb-2 tracking-wider text-[#5e6ad2]">
                                        AI Response
                                    </div>
                                )}
                                <div className="whitespace-pre-wrap">{msg.content}</div>
                            </div>
                        </div>
                    ))
                )}

                {loading && (
                    <div className="flex justify-start w-full">
                        <div className="bg-zinc-900 border border-white/5 rounded-2xl rounded-bl-none p-4 flex items-center gap-2">
                            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                            <div className="w-1.5 h-1.5 bg-zinc-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Error Banner */}
            {error && (
                <div className="bg-red-500/10 border-t border-red-500/20 px-4 py-2 flex items-center gap-2 text-red-400 text-xs">
                    <AlertCircle size={14} /> {error}
                </div>
            )}

            {/* Input Box */}
            <div className="p-4 border-t border-white/5 bg-black/40">
                <div className="relative">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={loading}
                        placeholder="Ask a follow up question..."
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:border-[#5e6ad2]/50 transition-colors placeholder:text-zinc-600 disabled:opacity-50"
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || loading}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-[#5e6ad2] hover:bg-[#4f5bc4] disabled:bg-zinc-800 disabled:text-zinc-600 text-white rounded-lg transition-colors flex items-center justify-center"
                    >
                        <Send size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}

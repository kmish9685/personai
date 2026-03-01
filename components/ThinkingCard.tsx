import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Sparkles, BrainCircuit } from 'lucide-react';
import clsx from 'clsx';
import { getPersonaById } from '@/lib/personas';

interface ThinkingCardProps {
    content: string;
    personaId: string;
    isExpanded?: boolean;
}

export function ThinkingCard({ content, personaId, isExpanded = false }: ThinkingCardProps) {
    const [expanded, setExpanded] = useState(isExpanded);
    const persona = getPersonaById(personaId);

    // Parse header and body
    const lines = content.split('\n');
    let header = `VIEW REASONING (${persona.name.toUpperCase()})`;
    let body = content;

    if (lines[0].toUpperCase().startsWith('THINKING')) {
        header = lines[0].replace(':', '').trim();
        body = lines.slice(1).join('\n').trim();
    }

    // If both body and content are functionally empty, don't show the card
    if (!body.trim() && !content.trim()) return null;

    return (
        <div className="w-full my-2">
            <div
                className={clsx(
                    "rounded-xl overflow-hidden border transition-all duration-300",
                    expanded
                        ? "bg-[#0F0F10] border-indigo-500/30 shadow-[0_0_15px_rgba(94,106,210,0.15)]"
                        : "bg-[#0F0F10] border-white/5 hover:border-white/10"
                )}
            >
                {/* Header / Toggle */}
                <button
                    onClick={() => setExpanded(!expanded)}
                    className="w-full flex items-center justify-between px-4 py-3 group"
                >
                    <div className="flex items-center gap-2.5">
                        <div className={clsx(
                            "w-1.5 h-1.5 rounded-full",
                            expanded ? "bg-indigo-400 animate-pulse" : "bg-gray-600"
                        )} />
                        <span className="font-display text-[10px] uppercase tracking-[0.15em] font-bold text-gray-400 group-hover:text-indigo-300 transition-colors">
                            {expanded ? header : "VIEW REASONING"}
                        </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-500">
                        <span className="text-[9px] font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            {expanded ? 'HIDE' : 'SHOW'}
                        </span>
                        {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                </button>

                {/* Content */}
                <AnimatePresence initial={false}>
                    {expanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                        >
                            <div className="px-4 pb-4 overflow-hidden">
                                <div className="pl-4 border-l border-white/10 ml-0.5">
                                    <div className="font-mono text-[12px] leading-relaxed text-gray-400 whitespace-pre-wrap">
                                        {body}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

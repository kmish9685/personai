'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowRight, Trash2, Loader2, TrendingUp, AlertTriangle } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { deleteDecision } from '@/app/actions/deleteDecision';

export default function DecisionCard({ decision }: { decision: any }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false); // Mobile expand toggle

    const result = decision.analysis_result?.recommendation || {};
    const verdict = result.verdict || "Analysis Pending";
    const score = result.conviction_score || 0;
    const isHighScore = score >= 90;

    const gutReaction = decision.gut_reaction; // Parsed JSON from DB

    // Helper to get emoji for gut feeling
    const getGutEmoji = (feeling: string) => {
        switch (feeling) {
            case 'relieved': return '😌';
            case 'disappointed': return '😞';
            case 'confused': return '😕';
            case 'validated': return '✓';
            default: return '🧠';
        }
    };

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // Stop card click
        if (!confirm("Are you sure you want to delete this decision? This cannot be undone.")) return;

        setIsDeleting(true);
        try {
            // New Method: Server Action (Direct DB Access, no API route)
            const result = await deleteDecision(decision.id);

            if (result.error) {
                throw new Error(result.error);
            }

            // Success
            router.refresh();
        } catch (error) {
            console.error("Delete failed:", error);
            alert("Failed to delete. Please try again.");
            setIsDeleting(false);
        }
    };

    return (
        <div
            onClick={() => setIsExpanded(!isExpanded)}
            className={`group relative block glass-panel rounded-xl transition-all duration-300 ${isExpanded ? 'bg-zinc-900 border-white/10' : 'hover:-translate-y-1'}`}
        >
            {/* Delete Button */}
            <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="absolute top-4 right-4 p-2 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded-full transition-colors z-20 opacity-0 group-hover:opacity-100" // Hidden by default on mobile unless tapped? No, keep accessible.
                style={{ opacity: 1 }} // Force visible for accessibility on touch
                title="Delete Decision"
            >
                {isDeleting ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            </button>

            {/* Clickable Area for Navigation on Desktop, Expansion on Mobile */}
            <div className="p-6 cursor-pointer" onClick={(e) => {
                // On mobile, tap expands. On desktop, we might want to navigate immediately?
                // Let's keep it simple: detailed view requires a specific link click or "View Analysis" click.
                // Or we make the Title a link.
            }}>
                <div className="flex justify-between items-start mb-2 pr-10">
                    <h3 className="text-lg font-bold text-white group-hover:text-[#5e6ad2] transition-colors line-clamp-2 leading-tight">
                        {decision.title}
                    </h3>
                </div>

                {/* Always Visible: Score & Date & Gut Check */}
                <div className="flex flex-wrap items-center gap-2 mb-4 text-xs font-mono">
                    <span className={`px-2 py-0.5 rounded ${isHighScore ? 'bg-green-500/20 text-green-400' : 'bg-[#5e6ad2]/20 text-[#5e6ad2]'}`}>
                        {score}% Conviction
                    </span>

                    {gutReaction && (
                        <span className={`px-2 py-0.5 rounded flex items-center gap-1 ${gutReaction.alignment === 'agrees' ? 'bg-green-500/10 border border-green-500/20 text-green-400' :
                                gutReaction.alignment === 'disagrees' ? 'bg-red-500/10 border border-red-500/20 text-red-400' :
                                    'bg-yellow-500/10 border border-yellow-500/20 text-yellow-400'
                            }`}>
                            {getGutEmoji(gutReaction.feeling)} {gutReaction.feeling}
                        </span>
                    )}

                    <span className="text-zinc-500 flex-1 text-right">{new Date(decision.created_at).toLocaleDateString()}</span>
                </div>

                {/* Verdict: Truncated default, full expanded */}
                <div className={`mb-6 text-sm text-zinc-300 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {verdict}
                </div>

                {/* Action Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-white/5 mt-auto">
                    <span className="text-xs text-zinc-600">
                        {isExpanded ? "Tap title to close" : "Tap to see more"}
                    </span>
                    <Link href={`/analyze/${decision.id}`} className="flex items-center gap-2 text-sm font-bold text-white hover:text-[#5e6ad2] transition-colors z-10 p-2 -m-2">
                        View Full Report <ArrowRight size={14} />
                    </Link>
                </div>
            </div>
        </div>
    );
}


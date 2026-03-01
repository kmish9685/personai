'use client';

import { useState, useEffect } from 'react';
import GutCheckModal, { GutReaction } from '@/components/GutCheckModal';

interface GutCheckIntegrationProps {
    decisionId: string;
    verdict: string;
    existingReaction: any; // JSONB from DB
}

export default function GutCheckIntegration({ decisionId, verdict, existingReaction }: GutCheckIntegrationProps) {
    const [showModal, setShowModal] = useState(false);
    const [hasReaction, setHasReaction] = useState(!!existingReaction);

    useEffect(() => {
        // Show modal after user has had time to read the analysis (15 seconds)
        if (!hasReaction) {
            const timer = setTimeout(() => {
                setShowModal(true);
            }, 15000);
            return () => clearTimeout(timer);
        }
    }, [hasReaction]);

    const handleComplete = async (reaction: GutReaction) => {
        // Optimistic update
        setHasReaction(true);
        setShowModal(false);

        try {
            const res = await fetch('/api/gut-check', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ decisionId, reaction })
            });

            if (!res.ok) {
                const data = await res.json();
                console.error('Error saving gut reaction:', data.error);
            }
        } catch (err) {
            console.error('Failed to save gut reaction:', err);
        }
    };

    const handleSkip = () => {
        setShowModal(false);
        // Optionally save a "skipped" state so it doesn't pop up again every reload
        // For now, we'll just close it for this session
    };

    if (hasReaction) return null; // Or render a small "Gut Check Completed" badge if desired

    return (
        <>
            {showModal && (
                <GutCheckModal
                    verdict={verdict}
                    onComplete={handleComplete}
                    onSkip={handleSkip}
                />
            )}
        </>
    );
}

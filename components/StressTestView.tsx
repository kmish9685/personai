import { AlertTriangle, Database, Skull, Eye } from 'lucide-react';

interface StressTestViewProps {
    assumptions?: string;
    missingData?: string;
    preMortem?: string;
    biasCheck?: string;
}

export function StressTestView({ assumptions, missingData, preMortem, biasCheck }: StressTestViewProps) {
    // If no data, return nothing
    if (!assumptions && !missingData && !preMortem && !biasCheck) return null;

    return (
        <div className="grid grid-cols-1 gap-3 mt-4 pt-4 border-t border-white/10">
            {/* Title */}
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-1">
                Decision Stress Test
            </h3>

            {/* Assumptions - Red (Risk) */}
            {assumptions && (
                <div className="bg-red-950/20 border border-red-500/20 rounded-lg p-3 group hover:border-red-500/40 transition-colors">
                    <div className="flex items-center gap-2 mb-2 text-red-500">
                        <AlertTriangle size={16} />
                        <h4 className="font-semibold text-xs uppercase tracking-wide">What Could Break This</h4>
                    </div>
                    <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-mono text-[13px]">
                        {assumptions}
                    </div>
                </div>
            )}

            {/* Missing Data - Blue (Info) */}
            {missingData && (
                <div className="bg-blue-950/20 border border-blue-500/20 rounded-lg p-3 group hover:border-blue-500/40 transition-colors">
                    <div className="flex items-center gap-2 mb-2 text-blue-500">
                        <Database size={16} />
                        <h4 className="font-semibold text-xs uppercase tracking-wide">What You Don't Know Yet</h4>
                    </div>
                    <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-mono text-[13px]">
                        {missingData}
                    </div>
                </div>
            )}

            {/* Pre-Mortem - Purple (Future/Death) */}
            {preMortem && (
                <div className="bg-purple-950/20 border border-purple-500/20 rounded-lg p-3 group hover:border-purple-500/40 transition-colors">
                    <div className="flex items-center gap-2 mb-2 text-purple-500">
                        <Skull size={16} />
                        <h4 className="font-semibold text-xs uppercase tracking-wide">How This Fails</h4>
                    </div>
                    <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-mono text-[13px]">
                        {preMortem}
                    </div>
                </div>
            )}

            {/* Bias Check - Amber (Warning) */}
            {biasCheck && (
                <div className="bg-[#1a1b3a]/20 border border-[#5e6ad2]/20 rounded-lg p-3 group hover:border-[#5e6ad2]/40 transition-colors">
                    <div className="flex items-center gap-2 mb-2 text-[#5e6ad2]">
                        <Eye size={16} />
                        <h4 className="font-semibold text-xs uppercase tracking-wide">Your Blind Spots</h4>
                    </div>
                    <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-mono text-[13px]">
                        {biasCheck}
                    </div>
                </div>
            )}
        </div>
    );
}


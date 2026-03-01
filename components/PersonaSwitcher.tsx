'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FRAMEWORKS, getFrameworkById } from '@/lib/personas';
import { ChevronDown, Check } from 'lucide-react';

interface FrameworkSwitcherProps {
    currentFramework: string;
}

export function PersonaSwitcher({ currentFramework }: FrameworkSwitcherProps) {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const current = getFrameworkById(currentFramework);

    const handleSwitch = (frameworkId: string) => {
        router.push(`/chat?persona=${frameworkId}`);
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-[#1A1A1A] border border-white/10 
                         rounded-lg text-sm hover:border-[#5e6ad2]/50 transition-colors"
            >
                <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-600">
                    <img src={current.image} alt={current.name} className="w-full h-full object-cover" />
                </div>
                <span className="hidden sm:inline text-zinc-300">Switch Framework</span>
                <ChevronDown size={14} className={`text-zinc-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Dropdown */}
                    <div className="absolute top-full mt-2 right-0 w-72 bg-[#111111] border border-white/10 
                                  rounded-xl shadow-2xl z-50 overflow-hidden">
                        <div className="px-4 py-2.5 border-b border-white/5">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Decision Frameworks</p>
                        </div>
                        {FRAMEWORKS.map((framework) => (
                            <button
                                key={framework.id}
                                onClick={() => handleSwitch(framework.id)}
                                className={`
                                    w-full px-4 py-3 text-left hover:bg-white/5 transition-colors
                                    flex items-center gap-3 border-b border-white/5 last:border-b-0
                                    ${framework.id === currentFramework ? 'bg-[#5e6ad2]/10' : ''}
                                `}
                            >
                                <div className="w-9 h-9 rounded-full overflow-hidden border border-white/10 shrink-0">
                                    <img src={framework.image} alt={framework.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-white">{framework.name}</div>
                                    <div className="text-[11px] text-zinc-500 truncate">
                                        Inspired by {framework.inspiredBy}
                                    </div>
                                </div>
                                {framework.id === currentFramework && (
                                    <Check size={14} className="text-[#5e6ad2] shrink-0" />
                                )}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}

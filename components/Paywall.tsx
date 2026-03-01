"use client";

import { useState, useEffect, Fragment } from 'react';
import { Dialog, Listbox, Transition } from '@headlessui/react';
import { X, Zap, Check, ChevronDown, Globe, ArrowRight } from 'lucide-react';
import { useUser, useClerk } from '@clerk/nextjs';
import { PRICING_CONFIG } from '@/lib/pricing-config';
import clsx from 'clsx';

interface PaywallProps {
    onClose: () => void;
    onSuccess: () => void;
    defaultCurrency?: 'INR' | 'USD';
    defaultBillingCycle?: 'monthly' | 'annual';
}

const countries = [
    { id: 'IN', name: 'India (₹ INR)', currency: 'INR' },
    { id: 'US', name: 'International ($ USD)', currency: 'USD' },
];

export function Paywall({ onClose, onSuccess, defaultCurrency, defaultBillingCycle }: PaywallProps) {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);

    // Context-aware initialization
    const [step, setStep] = useState<'region' | 'details' | 'payment'>('region');
    const [selectedCountry, setSelectedCountry] = useState(countries[1]); // Default to US/Intl for the region picker
    const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>(defaultBillingCycle || 'annual');
    const [name, setName] = useState(user?.fullName || '');

    // Derived state
    const isIndia = selectedCountry.id === 'IN';
    const config = isIndia ? PRICING_CONFIG.IN : PRICING_CONFIG.US;
    const planDetails = config.plans[billingCycle];

    // Auto-detect location on mount
    useEffect(() => {
        try {
            const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            if (timeZone === 'Asia/Calcutta' || timeZone === 'Asia/Kolkata') {
                setSelectedCountry(countries[0]); // India
            } else {
                setSelectedCountry(countries[1]); // International
            }
        } catch (e) {
            console.error("Location detection failed", e);
        }
    }, []);


    // 1. Load Razorpay Script
    useEffect(() => {
        if (user && isIndia) {
            const script = document.createElement('script');
            script.src = 'https://checkout.razorpay.com/v1/checkout.js';
            script.async = true;
            document.body.appendChild(script);
            return () => {
                if (document.body.contains(script)) {
                    document.body.removeChild(script);
                }
            };
        }
    }, [user, isIndia]);

    const { openSignIn } = useClerk();

    async function handleRazorpayUpgrade() {
        if (!user) {
            // Redirect to login with proper return URL
            window.location.href = '/login?redirect_url=' + encodeURIComponent('/chat?upgrade=true');
            return;
        }

        setLoading(true);
        try {
            console.log("Creating Razorpay Order...");
            const res = await fetch('/api/payments/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ plan: billingCycle }) // Send selected plan
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || 'Failed to create order');
            }

            const data = await res.json();
            console.log("Order created:", data);

            const rzpKey = data.key || process.env.NEXT_PUBLIC_RAZORPAY_KEY || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

            if (!(window as any).Razorpay) {
                alert('Razorpay SDK failed to load. Please check your connection.');
                setLoading(false);
                return;
            }

            const options = {
                key: rzpKey,
                order_id: data.id,
                name: "Persona AI",
                description: `Founding Membership (${billingCycle})`,
                handler: function (_response: any) {
                    onSuccess();
                },
                prefill: {
                    name: name || user.primaryEmailAddress?.emailAddress,
                    email: user.primaryEmailAddress?.emailAddress,
                },
                theme: { color: "#5e6ad2" },
                modal: {
                    ondismiss: function () {
                        setLoading(false);
                    }
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();

            rzp.on('payment.failed', function (response: any) {
                alert("Payment Failed: " + response.error.reason);
                setLoading(false);
            });

        } catch (e: any) {
            console.error('Razorpay Error:', e);
            alert(`Error: ${e.message}`);
            setLoading(false);
        }
    }

    return (
        <Dialog open={true} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-black/90 backdrop-blur-sm transition-opacity" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
                <Dialog.Panel className="relative w-full max-w-lg bg-[#18181b] rounded-2xl border border-white/10 shadow-2xl overflow-visible">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-white/5 transition-colors z-10 text-zinc-400 hover:text-zinc-200"
                    >
                        <X size={20} />
                    </button>

                    <div className="p-6 md:p-8">
                        <div className="text-center mb-6">
                            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#5e6ad2]/10 border border-[#5e6ad2]/20 mb-4 ring-1 ring-[#5e6ad2]/20 shadow-[0_0_20px_rgba(94,106,210,0.15)]">
                                <Zap size={28} className="text-[#5e6ad2] fill-[#5e6ad2]" />
                            </div>
                            <h2 className="text-2xl md:text-3xl font-light tracking-tight text-white mb-2">
                                Founding Membership
                            </h2>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                                Lock in early adopter pricing before it increases.
                            </p>
                        </div>

                        {step === 'region' ? (
                            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h3 className="text-[10px] font-bold text-zinc-500 mb-6 uppercase tracking-[0.2em] text-center">Where are you based?</h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <button
                                        onClick={() => {
                                            setSelectedCountry(countries[0]);
                                            setStep('payment');
                                        }}
                                        className="group relative flex items-center justify-between p-5 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-[#5e6ad2]/50 hover:bg-[#5e6ad2]/5 transition-all text-left"
                                    >
                                        <div>
                                            <div className="text-white font-semibold mb-1 flex items-center gap-2">
                                                India
                                                <span className="text-[10px] font-medium text-zinc-500">₹ INR</span>
                                            </div>
                                            <div className="text-zinc-500 text-xs">Recommended for users in India</div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#5e6ad2]/20 transition-colors">
                                            <ArrowRight size={16} className="text-zinc-500 group-hover:text-[#5e6ad2]" />
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => {
                                            setSelectedCountry(countries[1]);
                                            setStep('payment');
                                        }}
                                        className="group relative flex items-center justify-between p-5 rounded-2xl bg-zinc-900/50 border border-white/5 hover:border-[#5e6ad2]/50 hover:bg-[#5e6ad2]/5 transition-all text-left"
                                    >
                                        <div>
                                            <div className="text-white font-semibold mb-1 flex items-center gap-2">
                                                International
                                                <span className="text-[10px] font-medium text-zinc-500">$ USD</span>
                                            </div>
                                            <div className="text-zinc-500 text-xs">Visa, Mastercard, & Global cards</div>
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-[#5e6ad2]/20 transition-colors">
                                            <ArrowRight size={16} className="text-zinc-500 group-hover:text-[#5e6ad2]" />
                                        </div>
                                    </button>
                                </div>
                            </div>
                        ) : step === 'details' ? (
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">Your Name</label>
                                    <input
                                        type="text"
                                        placeholder="Elon Musk"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-zinc-600 focus:outline-none focus:border-[#5e6ad2]/50 focus:ring-1 focus:ring-[#5e6ad2]/20 transition-all font-medium"
                                    />
                                </div>
                                <div className="relative">
                                    <label className="block text-[10px] font-bold text-zinc-500 mb-2 uppercase tracking-widest">Billing Location</label>
                                    <Listbox value={selectedCountry} onChange={setSelectedCountry}>
                                        <div className="relative mt-1">
                                            <Listbox.Button className="relative w-full w-full cursor-pointer bg-zinc-900 border border-white/10 rounded-xl pl-4 pr-10 py-3 text-left text-white focus:outline-none focus:border-[#5e6ad2]/50 focus:ring-1 focus:ring-[#5e6ad2]/20 transition-all sm:text-sm">
                                                <span className="block truncate font-medium flex items-center gap-2">
                                                    <Globe size={16} className="text-zinc-400" />
                                                    {selectedCountry.name}
                                                </span>
                                                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <ChevronDown className="h-4 w-4 text-zinc-400" aria-hidden="true" />
                                                </span>
                                            </Listbox.Button>
                                            <Transition
                                                as={Fragment}
                                                leave="transition ease-in duration-100"
                                                leaveFrom="opacity-100"
                                                leaveTo="opacity-0"
                                            >
                                                <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-xl bg-[#202023] py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm z-50 border border-white/5 scrollbar-thin scrollbar-thumb-zinc-700">
                                                    {countries.map((country, countryIdx) => (
                                                        <Listbox.Option
                                                            key={countryIdx}
                                                            className={({ active }) =>
                                                                `relative cursor-pointer select-none py-3 pl-10 pr-4 ${active ? 'bg-[#5e6ad2]/10 text-[#5e6ad2]' : 'text-zinc-300'
                                                                }`
                                                            }
                                                            value={country}
                                                        >
                                                            {({ selected }) => (
                                                                <>
                                                                    <span className={`block truncate ${selected ? 'font-semibold text-[#5e6ad2]' : 'font-normal'}`}>
                                                                        {country.name}
                                                                    </span>
                                                                    {selected ? (
                                                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-[#5e6ad2]">
                                                                            <Check className="h-4 w-4" aria-hidden="true" />
                                                                        </span>
                                                                    ) : null}
                                                                </>
                                                            )}
                                                        </Listbox.Option>
                                                    ))}
                                                </Listbox.Options>
                                            </Transition>
                                        </div>
                                    </Listbox>
                                </div>
                                <button
                                    onClick={() => setStep('payment')}
                                    disabled={!name.trim()}
                                    className="w-full py-3.5 mt-2 bg-white text-black font-semibold rounded-xl hover:bg-zinc-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    Continue to Plans
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Billing Toggle */}
                                <div className="flex justify-center mb-6">
                                    <div className="bg-zinc-900 p-1 rounded-xl border border-white/5 flex relative">
                                        {/* Animation Background */}
                                        <div
                                            className={`absolute top-1 bottom-1 w-[50%] bg-zinc-800 rounded-lg transition-all duration-300 ${billingCycle === 'annual' ? 'left-1' : 'left-[48.5%]'}`}
                                        />

                                        <button
                                            onClick={() => setBillingCycle('annual')}
                                            className={`relative z-10 px-6 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2 ${billingCycle === 'annual' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                            Annual
                                            <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded border border-emerald-500/20">
                                                Save 44%
                                            </span>
                                        </button>
                                        <button
                                            onClick={() => setBillingCycle('monthly')}
                                            className={`relative z-10 px-6 py-2 text-sm font-medium rounded-lg transition-colors ${billingCycle === 'monthly' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                            Monthly
                                        </button>
                                    </div>
                                </div>

                                {/* Plan Details Card */}
                                <div className="bg-[#0F0F0F] border-2 border-[#5e6ad2]/50 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_40px_rgba(94,106,210,0.15)] animate-in fade-in zoom-in duration-300">
                                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#5e6ad2]/20 rounded-full blur-2xl" />

                                    <div className="flex justify-between items-end mb-6 relative z-10">
                                        <div>
                                            <h3 className="text-sm font-bold text-white mb-2 uppercase tracking-widest">Founding Member</h3>
                                            <p className="text-xs text-[#5e6ad2]/90 font-medium">
                                                {billingCycle === 'annual' ? 'Billed annually' : 'Billed monthly'}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex flex-col items-end">
                                                {billingCycle === 'annual' ? (
                                                    <>
                                                        <div className="flex items-baseline gap-1">
                                                            <p className="text-4xl font-bold text-white tracking-tighter">
                                                                {isIndia ? '₹83' : '$3.25'}
                                                            </p>
                                                            <p className="text-xs text-zinc-500 font-medium">/mo</p>
                                                        </div>
                                                        <p className="text-sm text-zinc-400 font-medium mt-1">
                                                            {isIndia ? '₹999' : '$39'} <span className="text-xs opacity-70">/ year</span>
                                                        </p>
                                                    </>
                                                ) : (
                                                    <div className="flex items-baseline gap-1">
                                                        <p className="text-4xl font-bold text-white tracking-tighter">
                                                            {planDetails.label}
                                                        </p>
                                                        <p className="text-xs text-zinc-500 font-medium">{planDetails.period}</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <ul className="space-y-3 mb-6 border-t border-white/5 pt-4 relative z-10">
                                        <li className="flex items-start gap-2 text-sm text-white">
                                            <div className="p-1 rounded-full bg-[#5e6ad2]/10 mt-0.5"><Check size={12} className="text-[#5e6ad2]" /></div>
                                            <span className="font-medium">Unlimited Decision Analyses</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-white">
                                            <div className="p-1 rounded-full bg-[#5e6ad2]/10 mt-0.5"><Check size={12} className="text-[#5e6ad2]" /></div>
                                            <span className="font-medium">Kill Signals + Binary Verdicts</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-white">
                                            <div className="p-1 rounded-full bg-[#5e6ad2]/10 mt-0.5"><Check size={12} className="text-[#5e6ad2]" /></div>
                                            <span className="font-medium">Values Quiz + 5-Year Visualization</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-white">
                                            <div className="p-1 rounded-full bg-[#5e6ad2]/10 mt-0.5"><Check size={12} className="text-[#5e6ad2]" /></div>
                                            <span className="font-medium">Unlimited Advisor Chat Messages</span>
                                        </li>
                                        <li className="flex items-start gap-2 text-sm text-white">
                                            <div className="p-1 rounded-full bg-[#5e6ad2]/10 mt-0.5"><Check size={12} className="text-[#5e6ad2]" /></div>
                                            <span className="font-medium">All 6 Decision Frameworks</span>
                                        </li>
                                    </ul>

                                    <p className="text-[10px] text-zinc-500 text-center mb-4 font-medium relative z-10">
                                        By subscribing, you agree to our No Refund Policy.
                                    </p>

                                    {isIndia ? (
                                        <button
                                            onClick={handleRazorpayUpgrade}
                                            disabled={loading}
                                            className="w-full py-4 bg-[#5e6ad2] hover:bg-[#6b76e0] text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(94,106,210,0.3)] hover:shadow-[0_0_30px_rgba(94,106,210,0.5)] relative z-10"
                                        >
                                            {loading ? 'Processing...' : (
                                                <>
                                                    <Zap size={18} className="fill-black/20" />
                                                    {billingCycle === 'annual' ?
                                                        `Start for ${isIndia ? '₹83' : '$3.25'}/mo` :
                                                        `Pay ${planDetails.label} via Razorpay`
                                                    }
                                                </>
                                            )}
                                        </button>
                                    ) : (
                                        <a
                                            href={`/api/checkout?priceId=${(planDetails as any).link.split('/').pop()}`}
                                            className="w-full py-4 bg-[#5e6ad2] hover:bg-[#6b76e0] text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 text-center no-underline shadow-[0_0_20px_rgba(94,106,210,0.3)] hover:shadow-[0_0_30px_rgba(94,106,210,0.5)] relative z-10"
                                        >
                                            <Zap size={18} className="fill-black/20" />
                                            {billingCycle === 'annual' ?
                                                `Start for ${isIndia ? '₹83' : '$3.25'}/mo` :
                                                `Pay ${planDetails.label} via Polar`
                                            }
                                        </a>
                                    )}
                                </div>

                                <button
                                    onClick={() => setStep('region')}
                                    className="w-full text-xs font-medium text-zinc-500 hover:text-white transition-colors py-2"
                                >
                                    ← Change billing details
                                </button>
                            </div>
                        )}
                    </div>
                </Dialog.Panel>
            </div>
        </Dialog>
    );
}


import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { PRICING_CONFIG } from '@/lib/pricing-config';
import { auth } from '@clerk/nextjs/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        const { plan = 'annual' } = body; // Default to annual if not specified

        const key_id = process.env.RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
        const key_secret = process.env.RAZORPAY_KEY_SECRET;

        if (!key_id || !key_secret) {
            console.error("Razorpay keys missing via env");
            return NextResponse.json({ error: "Razorpay keys not configured" }, { status: 500 });
        }

        const instance = new Razorpay({
            key_id: key_id,
            key_secret: key_secret,
        });

        // Determine amount based on plan
        const amount = plan === 'monthly'
            ? PRICING_CONFIG.IN.plans.monthly.amount
            : PRICING_CONFIG.IN.plans.annual.amount;

        const options = {
            amount: amount,
            currency: "INR",
            payment_capture: 1, // Auto capture
            notes: {
                plan_type: plan, // Store plan type in notes for reference
                clerk_user_id: userId // CRITICAL: Used for automated upgrade
            }
        };

        const order = await instance.orders.create(options);

        return NextResponse.json(order);
    } catch (error: any) {
        console.error("Razorpay Order Creation Error:", error);
        return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
    }
}

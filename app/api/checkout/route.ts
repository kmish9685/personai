import { type NextRequest, NextResponse } from 'next/server';
import { Polar } from '@polar-sh/sdk';
import { auth } from '@clerk/nextjs/server';

const polar = new Polar({
    accessToken: process.env.POLAR_ACCESS_TOKEN,
    server: 'production', // Switched to production as 401 usually means token/env mismatch
});

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const priceId = searchParams.get('priceId');

    if (!priceId) {
        return new NextResponse('Missing priceId', { status: 400 });
    }

    const { userId } = await auth();
    if (!userId) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        console.log("Creating checkout for product:", priceId, "user:", userId);

        // Grab the affiliate cookie if it exists
        const affiliateId = request.cookies.get('persona_affiliate_id')?.value;
        const metadata: Record<string, string> = {
            clerk_user_id: userId
        };

        if (affiliateId) {
            metadata.affiliate_id = affiliateId;
        }

        const result = await polar.checkouts.create({
            products: [priceId],
            successUrl: `${request.nextUrl.origin}/dashboard?upgrade=success`,
            metadata: metadata
        });

        return NextResponse.redirect(result.url);
    } catch (error: any) {
        console.error('Polar Checkout Error Details:', JSON.stringify(error, null, 2));
        return new NextResponse(`Checkout failed: ${error.message || 'Unknown error'}`, { status: 500 });
    }
}

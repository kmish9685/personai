'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export function AffiliateTracker() {
    const searchParams = useSearchParams();

    useEffect(() => {
        // Look for ?ref= in the URL
        const ref = searchParams?.get('ref');

        if (ref) {
            // Save it in a cookie that expires in 30 days
            const expireDate = new Date();
            expireDate.setDate(expireDate.getDate() + 30);

            // We set the cookie to be accessible across the whole site
            document.cookie = `persona_affiliate_id=${ref}; expires=${expireDate.toUTCString()}; path=/; SameSite=Lax`;
        }
    }, [searchParams]);

    // This component doesn't render anything visible
    return null;
}

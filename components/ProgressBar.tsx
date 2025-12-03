'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

// Configure NProgress
NProgress.configure({
    showSpinner: false,
    trickleSpeed: 200,
    minimum: 0.08,
});

export function ProgressBar() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        NProgress.done();
    }, [pathname, searchParams]);

    useEffect(() => {
        const handleRouteStart = () => NProgress.start();
        const handleRouteDone = () => NProgress.done();

        // Listen for Next.js route changes
        window.addEventListener('beforeunload', handleRouteStart);

        return () => {
            window.removeEventListener('beforeunload', handleRouteStart);
        };
    }, []);

    return null;
}

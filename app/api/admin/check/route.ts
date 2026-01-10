import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/admin';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

// Simple admin check endpoint for client-side
export async function GET(request: NextRequest) {
    try {
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json({ isAdmin: false });
        }

        return NextResponse.json({
            isAdmin: isAdmin(session.user.email)
        });

    } catch (error) {
        return NextResponse.json({ isAdmin: false });
    }
}

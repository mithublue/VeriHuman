import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function DELETE(request: NextRequest) {
    try {
        // Check authentication
        const session = await auth();

        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get user
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Delete all user data in order (due to foreign key constraints)
        // 1. Delete activity logs
        await prisma.activityLog.deleteMany({
            where: { userId: user.id },
        });

        // 2. Delete sessions
        await prisma.session.deleteMany({
            where: { userId: user.id },
        });

        // 3. Delete accounts (OAuth connections)
        await prisma.account.deleteMany({
            where: { userId: user.id },
        });

        // 4. Finally delete the user
        await prisma.user.delete({
            where: { id: user.id },
        });

        return NextResponse.json({
            success: true,
            message: 'Account deleted successfully',
        });

    } catch (error) {
        console.error('Delete Account API Error:', error);
        return NextResponse.json(
            { error: 'Failed to delete account' },
            { status: 500 }
        );
    }
}

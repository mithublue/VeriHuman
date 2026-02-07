import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering
export const dynamic = 'force-dynamic';


export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const token = searchParams.get('token');

        if (!token) {
            return NextResponse.json(
                { error: 'Verification token is required' },
                { status: 400 }
            );
        }

        // Find user with this verification token
        const user = await prisma.user.findUnique({
            where: { verificationToken: token }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Invalid or expired verification token' },
                { status: 400 }
            );
        }

        // Check if already verified
        if (user.isActive && user.emailVerified) {
            return NextResponse.json(
                { message: 'Email already verified', alreadyVerified: true },
                { status: 200 }
            );
        }

        // Update user - mark as verified and active
        await prisma.user.update({
            where: { id: user.id },
            data: {
                emailVerified: new Date(),
                isActive: true,
                verificationToken: null, // Clear the token
            }
        });

        return NextResponse.json(
            { message: 'Email verified successfully! You can now sign in.' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Verification error:', error);
        return NextResponse.json(
            { error: 'An error occurred during verification' },
            { status: 500 }
        );
    }
}

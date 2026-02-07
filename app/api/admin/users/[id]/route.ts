import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { isAdmin } from '@/lib/admin';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

// PATCH - Update user
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        // Check authentication and admin access
        if (!session?.user?.email || !isAdmin(session.user.email)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await request.json();
        const { name, email, isActive, password } = body;

        // Validate required fields
        if (!name || !email) {
            return NextResponse.json(
                { error: 'Name and email are required' },
                { status: 400 }
            );
        }

        // Check if email is already taken by another user
        if (email) {
            const existingUser = await prisma.user.findUnique({
                where: { email }
            });

            if (existingUser && existingUser.id !== params.id) {
                return NextResponse.json(
                    { error: 'Email already in use' },
                    { status: 409 }
                );
            }
        }

        // Prepare update data
        const updateData: any = {
            name,
            email,
        };

        // Only update isActive if provided
        if (typeof isActive === 'boolean') {
            updateData.isActive = isActive;
        }

        // Only update password if provided
        if (password && password.trim() !== '') {
            if (password.length < 8) {
                return NextResponse.json(
                    { error: 'Password must be at least 8 characters long' },
                    { status: 400 }
                );
            }
            updateData.password = await bcrypt.hash(password, 10);
        }

        // Update user
        const user = await prisma.user.update({
            where: { id: params.id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                isActive: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
            }
        });

        return NextResponse.json(
            { message: 'User updated successfully', user },
            { status: 200 }
        );

    } catch (error) {
        console.error('Update user error:', error);
        return NextResponse.json(
            { error: 'An error occurred while updating the user' },
            { status: 500 }
        );
    }
}

// DELETE - Delete user
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const session = await auth();

        // Check authentication and admin access
        if (!session?.user?.email || !isAdmin(session.user.email)) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Get the user to be deleted
        const userToDelete = await prisma.user.findUnique({
            where: { id: params.id }
        });

        if (!userToDelete) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }

        // Prevent admin from deleting themselves
        if (userToDelete.email === session.user.email) {
            return NextResponse.json(
                { error: 'You cannot delete your own account' },
                { status: 400 }
            );
        }

        // Delete user
        await prisma.user.delete({
            where: { id: params.id }
        });

        return NextResponse.json(
            { message: 'User deleted successfully' },
            { status: 200 }
        );

    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json(
            { error: 'An error occurred while deleting the user' },
            { status: 500 }
        );
    }
}

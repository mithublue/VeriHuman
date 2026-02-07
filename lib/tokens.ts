import crypto from 'crypto';

/**
 * Generate a secure random verification token
 */
export function generateVerificationToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Generate a verification URL
 */
export function generateVerificationUrl(token: string): string {
    const baseUrl = process.env.APP_URL || 'http://localhost:3000';
    return `${baseUrl}/auth/verify?token=${token}`;
}

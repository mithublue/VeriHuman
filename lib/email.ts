import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendVerificationEmailParams {
    to: string;
    name: string;
    verificationUrl: string;
}

/**
 * Send verification email to user
 */
export async function sendVerificationEmail({
    to,
    name,
    verificationUrl,
}: SendVerificationEmailParams) {
    try {
        const { data, error } = await resend.emails.send({
            from: process.env.FROM_EMAIL || 'VeriHuman <onboarding@resend.dev>',
            to: [to],
            subject: 'Verify your VeriHuman account',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verify Your Email</title>
                </head>
                <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 0;">
                        <tr>
                            <td align="center">
                                <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                    <!-- Header -->
                                    <tr>
                                        <td style="padding: 40px 40px 20px; text-align: center;">
                                            <h1 style="margin: 0; color: #7c3aed; font-size: 28px; font-weight: bold;">VeriHuman</h1>
                                        </td>
                                    </tr>
                                    
                                    <!-- Content -->
                                    <tr>
                                        <td style="padding: 0 40px 40px;">
                                            <h2 style="margin: 0 0 20px; color: #1f2937; font-size: 24px; font-weight: 600;">Welcome, ${name}!</h2>
                                            <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                                Thank you for creating an account with VeriHuman. To complete your registration and start using our AI text humanization services, please verify your email address.
                                            </p>
                                            <p style="margin: 0 0 30px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                                Click the button below to verify your email:
                                            </p>
                                            
                                            <!-- Button -->
                                            <table width="100%" cellpadding="0" cellspacing="0">
                                                <tr>
                                                    <td align="center" style="padding: 0 0 30px;">
                                                        <a href="${verificationUrl}" style="display: inline-block; padding: 14px 32px; background: linear-gradient(to right, #7c3aed, #ec4899); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                                                            Verify Email Address
                                                        </a>
                                                    </td>
                                                </tr>
                                            </table>
                                            
                                            <p style="margin: 0 0 10px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                                Or copy and paste this link into your browser:
                                            </p>
                                            <p style="margin: 0 0 30px; color: #7c3aed; font-size: 14px; word-break: break-all;">
                                                ${verificationUrl}
                                            </p>
                                            
                                            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                                            
                                            <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.6;">
                                                If you didn't create an account with VeriHuman, you can safely ignore this email.
                                            </p>
                                        </td>
                                    </tr>
                                    
                                    <!-- Footer -->
                                    <tr>
                                        <td style="padding: 20px 40px; background-color: #f9fafb; border-radius: 0 0 12px 12px; text-align: center;">
                                            <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                                © ${new Date().getFullYear()} VeriHuman. All rights reserved.
                                            </p>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </body>
                </html>
            `,
        });

        if (error) {
            console.error('Error sending verification email:', error);
            return { success: false, error };
        }

        return { success: true, data };
    } catch (error) {
        console.error('Error sending verification email:', error);
        return { success: false, error };
    }
}

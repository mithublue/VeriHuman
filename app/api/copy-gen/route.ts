import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '@/lib/prisma';
import { auth } from '@/auth';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
    try {
        const session = await auth();
        // Allow guest usage for now, but link to user if logged in
        const userId = session?.user?.id;

        const { productName, features, keywords, audience, platform, tone, image } = await req.json();

        // 1. Construct the prompt
        let prompt = `You are an expert ${tone} copywriter specializing in ${platform} marketing.
        
        Write high-converting, SEO-optimized, and AEO-friendly sales copy for the following product:
        
        Product Name: ${productName || 'Unknown Product'}
        Target Audience: ${audience || 'General public'}
        Key Features: ${features || 'Not specified'}
        SEO Keywords: ${keywords || 'None'}
        
        Requirements:
        1. **Format**: Return the output in clean, semantic HTML (e.g., <p>, <ul>, <li>, <strong>). Do NOT use markdown code blocks or \`\`\`html tags. Just the raw HTML content.
        2. **Structure**: Follow the AIDA framework (Attention, Interest, Desire, Action) for the flow, BUT **DO NOT** labeling the sections (e.g., do NOT write "Attention:", "Interest:", etc.). The flow must be natural and invisible.
        3. **Tone & Humanization**: Write in a strictly human tone. Avoid AI-sounding fluff, repetitive sentence structures, and robotic transitions. Use natural language, varying sentence lengths, and emotional hooks. Command: **HUMANIZE THE OUTPUT TO PASS AI DETECTION.**
        4. **Platform Optimization**: Optimize for ${platform}.
        5. **Styling**: Use <strong> tags for key benefits. Use emojis sparingly if appropriate for ${platform}.
        `;

        let generatedText = '';
        // 2. Handle Image Analysis (if present)
        if (image) { // image is base64 string
            // Remove data:image/jpeg;base64, prefix if present
            const base64Data = image.split(',')[1] || image;

            prompt += `\nI have also provided an image of the product. Analyze it to identify visual selling points, materials, and aesthetic details to include in the copy.`;

            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

            const result = await model.generateContent([
                prompt,
                {
                    inlineData: {
                        data: base64Data,
                        mimeType: 'image/jpeg'
                    }
                }
            ]);
            generatedText = result.response.text();

        } else {
            // Text-only generation
            const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });
            const result = await model.generateContent(prompt);
            generatedText = result.response.text();
        }

        // Cleanup: Remove markdown code blocks if present (e.g., ```html ... ```)
        generatedText = generatedText.replace(/```html/g, '').replace(/```/g, '').trim();

        // 3. Save to Database
        try {
            await prisma.generatedCopy.create({
                data: {
                    userId: userId || null,
                    productName: productName || 'Untitled Product',
                    inputData: JSON.stringify({ features, keywords, audience }),
                    generated: generatedText,
                    platform,
                    tone,
                }
            });
        } catch (dbError) {
            console.error('Database Save Error (non-fatal):', dbError);
            // Continue even if DB save fails, user still gets their copy
        }

        return NextResponse.json({ generatedText });

    } catch (error: any) {
        console.error('Copy Generation Critical Error:', error);

        // Return more specific error message if available
        const errorMessage = error?.message || 'Failed to generate copy';

        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}

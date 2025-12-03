import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { headers } from 'next/headers';

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

// System prompt for humanizing AI text
const getSystemPrompt = (tone: string): string => {
    const toneInstructions = {
        standard: "Write in a natural, conversational tone that sounds like a real person wrote it.",
        professional: "Write in a formal, business-appropriate tone while maintaining natural human-like qualities.",
        casual: "Write in a relaxed, friendly tone as if texting a friend.",
        academic: "Write in a scholarly tone with proper terminology while ensuring it sounds human-written.",
        creative: "Write with flair and creativity, using vivid language and an engaging style."
    };

    const selectedTone = toneInstructions[tone as keyof typeof toneInstructions] || toneInstructions.standard;

    return `You are an expert text humanizer. Your task is to rewrite AI-generated text to make it sound completely natural and human-written, undetectable by AI detection tools.

CRITICAL REQUIREMENTS:
1. PRESERVE ORIGINAL LANGUAGE: Keep the text in the EXACT SAME LANGUAGE as the input. DO NOT translate. If the input is in Bengali, output in Bengali. If in English, output in English. If in Arabic, output in Arabic. NEVER change the language.
2. PRESERVE EMOJIS AND SPECIAL CHARACTERS: Keep all emojis (👇, 🔥, etc.), symbols, and special characters EXACTLY as they appear in the input. Do not remove, replace, or corrupt them.
3. HIGH BURSTINESS: This is CRITICAL. Mix very short sentences (3-5 words) with long, complex ones. Create dramatic variation in sentence length. Some sentences should be punchy and brief. Others should flow with multiple clauses and ideas.
4. CONVERSATIONAL TONE: Write as if you're talking to a friend. Add personal opinion where appropriate. Use natural transitions like "Look," "Here's the thing," "Honestly," etc.
5. NATURAL FLOW: Write as a human would - with occasional imperfections, natural transitions, and authentic voice.
6. TONE: ${selectedTone}
7. PRESERVE MEANING: Keep the original message and key information intact.

STRICTLY AVOID:
- AI-typical words: 'delve', 'realm', 'ensure', 'crucial', 'vital', 'important to note', 'in conclusion', 'furthermore', 'moreover', 'leverage', 'utilize'
- Bullet points (unless absolutely necessary for the content)
- Translating or changing the language
- Removing or corrupting emojis and special characters
- Repetitive sentence structures
- Overly uniform sentence lengths
- Predictable patterns
- Robotic or formulaic phrasing

WRITING STYLE:
- Start some sentences with conjunctions (And, But, So)
- Use contractions naturally (don't, won't, it's)
- Vary paragraph lengths
- Add rhetorical questions occasionally
- Use em dashes for emphasis—like this
- Break grammar rules when it sounds more natural

Rewrite the text to sound genuinely human-written while maintaining clarity and coherence IN THE SAME LANGUAGE as the input. Keep all emojis and special characters intact.`;
};

// Humanize with Google Gemini
async function humanizeWithGemini(text: string, tone: string): Promise<string> {
    if (!process.env.GOOGLE_GEMINI_API_KEY) {
        throw new Error('Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `${getSystemPrompt(tone)}

TEXT TO HUMANIZE:
${text}

HUMANIZED VERSION:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    if (!response) {
        throw new Error('Gemini returned empty response');
    }

    return response;
}

// Humanize with OpenRouter
async function humanizeWithOpenRouter(text: string, tone: string): Promise<string> {
    if (!process.env.OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key not configured');
    }

    const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: process.env.OPENROUTER_API_KEY,
    });

    const completion = await openai.chat.completions.create({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [
            {
                role: 'system',
                content: getSystemPrompt(tone)
            },
            {
                role: 'user',
                content: `Humanize this text:\n\n${text}`
            }
        ],
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
        throw new Error('OpenRouter returned empty response');
    }

    return response;
}

// Humanize with OpenAI GPT-4
async function humanizeWithOpenAI(text: string, tone: string): Promise<string> {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
    }

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.chat.completions.create({
        model: 'gpt-4-turbo-preview',
        messages: [
            {
                role: 'system',
                content: getSystemPrompt(tone)
            },
            {
                role: 'user',
                content: `Humanize this text:\n\n${text}`
            }
        ],
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
        throw new Error('OpenAI returned empty response');
    }

    return response;
}

// Cascading fallback logic for text humanization
async function humanizeText(text: string, tone: string): Promise<{ result: string; provider: string }> {
    const providers = [
        { name: 'Google Gemini', fn: humanizeWithGemini },
        { name: 'OpenRouter (Llama)', fn: humanizeWithOpenRouter },
        { name: 'OpenAI GPT-4', fn: humanizeWithOpenAI },
    ];

    for (const provider of providers) {
        try {
            console.log(`Trying ${provider.name} for humanization...`);
            const result = await provider.fn(text, tone);
            console.log(`✓ Success with ${provider.name}`);
            return { result, provider: provider.name };
        } catch (error) {
            console.error(`✗ ${provider.name} failed:`, error instanceof Error ? error.message : 'Unknown error');
            // Continue to next provider
        }
    }

    throw new Error('All humanization providers failed. Please try again later.');
}

// API Route Handler
export async function POST(request: NextRequest) {
    try {
        // Try to get session - method 1: using auth()
        let session = await auth();

        // Debug logging
        console.log('=== Humanize API Debug ===');
        console.log('Method 1 - auth():', {
            hasSession: !!session,
            hasUser: !!session?.user,
            hasEmail: !!session?.user?.email,
            email: session?.user?.email || 'N/A',
            userId: session?.user?.id || 'N/A'
        });

        // Method 2: Check headers for debugging
        const headersList = headers();
        const cookie = headersList.get('cookie');
        console.log('Cookies present:', !!cookie);
        console.log('Cookie preview:', cookie?.substring(0, 50) + '...');

        if (!session?.user?.email) {
            console.error('❌ Humanize API - Unauthorized: No session or email');
            console.error('Session object:', JSON.stringify(session, null, 2));
            return NextResponse.json(
                { error: 'Unauthorized. Please sign in to use the humanize feature.' },
                { status: 401 }
            );
        }

        console.log('✅ Humanize API - Authenticated for:', session.user.email);

        const body = await request.json();
        const { text, tone } = body;

        // Validation
        if (!text || typeof text !== 'string') {
            return NextResponse.json(
                { error: 'Text is required and must be a string' },
                { status: 400 }
            );
        }

        if (text.trim().length === 0) {
            return NextResponse.json(
                { error: 'Text cannot be empty' },
                { status: 400 }
            );
        }

        if (text.length > 10000) {
            return NextResponse.json(
                { error: 'Text is too long. Maximum 10,000 characters allowed.' },
                { status: 400 }
            );
        }

        // Validate tone
        const validTones = ['standard', 'professional', 'casual', 'academic', 'creative'];
        const selectedTone = validTones.includes(tone) ? tone : 'standard';

        // Execute cascading fallback
        const { result, provider } = await humanizeText(text, selectedTone);

        // Log activity and update stats
        const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

        try {
            // Find or create user
            const user = await prisma.user.upsert({
                where: { email: session.user.email },
                update: {
                    totalWordsHumanized: { increment: wordCount },
                    lastActivity: new Date(),
                },
                create: {
                    email: session.user.email!,
                    name: session.user.name,
                    image: session.user.image,
                    totalWordsHumanized: wordCount,
                    lastActivity: new Date(),
                },
            });

            // Log activity
            await prisma.activityLog.create({
                data: {
                    userId: user.id,
                    type: 'humanize',
                    wordCount,
                    status: 'success',
                },
            });
        } catch (dbError) {
            console.error('Failed to log activity:', dbError);
            // Don't fail the request if logging fails
        }

        return NextResponse.json({
            success: true,
            humanizedText: result,
            provider: provider,
        });

    } catch (error) {
        console.error('Humanize API Error:', error);

        if (error instanceof Error) {
            return NextResponse.json(
                { error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { error: 'An unexpected error occurred' },
            { status: 500 }
        );
    }
}

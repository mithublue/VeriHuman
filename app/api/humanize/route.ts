import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// System prompt for humanizing AI text
const getSystemPrompt = (tone: string): string => {
    const toneInstructions = {
        standard: 'Use a balanced, natural writing style.',
        casual: 'Use a relaxed, conversational tone with contractions and informal language.',
        formal: 'Use professional, polished language with proper grammar and structure.',
        academic: 'Use scholarly language with precise terminology and formal structure.',
    };

    const toneInstruction = toneInstructions[tone.toLowerCase() as keyof typeof toneInstructions] || toneInstructions.standard;

    return `You are an expert text humanizer. Your task is to rewrite AI-generated text to make it sound completely natural and human-written, undetectable by AI detection tools.

CRITICAL REQUIREMENTS:
1. HIGH PERPLEXITY: Use varied, sophisticated vocabulary. Avoid predictable word choices. Mix common and uncommon words naturally.
2. HIGH BURSTINESS: Vary sentence lengths dramatically. Combine short, punchy sentences with longer, complex ones. Create natural rhythm.
3. NATURAL FLOW: Write as a human would - with occasional imperfections, natural transitions, and authentic voice.
4. TONE: ${toneInstruction}
5. PRESERVE MEANING: Keep the original message and key information intact.

AVOID:
- Repetitive sentence structures
- Overly uniform sentence lengths
- Predictable patterns
- Robotic or formulaic phrasing
- AI-typical phrases like "delve into", "it's important to note", "in conclusion"

Rewrite the text to sound genuinely human-written while maintaining clarity and coherence.`;
};

// Provider 1: Google Gemini (Free tier)
async function tryGemini(text: string, tone: string): Promise<string> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-lite',
        systemInstruction: getSystemPrompt(tone),
    });

    const result = await model.generateContent(text);
    const response = result.response;
    const humanizedText = response.text();

    if (!humanizedText) {
        throw new Error('Gemini returned empty response');
    }

    return humanizedText;
}

// Provider 2: OpenRouter with Llama 3 8B (Free tier)
async function tryOpenRouter(text: string, tone: string): Promise<string> {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        throw new Error('OpenRouter API key not configured');
    }

    const openai = new OpenAI({
        baseURL: 'https://openrouter.ai/api/v1',
        apiKey: apiKey,
    });

    const completion = await openai.chat.completions.create({
        model: 'meta-llama/llama-3.3-70b-instruct:free',
        messages: [
            { role: 'system', content: getSystemPrompt(tone) },
            { role: 'user', content: `Humanize this text:\n${text}` },
        ],
    });

    const humanizedText = completion.choices[0]?.message?.content;

    if (!humanizedText) {
        throw new Error('OpenRouter returned empty response');
    }

    return humanizedText;
}

// Provider 3: Pollinations.ai (No API key needed - Last resort)
async function tryPollinations(text: string, tone: string): Promise<string> {
    const response = await fetch('https://text.pollinations.ai/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            messages: [
                { role: 'system', content: getSystemPrompt(tone) },
                { role: 'user', content: `Humanize this text:\n${text}` },
            ],
            model: 'openai',
        }),
    });

    if (!response.ok) {
        throw new Error(`Pollinations API error: ${response.status}`);
    }

    const humanizedText = await response.text();

    if (!humanizedText) {
        throw new Error('Pollinations returned empty response');
    }

    return humanizedText;
}

// Cascading fallback logic
async function humanizeText(text: string, tone: string): Promise<{ result: string; provider: string }> {
    const providers = [
        { name: 'Google Gemini', fn: tryGemini },
        { name: 'OpenRouter', fn: tryOpenRouter },
        { name: 'Pollinations.ai', fn: tryPollinations },
    ];

    for (const provider of providers) {
        try {
            console.log(`Trying ${provider.name}...`);
            const result = await provider.fn(text, tone);
            console.log(`✓ Success with ${provider.name}`);
            return { result, provider: provider.name };
        } catch (error) {
            console.error(`✗ ${provider.name} failed:`, error instanceof Error ? error.message : 'Unknown error');
            // Continue to next provider
        }
    }

    throw new Error('All AI providers failed. Please try again later.');
}

// API Route Handler
export async function POST(request: NextRequest) {
    try {
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

        const validTones = ['standard', 'casual', 'formal', 'academic'];
        const selectedTone = tone?.toLowerCase() || 'standard';

        if (!validTones.includes(selectedTone)) {
            return NextResponse.json(
                { error: 'Invalid tone. Must be one of: standard, casual, formal, academic' },
                { status: 400 }
            );
        }

        // Execute cascading fallback
        const { result, provider } = await humanizeText(text, selectedTone);

        return NextResponse.json({
            success: true,
            humanizedText: result,
            provider,
            tone: selectedTone,
        });

    } catch (error) {
        console.error('API Error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unexpected error occurred',
                success: false,
            },
            { status: 500 }
        );
    }
}

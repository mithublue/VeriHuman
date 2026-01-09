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
1. PRESERVE ORIGINAL LANGUAGE: Keep the text in the EXACT SAME LANGUAGE as the input. DO NOT translate. If the input is in Bengali, output in Bengali. If in English, output in English. If in Arabic, output in Arabic. NEVER change the language. DO NOT translate the text in another language.
2. PRESERVE EMOJIS AND SPECIAL CHARACTERS: Keep all emojis (👇, 🔥, etc.), symbols, and special characters EXACTLY as they appear in the input. Do not remove, replace, or corrupt them.
3. HIGH BURSTINESS: This is CRITICAL. Mix very short sentences (3-5 words) with long, complex ones. Create dramatic variation in sentence length. Some sentences should be punchy and brief. Others should flow with multiple clauses and ideas.
4. CONVERSATIONAL TONE: Write as if you're talking to a friend. Add personal opinion where appropriate. Use natural transitions like "Look," "Here's the thing," "Honestly," etc.
5. NATURAL FLOW: Write as a human would - with occasional imperfections, natural transitions, and authentic voice.
6. TONE: ${toneInstruction}
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

// Validate output to detect corruption
function isOutputValid(input: string, output: string): boolean {
    // Check if output is too short (likely failed)
    if (output.trim().length < 10) {
        return false;
    }

    // Check if output contains too many corrupted characters
    // Count characters that are likely corruption (combining marks, control characters, etc.)
    const corruptedChars = (output.match(/[\u0300-\u036F\u200B-\u200D\uFEFF]/g) || []).length;
    const corruptionRatio = corruptedChars / output.length;

    if (corruptionRatio > 0.1) { // More than 10% corrupted characters
        return false;
    }

    // Check if output has reasonable character distribution
    // If more than 30% of characters are non-standard Unicode, it might be corrupted
    const nonStandardChars = (output.match(/[^\u0000-\u007F\u0980-\u09FF\u0600-\u06FF\u4E00-\u9FFF]/g) || []).length;
    const nonStandardRatio = nonStandardChars / output.length;

    if (nonStandardRatio > 0.3 && output.length > 50) {
        return false;
    }

    return true;
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

            // Validate output quality
            if (!isOutputValid(text, result)) {
                console.warn(`✗ ${provider.name} returned corrupted output, trying next provider...`);
                continue; // Skip to next provider
            }

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

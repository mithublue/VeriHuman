import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Force Node.js runtime for Prisma compatibility
export const runtime = 'nodejs';

// AI Detection Result Interface
interface DetectionResult {
    ai_score: number;
    verdict: 'Highly AI Generated' | 'Marketing / Template' | 'Possibly Mixed' | 'Likely Human';
    analysis: {
        perplexity_level: 'Low' | 'Medium' | 'High';
        burstiness_level: 'Low' | 'Medium' | 'High';
        detected_keywords: string[];
        reasoning: string;
    };
}

// Inverse Variance-Entropy Model (IVEM) Prompt
const DETECTION_PROMPT = `You are an expert Linguistic Analyst and Mathematician. Your task is to analyze a given text (in English, Bengali, or Arabic) and determine if it is AI-Generated or Human-Written.

You must use a specific mathematical model called "The Inverse Variance-Entropy Model (IVEM)" to calculate an AI Score ($S_{AI}$) from 0 to 100.

### 1. The Formula Logic
The score is derived based on this conceptual formula:
$$S_{AI} = \\sigma \\left( \\frac{\\alpha}{P(T)^{\\lambda}} + \\frac{\\beta}{B(T)^{\\mu}} + \\gamma \\sum (w_i \\cdot f_i) - \\delta \\cdot E(T) \\right)$$

Where:
- **P(T) - Perplexity:** Measure of unpredictability. 
    - Low Perplexity (smooth, predictive) = High AI probability.
    - High Perplexity (creative, chaotic) = Human probability.
- **B(T) - Burstiness:** Measure of sentence variation (Standard Deviation).
    - Low Burstiness (monotone sentence lengths) = High AI probability.
    - High Burstiness (short and long mixed) = Human probability.
- **Pattern Penalty ($\\sum w \\cdot f$):** Presence of specific AI keywords.
- **E(T) - Entropy:** Emotional or grammatical inconsistencies (Human errors/emotions reduce AI score).

### 2. Analysis Guidelines (Simulate these values)

**Step A: Check for Patterns (Weights)**
Look for these specific keywords. If found, increase the AI Score significantly.
- **Hard AI Words (High Weight):** "delve", "landscape", "tapestry", "crucial", "realm", "underscores", "nuance", "meticulous", "seamlessly", "সামগ্রিক", "বিপ্লব", "ল্যান্ডস্কেপ", "গুরুত্বপূর্ণ", "ভূমিকা পালন", "লুকিয়ে আছে", "দুর্দান্ত ফিচার", "في الختام", "بشكل عام", "نقلة نوعية", "علاوة على ذلك".
- **Soft/Marketing Words (Low Weight):** "unlock", "elevate", "game-changer", "order now", "best choice", "solution", "নিয়ে এলো", "সেরা", "ম্যাজিক", "অফার", "অর্ডার করুন", "চিন্তা নেই", "عرض خاص", "اطلب الآن".
- **Conversational/Chatbot Words (Medium Weight):** "I'm sorry", "As an AI", "cannot extract", "দুঃখিত", "পারি নি", "আমি এআই", "أنا آسف".

**Step B: Estimate Perplexity & Burstiness**
- If the text is perfectly grammatical but uses rare words strangely -> Low Perplexity (AI).
- If the text has sentence structure like: Sentence A (10 words). Sentence B (11 words). Sentence C (10 words). -> Low Burstiness (AI).
- If the text has: "Wow! No way. (3 words)" followed by a long complex explanation (30 words). -> High Burstiness (Human).

**Step C: Apply The Logic**
- **Scenario 1 (Pure AI):** Low Perplexity + Low Burstiness + Hard Keywords = Score 90-100%.
- **Scenario 2 (Marketing/Templates):** Medium Perplexity + Low Burstiness + Soft Keywords = Score 60-75%.
- **Scenario 3 (Human):** High Perplexity + High Burstiness + No Keywords = Score 0-20%.
- **Scenario 4 (AI Assistant):** High Burstiness + Conversational Keywords = Score 95-100%.

### 3. Output Format
Return ONLY a valid JSON object. Do not include markdown formatting (\`\`\`json).
Structure:
{
  "ai_score": number (0-100),
  "verdict": string ("Highly AI Generated" | "Marketing / Template" | "Possibly Mixed" | "Likely Human"),
  "analysis": {
    "perplexity_level": string ("Low" | "Medium" | "High"),
    "burstiness_level": string ("Low" | "Medium" | "High"),
    "detected_keywords": string[],
    "reasoning": string (Short explanation in Bengali or English based on input language)
  }
}`;

// Parse JSON from LLM response (handles markdown code blocks)
function parseJSONResponse(response: string): DetectionResult {
    // Remove markdown code blocks if present
    let cleanedResponse = response.trim();

    // Remove ```json and ``` markers
    cleanedResponse = cleanedResponse.replace(/```json\s*/gi, '');
    cleanedResponse = cleanedResponse.replace(/```\s*/g, '');

    // Try to parse JSON
    try {
        const parsed = JSON.parse(cleanedResponse);

        // Validate required fields
        if (typeof parsed.ai_score !== 'number' ||
            !parsed.verdict ||
            !parsed.analysis ||
            !parsed.analysis.perplexity_level ||
            !parsed.analysis.burstiness_level ||
            !Array.isArray(parsed.analysis.detected_keywords) ||
            !parsed.analysis.reasoning) {
            throw new Error('Invalid response format');
        }

        return parsed as DetectionResult;
    } catch (error) {
        throw new Error('Failed to parse AI detection response');
    }
}

// Provider 1: Google Gemini
async function detectWithGemini(text: string): Promise<DetectionResult> {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error('Gemini API key not configured');
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.5-flash-lite-preview-09-2025', // Stable model - 1500 RPD free tier
        generationConfig: {
            temperature: 0.1,
            responseMimeType: 'application/json',
        },
    });

    const prompt = `${DETECTION_PROMPT}\n\nAnalyze this text:\n${text}`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();
    console.log('Gemini raw response:', response.substring(0, 200));

    if (!response) {
        throw new Error('Gemini returned empty response');
    }

    return parseJSONResponse(response);
}

// Provider 2: OpenRouter
async function detectWithOpenRouter(text: string): Promise<DetectionResult> {
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
            { role: 'system', content: DETECTION_PROMPT },
            { role: 'user', content: `Analyze this text:\n${text}` },
        ],
        temperature: 0.1, // Low temperature for consistent analysis
        response_format: { type: 'json_object' },
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
        throw new Error('OpenRouter returned empty response');
    }

    return parseJSONResponse(response);
}

// Cascading fallback logic for AI detection
async function detectAI(text: string): Promise<{ result: DetectionResult; provider: string }> {
    const providers = [
        { name: 'Google Gemini', fn: detectWithGemini },
        { name: 'OpenRouter', fn: detectWithOpenRouter },
    ];

    for (const provider of providers) {
        try {
            console.log(`Trying ${provider.name} for AI detection...`);
            const result = await provider.fn(text);
            console.log(`✓ Success with ${provider.name}`);
            return { result, provider: provider.name };
        } catch (error) {
            console.error(`✗ ${provider.name} failed:`, error instanceof Error ? error.message : 'Unknown error');
            // Continue to next provider
        }
    }

    throw new Error('All AI detection providers failed. Please try again later.');
}

// API Route Handler
export async function POST(request: NextRequest) {
    try {
        // Import rate limiter
        const { checkRateLimit, trackApiUsage } = await import('@/lib/rate-limiter');

        // Check authentication
        const session = await auth();
        if (!session?.user?.id) {
            return NextResponse.json(
                { error: 'Please sign in to use this feature' },
                { status: 401 }
            );
        }

        // Ensure user exists in database (prevents foreign key errors)
        await prisma.user.upsert({
            where: { id: session.user.id },
            update: {
                lastActivity: new Date(),
            },
            create: {
                id: session.user.id,
                email: session.user.email!,
                name: session.user.name,
                image: session.user.image,
                lastActivity: new Date(),
            },
        });

        // Check rate limit (Free tier: 1 req/min, 30s cooldown)
        const rateLimit = await checkRateLimit(
            session.user.id,
            'detect',
            'free' // TODO: Get from user subscription when implemented
        );

        if (!rateLimit.allowed) {
            return NextResponse.json(
                {
                    error: rateLimit.message,
                    remaining: rateLimit.remaining,
                    resetIn: rateLimit.resetIn,
                    rateLimited: true
                },
                { status: 429 }
            );
        }

        // Queue wait if needed (5 seconds for free tier)
        if (rateLimit.queueWait > 0) {
            await new Promise(resolve => setTimeout(resolve, rateLimit.queueWait * 1000));
        }

        const body = await request.json();
        const { text } = body;

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

        const wordCount = text.trim().split(/\s+/).filter(Boolean).length;

        // Execute AI detection with cascading fallback
        const { result, provider } = await detectAI(text);

        // Track successful usage
        await trackApiUsage(
            session.user.id,
            'detect',
            provider.toLowerCase().replace(/\s+/g, '_'),
            wordCount,
            true
        );

        // Log activity (keep existing activity log for compatibility)
        try {
            // Find or create user
            const user = await prisma.user.upsert({
                where: { email: session.user.email! },
                update: {
                    totalDetections: { increment: 1 },
                    lastActivity: new Date(),
                },
                create: {
                    email: session.user.email!,
                    name: session.user.name,
                    image: session.user.image,
                    totalDetections: 1,
                    lastActivity: new Date(),
                },
            });

            // Log activity
            await prisma.activityLog.create({
                data: {
                    userId: user.id,
                    type: 'detect',
                    provider: provider,
                    wordCount,
                    status: 'success',
                },
            });
        } catch (dbError) {
            console.error('Failed to log detection activity:', dbError);
            // Don't fail the request if logging fails
        }

        return NextResponse.json({
            success: true,
            score: result.ai_score,
            verdict: result.verdict,
            perplexity_analysis: `Perplexity Level: ${result.analysis.perplexity_level}`,
            burstiness_analysis: `Burstiness Level: ${result.analysis.burstiness_level}`,
            reason: result.analysis.reasoning,
            provider: provider,
            remaining: rateLimit.remaining,
            resetIn: rateLimit.resetIn,
            details: {
                perplexity_level: result.analysis.perplexity_level,
                burstiness_level: result.analysis.burstiness_level,
                detected_keywords: result.analysis.detected_keywords,
            }
        });

    } catch (error) {
        console.error('AI Detection API Error:', error);

        // Track failed usage if we have session
        try {
            const { trackApiUsage } = await import('@/lib/rate-limiter');
            const session = await auth();

            if (session?.user?.id) {
                await trackApiUsage(
                    session.user.id,
                    'detect',
                    'unknown',
                    0,
                    false
                );
            }
        } catch (trackError) {
            console.error('Failed to track error:', trackError);
        }

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unexpected error occurred',
                success: false,
            },
            { status: 500 }
        );
    }
}

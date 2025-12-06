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
    perplexity_analysis: string;
    burstiness_analysis: string;
    ai_score: number;
    verdict: 'Likely AI' | 'Likely Human' | 'Mixed';
    reason: string;
}

// Linguistic Forensic Analyst System Prompt
const DETECTION_PROMPT = `Act as an expert Linguistic Forensic Analyst and AI Detection Engine. Your task is to analyze the provided text and calculate the probability of it being AI-generated based on specific mathematical and linguistic markers.

You must analyze the text across three distinct dimensions and calculate a weighted score.

### Dimension 1: Perplexity & Vocabulary (Weight: 40%)
- **Mechanism:** AI models minimize perplexity, choosing the most probable next word.
- **Markers to punish (Increase AI Score):** Use of words like "delve", "realm", "tapestry", "underscores", "pivotal", "landscape", "crucial". Frequent use of transition words like "Moreover", "Furthermore", "In conclusion".
- **Markers to reward (Decrease AI Score):** Use of slang, rare vocabulary, typos, colloquialisms, or highly specific proper nouns.

### Dimension 2: Burstiness & Sentence Variance (Weight: 30%)
- **Mechanism:** Humans write with high burstiness (mixing very short and very long sentences). AI writes with uniform sentence lengths (low standard deviation).
- **Calculation:** Analyze the variance in sentence length.
- **Scoring:**
  - High Variance (e.g., a 4-word sentence followed by a 25-word sentence) = Low AI Score.
  - Low Variance (Monotonous rhythm) = High AI Score.

### Dimension 3: Structural Patterns (Weight: 30%)
- **Mechanism:** AI tends to be overly neutral, structured, and preachy.
- **Markers:** Balanced arguments ("On the one hand..."), lack of strong personal opinion, excessive bullet points, repetitive intro/outro structures.

### Final Calculation Formula:
AI_Score = (Dim1_Score * 0.4) + (Dim2_Score * 0.3) + (Dim3_Score * 0.3)

---
### Output Format:
You must return ONLY a JSON object. Do not provide any conversational text.

{
  "perplexity_analysis": "Brief note on vocabulary usage",
  "burstiness_analysis": "Brief note on sentence structure variance",
  "ai_score": number, (0 to 100, where 100 is fully AI)
  "verdict": "Likely AI" or "Likely Human" or "Mixed",
  "reason": "The main reason for this score"
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
            !parsed.perplexity_analysis ||
            !parsed.burstiness_analysis ||
            !parsed.reason) {
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
        model: 'gemini-2.5-flash-lite',
        generationConfig: {
            temperature: 0.1, // Low temperature for consistent analysis
            responseMimeType: 'application/json',
        },
    });

    const prompt = `${DETECTION_PROMPT}\n\nAnalyze this text:\n${text}`;
    const result = await model.generateContent(prompt);
    const response = result.response.text();

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

        // Execute AI detection with cascading fallback
        const { result, provider } = await detectAI(text);

        // Log activity if user is authenticated
        try {
            const session = await auth();
            if (session?.user?.email) {
                const wordCount = text.trim().split(/\\s+/).filter(Boolean).length;

                // Find or create user
                const user = await prisma.user.upsert({
                    where: { email: session.user.email },
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
            }
        } catch (dbError) {
            console.error('Failed to log detection activity:', dbError);
            // Don't fail the request if logging fails
        }

        return NextResponse.json({
            success: true,
            score: result.ai_score,
            verdict: result.verdict,
            perplexity_analysis: result.perplexity_analysis,
            burstiness_analysis: result.burstiness_analysis,
            reason: result.reason,
            provider: provider,
        });

    } catch (error) {
        console.error('AI Detection API Error:', error);

        return NextResponse.json(
            {
                error: error instanceof Error ? error.message : 'An unexpected error occurred',
                success: false,
            },
            { status: 500 }
        );
    }
}

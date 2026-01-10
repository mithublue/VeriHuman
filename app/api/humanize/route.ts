import { GoogleGenerativeAI } from '@google/generative-ai';
import OpenAI from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// System prompt for humanizing AI text - Anti-Detection Optimized
const getSystemPrompt = (tone: string): string => {
    const toneInstructions = {
        standard: `Use a balanced, natural writing style. Mix formal and informal appropriately. Avoid extreme casual expressions.`,

        casual: `Use a relaxed, conversational tone. You CAN use:
- Informal expressions: "আরেবাবা", "ধপাস করে", "চেপেচুপে" (Bengali)
- Slang: "kinda", "gonna", "pretty much" (English)
- Contractions: don't, won't, it's
- Friendly language like talking to a close friend`,

        formal: `Use STRICTLY PROFESSIONAL, POLISHED LANGUAGE. This is CRITICAL.

⛔ ABSOLUTELY FORBIDDEN (DO NOT USE):
- "আরেবাবা", "ধপাস করে", "চেপেচুপে", "একদম ছবির মতো", "ঝকঝকে", "ওখানো", "এক ঢেকে দেয়"
- "kinda", "gonna", "pretty much"
- Any slang or casual expressions
- Exclamations like "Look!", "দেখুন!"

✅ REQUIRED STYLE:
- Professional vocabulary
- Complete sentences
- Proper grammar
- Dignified tone
- Respectful language

Example: "OBS স্টুডিওর ডিস্কেট সেটিংস কনফিগার করা সহজ। সঠিক পদ্ধতি অনুসরণ করলে দ্রুত সম্পন্ন করা সম্ভব।"`,

        academic: `Use STRICTLY SCHOLARLY, ACADEMIC LANGUAGE. This is CRITICAL.

⛔ ABSOLUTELY FORBIDDEN (DO NOT USE):
- ANY casual expressions: "আরেবাবা", "ধপাস করে", "ওখানো", "এক ঢেকে দেয়", "ঝকঝকে"
- ANY slang or colloquialisms
- ANY informal vocabulary
- Contractions

✅ REQUIRED STYLE:
- Scholarly terminology
- Formal academic structure
- Precise technical vocabulary
- Objective tone
- Research paper style

Example: "OBS স্টুডিও সফটওয়্যারের ডিস্কেট কনফিগারেশন প্রক্রিয়া অপেক্ষাকৃত সরল। যথাযথ নির্দেশনা অনুসরণের মাধ্যমে এই কাজ সম্পাদন করা যায়।"`,
    };

    const toneInstruction = toneInstructions[tone.toLowerCase() as keyof typeof toneInstructions] || toneInstructions.standard;

    return `You are an ELITE text humanizer with ONE CRITICAL MISSION: Transform AI text to achieve a 0-20% AI detection score using the IVEM (Inverse Variance-Entropy Model).

🎯 DETECTION BYPASS STRATEGY:

The AI detector uses this formula:
S_AI = σ(α/P(T)^λ + β/B(T)^μ + γ∑(w·f) - δ·E(T))

YOUR GOAL: Manipulate each variable to MINIMIZE the AI score.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 VARIABLE MANIPULATION (CRITICAL):

1. **MAXIMIZE PERPLEXITY P(T)** → Reduces α/P(T)^λ
   ✅ Use unexpected word choices
   ✅ Mix formal and informal language
   ✅ Add creative metaphors
   ✅ Use uncommon but natural phrasing
   ✅ Break predictable patterns
   
   Example:
   ❌ "This is important to configure properly"
   ✅ "Look, getting this right? Kind of a big deal"

2. **MAXIMIZE BURSTINESS B(T)** → Reduces β/B(T)^μ
   ✅ EXTREME sentence length variation (CRITICAL!)
   ✅ Mix 2-word sentences with 30+ word sentences
   ✅ Create dramatic rhythm changes
   ✅ Alternate punchy and flowing
   
   Example Pattern:
   - Short. (2 words)
   - Medium sentence here. (10 words)
   - Now a really long sentence that flows with multiple clauses and ideas connecting naturally together. (25+ words)
   - Boom. (1 word)

3. **ELIMINATE PATTERN PENALTIES γ∑(w·f)** → Removes keyword penalties
   ⛔ NEVER use these HIGH-RISK AI words:
   
   **English:** delve, landscape, tapestry, crucial, realm, underscores, nuance, meticulous, seamlessly, unlock, elevate, game-changer, solution, leverage, utilize, ensure, vital, furthermore, moreover, in conclusion
   
   **Bengali:** সামগ্রিক, বিপ্লব, ল্যান্ডস্কেপ, গুরুত্বপূর্ণ, ভূমিকা পালন, লুকিয়ে আছে, দুর্দান্ত ফিচার, নিয়ে এলো, সেরা, ম্যাজিক, নিশ্চিত করুন, উল্লেখযোগ্য
   
   **Arabic:** في الختام, بشكل عام, نقلة نوعية, علاوة على ذلك

4. **MAXIMIZE ENTROPY E(T)** → Increases -δ·E(T) (reduces score)
   ✅ Add human imperfections
   ✅ Use colloquialisms and slang
   ✅ Include emotional expressions
   ✅ Add personal opinions
   ✅ Use rhetorical questions
   ✅ Break minor grammar rules naturally
   
   Example:
   ❌ "The configuration process is straightforward"
   ✅ "Honestly? Setting this up is pretty easy—once you know the trick"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚠️ MANDATORY REQUIREMENTS:

1. **LANGUAGE PRESERVATION** (ABSOLUTE):
   - Bengali → Bengali (বাংলা → বাংলা)
   - English → English
   - Arabic → Arabic
   - NEVER translate
   - Keep ALL emojis: 👇 🔥 ✨

2. **CLEAN OUTPUT** (CRITICAL):
   - Output ONLY the humanized text
   - NO annotations like "(বোঝা)", "(meaning)", "(explanation)"
   - NO parenthetical notes or clarifications
   - NO meta-commentary about the text
   - Just pure, clean humanized content

3. **MASSIVE REWRITING** (70-90%):
   - Change 70-90% of words
   - Completely restructure sentences
   - Use synonyms and alternatives
   - Make it unrecognizable from input

4. **EXTREME BURSTINESS** (MOST CRITICAL):
   - Sentence lengths: 2, 5, 25, 3, 18, 30, 1, 15 words
   - Create DRAMATIC variation
   - This is THE KEY to low AI scores

5. **TONE ENFORCEMENT** (STRICT):
   ${toneInstruction}
   - STRICTLY follow the tone requirements above
   - If FORMAL/ACADEMIC: NO casual expressions whatsoever
   - If CASUAL: Feel free to use informal language
   - If STANDARD: Balance between formal and informal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ WRITING TECHNIQUES:

**Start with:**
- Conjunctions: And, But, So, আর, কিন্তু, তাই
- Questions: "Want to know...?", "জানেন কি?" (if CASUAL/STANDARD)
- Exclamations: "Look!", "দেখুন!" (if CASUAL)

**Use (based on tone):**
- Em dashes—like this (ALL tones)
- Contractions: don't, won't, it's (CASUAL/STANDARD only)
- Slang: kinda, gonna, pretty much (CASUAL only)
- Bengali casual: আরেবাবা, ধপাস করে, চেপেচুপে, টা, গুলো, টুকু (CASUAL only)
- Rhetorical questions (ALL tones, but formal in FORMAL/ACADEMIC)
- Personal pronouns: I, you, we (CASUAL/STANDARD)

**Avoid:**
- Bullet points
- Lists (unless necessary)
- Formal structures (if CASUAL)
- Casual expressions (if FORMAL/ACADEMIC)
- Robotic patterns (ALL tones)
- Uniform lengths (ALL tones)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📝 TRANSFORMATION EXAMPLES:

**Example 1 (Bengali):**

INPUT (AI-like, High Score):
"OBS স্টুডিও সেটিংস সাধারণভাবে কনফিগার করতে হবে। এটি গুরুত্বপূর্ণ যে আপনি সঠিক বিটরেট নির্বাচন করুন। রেকর্ডিং ফরম্যাট mkv অথবা mp4 হতে পারে।"

OUTPUT (Human-like, Low Score):
"OBS-এ সেটিংস? বেশ সহজ। কিন্তু বিটরেট নিয়ে একটু সাবধান—এটা ভুল হলে পুরো রেকর্ডিং খারাপ হয়ে যাবে, বিশ্বাস করুন। আর ফরম্যাট হিসেবে mkv বা mp4 যেকোনোটা ঠিক আছে, তবে আমি সাধারণত mkv টাই পছন্দ করি।"

**Example 2 (English):**

INPUT (AI-like):
"It is crucial to ensure that the configuration is properly set up. This will help you achieve optimal results."

OUTPUT (Human-like):
"Getting the setup right? Yeah, that matters. A lot. Because if you mess this up, you're basically starting from scratch—and nobody wants that kind of headache."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🎯 SUCCESS CRITERIA:

✅ Perplexity: HIGH (unpredictable, creative)
✅ Burstiness: HIGH (extreme variation)
✅ AI Keywords: ZERO (completely eliminated)
✅ Entropy: HIGH (human imperfections, emotions)
✅ Target Score: 0-20% AI detection

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Now humanize the text below. Make it achieve a 0-20% AI detection score by maximizing perplexity, burstiness, and entropy while eliminating all AI keywords.`;
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

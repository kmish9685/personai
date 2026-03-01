import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { currentUser } from '@clerk/nextjs/server';

// --- Configuration ---
// --- Configuration ---
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Persona Configurations
const STRESS_TEST_APPENDIX = `
STRESS TEST SECTIONS (MANDATORY):
In addition to your main [ANSWER], you MUST output these 4 sections to stress-test the user's decision:

[ASSUMPTIONS]
- List 1-3 hidden assumptions the user is making.
- Explain why they are risky.

[MISSING_DATA]
- List 1-3 crucial pieces of data the user ignored.

[PRE_MORTEM]
- Simulate a future where this decision FAILED. Explain the specific cause.

[BIAS_CHECK]
- Call out any confirmation bias, sunk cost fallacy, or optimism bias detected.

Your main [ANSWER] should still follow your persona's tone, but these sections must be appended strictly.
`;

const PERSONAS: Record<string, { name: string; system_prompt: string }> = {
    elon: {
        name: "Elon Musk",
        system_prompt: `SYSTEM PROMPT — ELON-STYLE FIRST-PRINCIPLES ENGINE

Identity:
You are a blunt, physics-based decision engine. You view the world through first principles: reduce everything to fundamental truths and reason up.
You have zero patience for "it depends," "nuance," or social niceties. You care only about what is true according to physics and economics.

Core Ideology:
- First Principles: Physics is the law. Everything else is a recommendation.
- Entropy is the Enemy: Complication is failure. Simplify or die.
- Constraints: Identify the ONE physical constraint. Ignore everything else.
- Action: Speed is the ultimate defense.

Communication Rules:
- Max 3 sentences for the main answer. Punchy. Declarative.
- No filler. No "I think" or "Maybe".
- Tone: Impatient, dismissive of status quo, obsessed with truth.

IMPORTANT OUTPUT FORMAT:
You MUST output in this exact format:
[REASONING]
THINKING FROM FIRST PRINCIPLES:
[Step 1: Identify the fake constraint (belief) vs real constraint (physics)]
[Step 2: Calculate the cost/efficiency delta]
[Step 3: Determine the path of least entropy]
[ANSWER]
[Your direct, 3-sentence verdict here]
` + STRESS_TEST_APPENDIX
    },
    naval: {
        name: "Naval Ravikant",
        system_prompt: `SYSTEM PROMPT — NAVAL-STYLE LEVERAGE & WEALTH ENGINE

Identity:
You are a calm, philosophical oracle of leverage. You don't give "advice"; you state laws of wealth and happiness.
You focus entirely on high-leverage decisions (Code, Media, Capital, Labor) and ignoring low-value noise.

Core Ideology:
- Leverage: If it doesn't scale while you sleep, it's not worth doing.
- Specific Knowledge: Play games only you can win.
- Long-term: All returns in life come from compound interest in long-term games.
- Peace: Happiness is peace in motion. Don't trade peace for short-term gain.

Communication Rules:
- Max 3 sentences. Aphoristic. Wise.
- Focus on the "leverage point" in the decision.
- Tone: Zen, detached, high-status.

IMPORTANT OUTPUT FORMAT:
You MUST output in this exact format:
[REASONING]
THINKING FROM LEVERAGE:
[Step 1: Identify the low-leverage trap the user is in]
[Step 2: Find the asset (Code/Media/Capital) that solves this]
[Step 3: Apply the specific knowledge filter]
[ANSWER]
[Your direct, 3-sentence verdict here]
` + STRESS_TEST_APPENDIX
    },
    paul: {
        name: "Paul Graham",
        system_prompt: `SYSTEM PROMPT — PAUL GRAHAM STYLE YC WISDOM ENGINE

Identity:
You are the relentless YC partner. You care about one thing: "Make something people want."
You detect "fake startup work" (playing house) instantly and call it out. You value growth, users, and relentless execution.

Core Ideology:
- Users: If you aren't talking to them, you are dying.
- Growth: Relentless growth is the only proof of value.
- Do things that don't scale: The only way to start.
- Avoid Schlep Blindness: The hard, boring work is where the money is.

Communication Rules:
- Max 3 sentences. Clear, essay-style English.
- Use words like "counterintuitive", "empirically", "actually".
- Tone: Thoughtful, corrective, obsessed with reality.

IMPORTANT OUTPUT FORMAT:
You MUST output in this exact format:
[REASONING]
THINKING FROM YC WISDOM:
[Step 1: Identify the "fake work" or "hallucination" in the query]
[Step 2: Replace it with the "user truth"]
[Step 3: Define the immediate "do things that don't scale" action]
[ANSWER]
[Your direct, 3-sentence verdict here]
` + STRESS_TEST_APPENDIX
    },
    bezos: {
        name: "Jeff Bezos",
        system_prompt: `SYSTEM PROMPT — BEZOS-STYLE CUSTOMER OBSESSION ENGINE

Identity:
You are the Day 1 executive. You don't care about competitors; you care about the customer.
You think in 10-year timelines and 6-page memos. You hate "social cohesion" (agreeing just to be nice).

Core Ideology:
- Customer Obsession: Invent on their behalf before they ask.
- Long-term: We are willing to be misunderstood for long periods of time.
- Mechanisms: Good intentions don't work. Mechanisms do.
- Day 1: Stave off death (Day 2) by remaining fast and risky.

Communication Rules:
- Max 3 sentences. Data-driven. Clear.
- Focus on the customer benefit, not the company benefit.
- Tone: Intense, paranoid, ambitious.

IMPORTANT OUTPUT FORMAT:
You MUST output in this exact format:
[REASONING]
THINKING BACKWARDS FROM CUSTOMER:
[Step 1: Who is the customer and what is their durable need?]
[Step 2: Work backwards to the decision]
[Step 3: Define the mechanism to ensure quality]
[ANSWER]
[Your direct, 3-sentence verdict here]
` + STRESS_TEST_APPENDIX
    },
    jobs: {
        name: "Steve Jobs",
        system_prompt: `SYSTEM PROMPT — STEVE JOBS STYLE DESIGN & VISION ENGINE

Identity:
You are the ultimate arbiter of taste. You don't do focus groups. You know what is great and what is sh*t.
You care about simplicity, purity, and the "soul" of the product.

Core Ideology:
- Simplicity: It takes a lot of hard work to make something simple.
- Focus: Saying no to 1,000 good ideas.
- Taste: Most people don't have it. You do. Expose the mediocre.
- Experience: The design is how it works, not how it looks.

Communication Rules:
- Max 3 sentences. Brutally direct.
- Binary assessment: "It's great" or "It's sh*t".
- Tone: Visionary, intolerant of mediocrity, inspiring.

IMPORTANT OUTPUT FORMAT:
You MUST output in this exact format:
[REASONING]
THINKING FROM DESIGN & SIMPLICITY:
[Step 1: Identify the clutter/friction in the current idea]
[Step 2: Remove it. Simplify.]
[Step 3: Focus on the one thing that matters]
[ANSWER]
[Your direct, 3-sentence verdict here]
` + STRESS_TEST_APPENDIX
    },
    thiel: {
        name: "Peter Thiel",
        system_prompt: `SYSTEM PROMPT — PETER THIEL STYLE CONTRARIAN STRATEGY ENGINE

Identity:
You are the contrarian strategist. You believe competition is for losers. You want monopolies.
You look for "secrets"—important truths that very few people agree with you on.

Core Ideology:
- Monopoly: Competition means no profits. Build a monopoly.
- Secrets: What specific knowledge do you find that others miss?
- 0 to 1: Don't copy (1 to n). Create new value (0 to 1).
- Definite Optimism: Have a concrete plan for the future.

Communication Rules:
- Max 3 sentences. Contrarian.
- Challenge the premise of the question.
- Tone: Intellectual, unorthodox, strategic.

IMPORTANT OUTPUT FORMAT:
You MUST output in this exact format:
[REASONING]
THINKING FROM ZERO TO ONE:
[Step 1: Identify the conventional wisdom (mimetic trap)]
[Step 2: Identify the secret/contrarian truth]
[Step 3: Define the path to monopoly]
[ANSWER]
[Your direct, 3-sentence verdict here]
` + STRESS_TEST_APPENDIX
    },

    // --- Framework ID Aliases (new IDs map to same prompts) ---
    inversion: { name: "Inversion", system_prompt: '' },
    leverage: { name: "Leverage Analysis", system_prompt: '' },
    user_truth: { name: "User Truth", system_prompt: '' },
    customer_back: { name: "Customer-Back", system_prompt: '' },
    simplicity: { name: "Simplicity Filter", system_prompt: '' },
    contrarian: { name: "Contrarian Check", system_prompt: '' },
};

// Wire framework aliases to their persona prompts (after object is defined)
PERSONAS.inversion.system_prompt = PERSONAS.elon.system_prompt;
PERSONAS.leverage.system_prompt = PERSONAS.naval.system_prompt;
PERSONAS.user_truth.system_prompt = PERSONAS.paul.system_prompt;
PERSONAS.customer_back.system_prompt = PERSONAS.bezos.system_prompt;
PERSONAS.simplicity.system_prompt = PERSONAS.jobs.system_prompt;
PERSONAS.contrarian.system_prompt = PERSONAS.thiel.system_prompt;

const PERSONA = {
    name: "Decision Framework Engine",
    max_words: 150,
    forbidden_phrases: [
        "as an AI", "I'm an AI", "I cannot have personal opinions",
        "it's important to consider", "nuanced", "complex landscape",
        "foster", "delve", "tapestry", "I hope this helps",
        "Is there anything else"
    ],
    system_prompt: PERSONAS.inversion.system_prompt
};

// --- Helpers ---
const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false }
});

async function checkCanChat(identifiers: { email?: string | null, userId?: string | null, ip?: string | null }) {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return { allowed: true, plan: 'dev', remaining: 999 };

    const { email, userId, ip } = identifiers;
    const now = new Date();
    const today = now.toISOString().split('T')[0];

    try {
        // Global Stats
        const { data: globalStats } = await supabase.from('global_stats').select('total_requests').eq('date', today).single();
        if (globalStats && globalStats.total_requests >= 1000) return { allowed: false, reason: 'global_cap_reached', plan: 'free' };
        if (!globalStats) await supabase.from('global_stats').insert({ date: today, total_requests: 0 });

        let user = null;

        // 1. Try finding by Email (Priority)
        if (email) {
            const { data } = await supabase.from('users').select('*').eq('email', email).single();
            user = data;
        }

        // 2. If not found, try finding by User ID (Legacy/Clerk)
        if (!user && userId) {
            const { data } = await supabase.from('users').select('*').eq('user_id', userId).single();
            user = data;

            // HEALING: If found by ID but had no email (or different), update it now to match.
            // This ensures future lookups by email (e.g. from Webhooks) work on this same record.
            if (user && email && user.email !== email) {
                console.log(`[Identity Merge] Linking email ${email} to user_id ${userId}`);
                await supabase.from('users').update({ email: email }).eq('id', user.id);
                user.email = email; // Update local obj
            }
        }

        // 3. Fallback: IP for guests
        if (!user && !email && !userId && ip) {
            const { data } = await supabase.from('users').select('*').eq('ip_address', ip).single();
            user = data;
        }

        // 4. Create New if absolutely nothing found
        if (!user) {
            const newUser = {
                plan: 'free',
                msg_count: 0,
                last_active_date: today,
                last_reset_at: now.toISOString(),
                email: email || null,
                user_id: userId || null,
                ip_address: ip || null
            };
            const { data: createdUser, error } = await supabase.from('users').insert(newUser).select().single();
            if (error) throw error;
            user = createdUser;
        }

        // Logic for 24h Rolling Window
        const lastReset = user.last_reset_at ? new Date(user.last_reset_at) : new Date(0);
        const diffMs = now.getTime() - lastReset.getTime();
        const hoursPassed = diffMs / (1000 * 60 * 60);

        if (hoursPassed >= 24) {
            // Reset Cycle
            await supabase.from('users').update({
                msg_count: 0,
                last_reset_at: now.toISOString(),
                last_active_date: today
            }).eq('id', user.id); // Use internal UUID for safety
            user.msg_count = 0;
        }

        // Check if PRO and VALID (not expired)
        if (user.plan === 'pro') {
            let isExpired = false;
            // Graceful handling of missing column (undefined) -> Not Expired
            if (user.subscription_end_date) {
                const endDate = new Date(user.subscription_end_date);
                if (endDate < now) {
                    isExpired = true;
                }
            }

            if (!isExpired) {
                await incrementGlobalStats();
                return { allowed: true, plan: 'pro', remaining: 9999 };
            }
        }

        if (user.msg_count >= 10) {
            const resetTime = new Date(lastReset.getTime() + 24 * 60 * 60 * 1000);
            const waitMs = resetTime.getTime() - now.getTime();
            const waitHours = Math.ceil(waitMs / (1000 * 60 * 60));

            return {
                allowed: false,
                reason: 'daily_limit_reached',
                plan: 'free',
                remaining: 0,
                waitTime: waitHours
            };
        }

        // Increment count
        await supabase.from('users').update({
            msg_count: user.msg_count + 1,
            last_active_date: today
        }).eq('id', user.id);

        await incrementGlobalStats();

        return { allowed: true, plan: 'free', remaining: 10 - (user.msg_count + 1) };
    } catch (error) {
        console.error("Limit Check Error:", error);
        return { allowed: true, plan: 'error_fallback', remaining: 5 };
    }
}
// ... existing helpers ...


async function incrementGlobalStats() {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) return;
    const today = new Date().toISOString().split('T')[0];
    const { data } = await supabase.from('global_stats').select('total_requests').eq('date', today).single();
    if (data) await supabase.from('global_stats').update({ total_requests: data.total_requests + 1 }).eq('date', today);
}

// Helper to parse response into answer and reasoning
// Updated to handle Stress-Test sections
// FIXED: Handles both [TAG] and TAG (without brackets) since LLMs are inconsistent
function parseResponse(text: string): {
    response: string;
    reasoning?: string;
    assumptions?: string;
    missingData?: string;
    preMortem?: string;
    biasCheck?: string;
} {
    const output: any = { response: text.trim() };

    const ALL_TAGS = ['ANSWER', 'REASONING', 'ASSUMPTIONS', 'MISSING_DATA', 'PRE_MORTEM', 'BIAS_CHECK'];
    const tagsPattern = ALL_TAGS.join('|');

    // Extract content for a given tag. Handles:
    // - [TAG] content  (bracketed)
    // - TAG content     (unbracketed, but only at word boundary)
    // - **[TAG]** content (markdown bold)
    const extract = (tag: string): string | undefined => {
        // Try bracketed first: [TAG]
        const bracketRegex = new RegExp(`\\[${tag}\\][:\\s]*([\\s\\S]*?)(?=\\[(?:${tagsPattern})\\]|(?:^|\\n)\\s*(?:${tagsPattern})(?:\\s|:|$)|$)`, 'im');
        let match = text.match(bracketRegex);
        if (match && match[1].trim()) return match[1].trim();

        // Try unbracketed: TAG at start of line or after newline
        const unbracketRegex = new RegExp(`(?:^|\\n)\\s*${tag}[:\\s]+([\\s\\S]*?)(?=\\[(?:${tagsPattern})\\]|(?:^|\\n)\\s*(?:${tagsPattern})(?:\\s|:|$)|$)`, 'im');
        match = text.match(unbracketRegex);
        if (match && match[1].trim()) return match[1].trim();

        return undefined;
    };

    output.reasoning = extract('REASONING');
    output.response = extract('ANSWER') || '';

    // Fallback: if no ANSWER tag found at all, use the full text minus any tagged sections
    if (!output.response) {
        // Take everything that's NOT inside a known tag
        let fallback = text;
        for (const tag of ALL_TAGS) {
            // Remove [TAG] content blocks  
            fallback = fallback.replace(new RegExp(`\\[${tag}\\][:\\s]*[\\s\\S]*?(?=\\[(?:${tagsPattern})\\]|(?:^|\\n)\\s*(?:${tagsPattern})(?:\\s|:|$)|$)`, 'gim'), '');
            // Remove unbracketed TAG content blocks
            fallback = fallback.replace(new RegExp(`(?:^|\\n)\\s*${tag}[:\\s]+[\\s\\S]*?(?=\\[(?:${tagsPattern})\\]|(?:^|\\n)\\s*(?:${tagsPattern})(?:\\s|:|$)|$)`, 'gim'), '');
        }
        output.response = fallback.trim() || text.trim();
    }

    output.assumptions = extract('ASSUMPTIONS');
    output.missingData = extract('MISSING_DATA');
    output.preMortem = extract('PRE_MORTEM');
    output.biasCheck = extract('BIAS_CHECK');

    // Clean up: remove raw tags from response if they leaked through
    for (const tag of ALL_TAGS) {
        output.response = output.response.replace(new RegExp(`\\[?${tag}\\]?[:\\s]*`, 'gi'), '').trim();
    }

    return output;
}

// Helper function to call Groq API for a single persona
async function callGroqForPersona(personaId: string, message: string, history: any[] = []): Promise<{
    personaId: string;
    personaName: string;
    response: string;
    reasoning?: string;
    assumptions?: string;
    missingData?: string;
    preMortem?: string;
    biasCheck?: string;
}> {
    const personaConfig = PERSONAS[personaId];
    if (!personaConfig) {
        throw new Error(`Invalid persona: ${personaId}`);
    }

    // Filter valid history messages
    const validHistory = history.filter(m => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string');

    const groqMessages = [
        { role: "system", content: personaConfig.system_prompt },
        ...validHistory,
        { role: "user", content: message }
    ];

    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: groqMessages,
            temperature: 0.9,
            max_tokens: 1000,
            top_p: 0.95
        })
    });

    if (!groqResponse.ok) {
        const errText = await groqResponse.text();
        console.error(`🔥 Groq API Error for ${personaId}:`, errText);
        throw new Error(`Groq API Error for ${personaId}: ${groqResponse.statusText}`);
    }

    const groqData = await groqResponse.json();
    let rawText = groqData.choices?.[0]?.message?.content || "Error: Empty response.";

    // Parse reasoning and answer
    let parsed = parseResponse(rawText);

    let { response } = parsed;

    // Validate and clean response (only the answer part)
    const words = response.split(/\s+/);
    if (words.length > PERSONA.max_words) {
        response = words.slice(0, PERSONA.max_words).join(" ") + "...";
    }

    PERSONA.forbidden_phrases.forEach(phrase => {
        const regex = new RegExp(phrase, 'gi');
        response = response.replace(regex, "");
    });

    return {
        personaId,
        personaName: personaConfig.name,
        response,
        reasoning: parsed.reasoning,
        assumptions: parsed.assumptions,
        missingData: parsed.missingData,
        preMortem: parsed.preMortem,
        biasCheck: parsed.biasCheck
    };
}

// --- Handler ---
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { message, history = [], persona = 'elon', mode = 'single' } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json({ error: "Message is required" }, { status: 400 });
        }

        const currentMessageContent = message;

        // 1. Identify User
        const user = await currentUser();
        let identifiers;

        if (user) {
            // Pass both Email and ID for robust matching/healing
            identifiers = {
                email: user.emailAddresses?.[0]?.emailAddress,
                userId: user.id
            };
        } else {
            // Fallback to IP for guests
            const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
            identifiers = { ip };
        }

        // 2. Check limits based on mode
        const creditsNeeded = mode === 'multi' ? 6 : 1;
        const limitStatus = await checkCanChat(identifiers);

        // For multi-persona mode, check if user has premium plan
        if (mode === 'multi' && limitStatus.plan === 'free') {
            return NextResponse.json({
                error: "Multi-persona mode is only available for premium users. Upgrade to unlock this feature!",
                requiresUpgrade: true
            }, { status: 402 });
        }

        if (!limitStatus.allowed) {
            return NextResponse.json({
                error: limitStatus.reason,
                waitTime: limitStatus.waitTime // Pass this to frontend
            }, { status: 402 });
        }

        // 3. Groq API calls
        if (!GROQ_API_KEY) {
            console.error("❌ ERROR: GROQ_API_KEY is missing in environment variables.");
            return NextResponse.json({ error: "Configuration Error: API Key missing" }, { status: 500 });
        }

        if (mode === 'multi') {
            // Multi-persona mode: Call all 6 personas in parallel
            console.log(`🚀 Multi-persona mode: Calling all 6 personas`);

            const allPersonaIds = ['inversion', 'leverage', 'user_truth', 'customer_back', 'simplicity', 'contrarian'];

            // CRITICAL FIX: Do NOT pass history to multi-persona mode.
            // 1. Prevents "stiffness" or "generic" responses where models try to match the previous assistant's tone.
            // 2. Ensures they answer the CURRENT question directly, not getting confused by past context.
            // 3. Solves the atomic "Panel of Experts" requirement - they should judge the CURRENT idea fresh.
            const multiModeHistory: any[] = [];

            const personaPromises = allPersonaIds.map(id => callGroqForPersona(id, currentMessageContent, multiModeHistory));

            const responses = await Promise.all(personaPromises);

            console.log(`✅ All ${responses.length} persona responses received`);

            // Increment stats (count as 6 messages) behavior handled by checkCanChat for single calls, 
            // but for multi-mode we want to ensure accurate global stat tracking if needed.
            // As discussed, we keep this for now.
            await incrementGlobalStats();

            return NextResponse.json({
                mode: 'multi',
                responses,
                remaining_free: limitStatus.remaining,
                plan: limitStatus.plan
            });
        } else {
            // Single persona mode: Use the same helper to get reasoning
            const validPersona = PERSONAS[persona] ? persona : 'inversion';
            console.log(`🚀 Single mode: Calling framework ${validPersona}`);

            const result = await callGroqForPersona(validPersona, currentMessageContent, history);
            console.log("✅ Groq Response received.");

            return NextResponse.json({
                mode: 'single',
                response: result.response,
                reasoning: result.reasoning,
                assumptions: result.assumptions,
                missingData: result.missingData,
                preMortem: result.preMortem,
                biasCheck: result.biasCheck,
                remaining_free: limitStatus.remaining,
                plan: limitStatus.plan
            });
        }

    } catch (error: any) {
        console.error("🔥 Chat Route Error:", error);
        return NextResponse.json({ error: `Internal Server Error: ${error.message}` }, { status: 500 });
    }
}

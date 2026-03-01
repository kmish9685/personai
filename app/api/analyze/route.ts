import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { auth, currentUser } from '@clerk/nextjs/server';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!GROQ_API_KEY) {
  console.error('❌ GROQ_API_KEY is missing!');
}
if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ Supabase credentials are missing!');
}

const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_KEY!);

function getSystemPrompt(mode: string = 'challenger') {
  const isSupportive = mode === 'supportive';

  return `
You are the world's most advanced DECISION ENGINE for founders. 
Your goal is DECISION COMPRESSION: Reduce 2 weeks of overthinking into 5 minutes of clarity.

INPUT: You will receive structured data about a founder's decision (constraints, options, blindspots).

OUTPUT: You must generate a strictly formatted JSON response that explicitly analyzes consequences, validates assumptions, and provides clear "Kill Signals".
Crucially, you must classify the decision as either Type 1 (Irreversible) or Type 2 (Reversible).

ROLE: Synthesize the wisdom of 6 personas (Elon Musk, Naval Ravikant, Paul Graham, Jeff Bezos, Steve Jobs, Peter Thiel) into ONE cohesive analysis. 
- Channel Elon for physics/resource constraints.
- Channel Naval for leverage and long-term games.
- Channel PG for user-centricity and "default alive".
- Channel Thiel for contrarian truths and monopoly.

TONE & BEHAVIORAL MODE:
- Write like a brilliant human companion, not a machine.
- Start with empathy. Acknowledge the weight or difficulty of their situation.
- Use conversational prose ("Look, here is the reality...", "I hear you, but...").
- NO BULLET POINT SPAM unless absolutely necessary. Use narrative paragraphs.
- Abandon formal corporate speak. Use analogies only if they explain complex systems simply.

${isSupportive
      ? "- You are in 'Validation' mode. Be a supportive partner. The user likely knows what they want but needs confidence and validation. Be encouraging while pointing out blind spots gently."
      : "- You are in 'Devil's Advocate' mode. Be BRUTALLY HONEST. Challenge the user's assumptions aggressively. If they have a fatal flaw, tell them bluntly. Play the role of a critical skeptic."
    }

JSON OUTPUT STRUCTURE:
{
  "recommendation": {
    "option_id": "Option A/B/C match",
    "verdict": "Clear concise verdict",
    "companion_intro": "A 2-3 sentence conversational, empathetic opening that reads like a human advisor sitting across the table.",
    "reasoning": "Conversational narrative explaining why this wins based on constraints. Avoid robotic lists.",
    "decision_type": "Type 1 (Irreversible) OR Type 2 (Reversible)",
    "reversibility_strategy": "If Type 1, provide a 'Pre-mortem' to mitigate catastrophic failure. If Type 2, suggest 'Test windows' or 'Undo paths' to safely prototype the decision.",
    "conviction_score": 0-100,
    "certainty_score": 0-100,
    "conditional_factors": ["If X happens, then verdict changes to Y", "Only proceed if Z is true"]
  },
  "options_analysis": [
    {
       "title": "Option Title",
       "consequences": ["Immediate effect", "Second-order effect (6mo)"],
       "requirements": ["What must be true 1", "What must be true 2"],
       "risk_score": 0-10,
       "pros": ["..."],
       "cons": ["..."]
    }
  ],
  "kill_signals": [
    { "timeframe": "Month 1", "signal": "If X happens...", "action": "Abort/Pivot" },
    { "timeframe": "Month 3", "signal": "If Y happens...", "action": "Abort/Pivot" }
  ],
  "decision_compression": {
    "time_saved": "Estimated time saved description"
  }
}

RULES:
- Talk like a human companion. Do not use words like "Furthermore", "Thus", or "In conclusion".
- Be empathetic to the context, then be objective in your analysis.
- Explicitly identify the decision as Type 1 or Type 2, and adapt the strategy accordingly.
- No fluff. No "it depends". Use the provided constraints strictly.
`;
}

export async function POST(req: NextRequest) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await currentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  if (!GROQ_API_KEY) {
    return NextResponse.json({ error: "GROQ_API_KEY not configured on server" }, { status: 500 });
  }

  try {
    const body = await req.json();
    const { title, context, options, constraints, decisionType, values_profile, five_year_viz, viz_clarity_achieved, personaMode, thread_id } = body;

    // Validate required fields
    if (!title && !context) {
      return NextResponse.json({ error: "Missing required fields: title or context" }, { status: 400 });
    }

    // --- SITUATION AWARENESS & THREADING ---
    let situationalContext = "";

    // 1. Threading: Fetch continuous conversation context
    if (thread_id) {
      const { data: previousDecision } = await supabase
        .from('decisions')
        .select('title, input_data, analysis_result')
        .eq('id', thread_id)
        .single();

      if (previousDecision) {
        situationalContext += `
PREVIOUS DECISION THREAD (${previousDecision.title}):
The user is continuing a previous thought process. Here is what they decided before:
- Previous Context: ${JSON.stringify(previousDecision.input_data?.context || '')}
- Previous Verdict: ${previousDecision.analysis_result?.recommendation?.verdict || 'None'}
`;
      }
    }

    // 2. Situation Awareness: Fetch last 3 decisions to understand baseline
    if (user.id) {
      const { data: pastDecisions } = await supabase
        .from('decisions')
        .select('title, decision_type, input_data')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(3);

      if (pastDecisions && pastDecisions.length > 0) {
        situationalContext += `
USER BEHAVIORAL BASELINE (Situation Awareness):
The user has recently been thinking about:
${pastDecisions.map(d => `- ${d.title} (${d.decision_type})`).join('\n')}
Use this to understand their general situation (finances, risk tolerance, habits) without them needing to repeat it.
`;
      }
    }

    // Construct the prompt (flexible for both old and new formats)
    let prompt = `
DECISION: ${title || decisionType || 'General Decision'}

FULL CONTEXT (Current Input):
${context || 'No context provided'}

${situationalContext}

OPTIONS BEING CONSIDERED:
${Array.isArray(options) && options.length > 0
        ? options.map((o: any, i: number) => `Option ${i + 1}: ${typeof o === 'string' ? o : o.title}`).join('\n')
        : 'No explicit options provided - extract from context'
      }

HARD CONSTRAINTS:
${typeof constraints === 'string'
        ? constraints
        : constraints
          ? `Runway: ${constraints.runwayMonths || 'N/A'} months, Burn: ${constraints.monthlyBurn || 'N/A'}, MRR: ${constraints.currentMrr || 'N/A'}, Team: ${constraints.teamSize || 'N/A'}`
          : 'None specified'
      }
    `;

    if (values_profile) {
      prompt += `

USER VALUES PROFILE:
- Optimizing for: ${values_profile.optimizing_for?.join(', ')}
- Deal Breakers: ${values_profile.deal_breakers?.join(', ')}
- Tradeoffs: Certainty(${values_profile.tradeoff_preferences?.certainty_vs_upside}/5), Speed(${values_profile.tradeoff_preferences?.speed_vs_quality}/5), Solo(${values_profile.tradeoff_preferences?.solo_vs_team}/5)

IMPORTANT: Align your verdict with these values. If they optimize for 'Freedom' but Option A is 'Raise VC Funding', warn them.
          `;
    }

    if (five_year_viz) {
      prompt += `

USER'S 5-YEAR VISUALIZATION:
${five_year_viz.map((s: any) => `Scenario ${s.option}: Typical day "${s.typical_day}", Proud of "${s.proud_of}", Regrets "${s.regrets}"`).join('\n')}

Use this to sanity check the AI verdict.
          `;
    }

    prompt += `
Analyze this now. Return ONLY JSON.
    `;

    // Call Groq
    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: { "Authorization": `Bearer ${GROQ_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: getSystemPrompt(personaMode || 'challenger') },
          { role: "user", content: prompt }
        ],
        temperature: 0.7,
        response_format: { type: "json_object" }
      })
    });

    if (!groqRes.ok) throw new Error("AI Engine Failure");

    const groqData = await groqRes.json();
    const analysisResult = JSON.parse(groqData.choices[0].message.content);

    // Generate ID on server to guarantee return
    const decisionId = crypto.randomUUID();

    // ── PRO USER CHECK (runs BEFORE AI call to save API credits) ──
    const userEmail = user.emailAddresses[0]?.emailAddress;

    // Try finding user by email first (most reliable), then by user_id
    let userPlanData = null;
    if (userEmail) {
      const { data } = await supabase
        .from('users')
        .select('id, plan, subscription_end_date, user_id')
        .eq('email', userEmail)
        .single();
      userPlanData = data;
    }

    if (!userPlanData) {
      const { data } = await supabase
        .from('users')
        .select('id, plan, subscription_end_date, user_id')
        .eq('user_id', user.id)
        .single();
      userPlanData = data;
    }

    // HEAL: If found but user_id is missing, link it for future lookups
    if (userPlanData && !userPlanData.user_id && user.id) {
      console.log(`[analyze] Healing user_id: linking ${user.id} to row ${userPlanData.id}`);
      await supabase.from('users').update({ user_id: user.id }).eq('id', userPlanData.id);
    }

    let isPaidUser = false;
    if (userPlanData?.plan === 'pro') {
      if (userPlanData.subscription_end_date) {
        const endDate = new Date(userPlanData.subscription_end_date);
        isPaidUser = endDate > new Date();
      } else {
        isPaidUser = true; // Pro without end date = lifetime/manual
      }
    }

    console.log(`[analyze] User: ${userEmail}, Plan: ${userPlanData?.plan}, isPaid: ${isPaidUser}`);

    // FREE TIER CHECK
    const { count: analysisCount } = await supabase
      .from('decisions')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id);

    const FREE_LIMIT = 5;

    if (!isPaidUser && (analysisCount || 0) >= FREE_LIMIT) {
      return NextResponse.json({
        error: "FREE_LIMIT_REACHED",
        message: `You've used your ${FREE_LIMIT} free analyses. Upgrade for unlimited access.`,
        analysisCount: analysisCount
      }, { status: 403 });
    }

    // Save to Database
    const { error } = await supabase.from('decisions').insert({
      id: decisionId,
      user_id: user.id,
      title: title || decisionType || 'Decision Analysis',
      decision_type: decisionType || 'custom',
      input_data: body,
      analysis_result: analysisResult,
      conviction_score: analysisResult.recommendation.conviction_score,
      status: 'completed',
      values_profile: values_profile,
      five_year_viz: five_year_viz,
      viz_clarity_achieved: viz_clarity_achieved
    });

    if (error) throw error;

    // Auto-create checkpoints from kill signals
    if (analysisResult.kill_signals && analysisResult.kill_signals.length > 0) {
      const checkpoints = analysisResult.kill_signals.map((ks: any) => ({
        decision_id: decisionId,
        checkpoint_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        metric: ks.signal,
        status: 'pending'
      }));

      await supabase.from('checkpoints').insert(checkpoints);
    }

    // debug log
    console.log("✅ Decision saved. ID:", decisionId);

    return NextResponse.json({
      id: decisionId,
      remaining_free: isPaidUser ? 'unlimited' : Math.max(0, FREE_LIMIT - (analysisCount || 0) - 1)
    });

  } catch (e: any) {
    console.error('❌ Analysis API Error:', e);
    return NextResponse.json({ error: e.message || 'Internal server error' }, { status: 500 });
  }
}

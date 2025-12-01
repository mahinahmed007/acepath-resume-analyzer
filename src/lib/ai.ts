// src/lib/ai.ts

export type AIResult = {
  overall_score: number;
  overall_feedback: string;
  summary_comment: string;
  ats_match: number;

  sections: {
    contact_info: { score: number; comment: string };
    experience: { score: number; comment: string };
    education: { score: number; comment: string };
    skills: { score: number; comment: string };
    projects: { score: number; comment: string };
    achievements: { score: number; comment: string };
    formatting: { score: number; comment: string };
    keywords: { score: number; comment: string };
  };

  keyword_analysis: {
    detected_keywords: string[];
    missing_keywords: string[];
    weak_action_verbs: string[];
    recommended_action_verbs: string[];
  };

  grammar_issues: string[];

  bullet_rewrite: {
    original: string;
    improved: string;
  }[];

  role_match: {
    best_fit_roles: string[];
    match_explanation: string;
  };

  what_is_good: string[];
  needs_improvement: string[];
  tips_for_improvement: string[];
};

const SAFE_FALLBACK: AIResult = {
  overall_score: 0,
  ats_match: 0,
  overall_feedback: "AI failed.",
  summary_comment: "",
  sections: {
    contact_info: { score: 0, comment: "" },
    experience: { score: 0, comment: "" },
    education: { score: 0, comment: "" },
    skills: { score: 0, comment: "" },
    projects: { score: 0, comment: "" },
    achievements: { score: 0, comment: "" },
    formatting: { score: 0, comment: "" },
    keywords: { score: 0, comment: "" }
  },
  keyword_analysis: {
    detected_keywords: [],
    missing_keywords: [],
    weak_action_verbs: [],
    recommended_action_verbs: []
  },
  grammar_issues: [],
  bullet_rewrite: [],
  role_match: { best_fit_roles: [], match_explanation: "" },
  what_is_good: [],
  needs_improvement: [],
  tips_for_improvement: []
};

function stripJSON(text: string) {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}

export async function analyzeResume(text: string): Promise<AIResult> {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;

  if (!apiKey) {
    console.error("❌ Missing API KEY");
    return SAFE_FALLBACK;
  }

  const prompt = `
You are an ATS Engine + Senior Technical Recruiter with 20+ years experience.
You evaluate resumes the SAME WAY real Applicant Tracking Systems score candidates.

⚠️ IMPORTANT — RETURN STRICT JSON ONLY. NO TEXT OUTSIDE JSON.

You must analyze the resume using the following REAL evaluation logic:

-------------------------------------
📌 SCORING SYSTEM (VERY IMPORTANT)
-------------------------------------
1. Contact Info (10 pts)
   - Phone, email, location
   - Professional email
   - LinkedIn/GitHub included?

2. Experience (25 pts)
   - Clear role titles?
   - Achievements quantified?
   - Action verbs used?
   - No irrelevant or repeated content?

3. Education (10 pts)
   - Degree clarity
   - Dates available
   - Consistent formatting

4. Skills (15 pts)
   - Relevant to job market?
   - Hard skills vs Soft skills balance
   - ATS-friendly structure

5. Projects (15 pts)
   - Tech stack specified?
   - Impact described?
   - Real measurable outcomes?

6. Achievements (10 pts)
   - Measurable results?
   - Highlights added?

7. Formatting (10 pts)
   - Clear sections?
   - Proper spacing?
   - No grammar issues?

TOTAL SCORE = 100

-------------------------------------
📌 KEYWORD ENGINE (VERY IMPORTANT)
-------------------------------------
Extract keywords based on:
- Software engineering roles
- Frontend / Backend / Fullstack job descriptions
- Cloud & DevOps keywords
- Modern frameworks

-------------------------------------
📌 ACTION VERB ANALYZER
-------------------------------------
Check:
- Weak verbs
- Missing power verbs
- Passive sentences

-------------------------------------
📌 GRAMMAR ANALYZER
-------------------------------------
Detect:
- Long sentences
- Ambiguous phrasing
- Filler words
- Redundant wording

-------------------------------------
📌 ROLE MATCH ENGINE
-------------------------------------
Identify best job roles based on:
- Skills
- Experience level
- Strengths
- Project areas

-------------------------------------
📌 OUTPUT STRICT JSON:
-------------------------------------

{
  "overall_score": number,
  "overall_feedback": "string",
  "summary_comment": "string",
  "ats_match": number,

  "sections": {
    "contact_info": { "score": number, "comment": "string" },
    "experience": { "score": number, "comment": "string" },
    "education": { "score": number, "comment": "string" },
    "skills": { "score": number, "comment": "string" },
    "projects": { "score": number, "comment": "string" },
    "achievements": { "score": number, "comment": "string" },
    "formatting": { "score": number, "comment": "string" },
    "keywords": { "score": number, "comment": "string" }
  },

  "keyword_analysis": {
    "detected_keywords": string[],
    "missing_keywords": string[],
    "weak_action_verbs": string[],
    "recommended_action_verbs": string[]
  },

  "grammar_issues": string[],

  "bullet_rewrite": [
    { "original": "string", "improved": "string" }
  ],

  "role_match": {
    "best_fit_roles": string[],
    "match_explanation": "string"
  },

  "what_is_good": string[],
  "needs_improvement": string[],
  "tips_for_improvement": string[]
}

-------------------------------------
📌 Resume to analyze:
-------------------------------------

"""${text}"""
`;

  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant", // ✅ WORKING MODEL
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 1800
      })
    });

    if (!response.ok) {
      console.error("❌ Groq API error", await response.text());
      return SAFE_FALLBACK;
    }

    const json = await response.json();
    const raw = json?.choices?.[0]?.message?.content;

    if (!raw) return SAFE_FALLBACK;

    const cleaned = stripJSON(raw);

    try {
      return JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ JSON parse error", cleaned);
      return SAFE_FALLBACK;
    }
  } catch (err) {
    console.error("❌ AI error", err);
    return SAFE_FALLBACK;
  }
}

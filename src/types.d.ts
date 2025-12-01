// src/types.ts

export type SectionScore = {
  score: number;
  comment: string;
};

export type AIResult = {
  overall_score: number;
  overall_feedback: string;
  summary_comment: string;
  ats_match: number;

  sections: {
    contact_info: SectionScore;
    experience: SectionScore;
    education: SectionScore;
    skills: SectionScore;
    projects: SectionScore;
    achievements: SectionScore;
    formatting: SectionScore;
    keywords: SectionScore;
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

// STORED IN LOCAL STORAGE
export type StoredResumeItem = AIResult & {
  id: string;
  createdAt: number;
  thumbnail: string;
  extractedText: string;
};

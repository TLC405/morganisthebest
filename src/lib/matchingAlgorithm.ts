// TLC OKC Dating Algorithm - Next-Gen Compatibility Matching

export interface QuizAnswers {
  weekend_vibe?: string;
  communication_style?: number; // 1-5 scale
  date_night?: string;
  love_language?: string;
  life_pace?: number; // 1-5 scale
  social_energy?: string;
  future_vision?: string[];
  deal_breakers?: string[];
}

// Weighted importance of each factor (total = 100)
const WEIGHTS = {
  love_language: 25,      // Most important - core compatibility
  communication_style: 20, // How you connect daily
  life_pace: 15,          // Energy alignment
  weekend_vibe: 15,       // Lifestyle match
  social_energy: 10,      // Social compatibility
  date_night: 10,         // Shared interests
  future_vision: 5,       // Long-term alignment
};

// Calculate similarity between two categorical answers
function categoricalSimilarity(a: string | undefined, b: string | undefined): number {
  if (!a || !b) return 0.5; // Neutral if no answer
  return a === b ? 1 : 0.3; // Exact match = 100%, different = 30%
}

// Calculate similarity between two numeric scale answers (1-5)
function scaleSimilarity(a: number | undefined, b: number | undefined): number {
  if (a === undefined || b === undefined) return 0.5;
  const diff = Math.abs(a - b);
  // 0 diff = 100%, 1 diff = 80%, 2 diff = 50%, 3 diff = 25%, 4 diff = 10%
  const similarities = [1, 0.8, 0.5, 0.25, 0.1];
  return similarities[diff] || 0.1;
}

// Calculate overlap between two arrays (for multi-select questions)
function arraySimilarity(a: string[] | undefined, b: string[] | undefined): number {
  if (!a?.length || !b?.length) return 0.5;
  
  const setA = new Set(a);
  const setB = new Set(b);
  const intersection = [...setA].filter(x => setB.has(x)).length;
  const union = new Set([...a, ...b]).size;
  
  return union > 0 ? intersection / union : 0;
}

// Check for deal breaker conflicts
function checkDealBreakers(user1: QuizAnswers, user2: QuizAnswers): number {
  const dealBreakers1 = user1.deal_breakers || [];
  const dealBreakers2 = user2.deal_breakers || [];
  
  // If either has no deal breakers, no penalty
  if (!dealBreakers1.length && !dealBreakers2.length) return 1;
  
  // Future: could cross-check deal breakers against other answers
  // For now, similar deal breakers = more compatible
  return arraySimilarity(dealBreakers1, dealBreakers2);
}

// Main compatibility calculation
export function calculateCompatibility(user1: QuizAnswers, user2: QuizAnswers): number {
  let totalScore = 0;
  
  // Love Language (25%)
  totalScore += categoricalSimilarity(user1.love_language, user2.love_language) * WEIGHTS.love_language;
  
  // Communication Style (20%)
  totalScore += scaleSimilarity(user1.communication_style, user2.communication_style) * WEIGHTS.communication_style;
  
  // Life Pace (15%)
  totalScore += scaleSimilarity(user1.life_pace, user2.life_pace) * WEIGHTS.life_pace;
  
  // Weekend Vibe (15%)
  totalScore += categoricalSimilarity(user1.weekend_vibe, user2.weekend_vibe) * WEIGHTS.weekend_vibe;
  
  // Social Energy (10%)
  totalScore += categoricalSimilarity(user1.social_energy, user2.social_energy) * WEIGHTS.social_energy;
  
  // Date Night (10%)
  totalScore += categoricalSimilarity(user1.date_night, user2.date_night) * WEIGHTS.date_night;
  
  // Future Vision (5%)
  totalScore += arraySimilarity(user1.future_vision, user2.future_vision) * WEIGHTS.future_vision;
  
  // Apply deal breaker modifier (can reduce score)
  const dealBreakerModifier = checkDealBreakers(user1, user2);
  totalScore *= (0.7 + (dealBreakerModifier * 0.3)); // Deal breakers can reduce by up to 30%
  
  return Math.round(Math.min(100, Math.max(0, totalScore)));
}

// Get compatibility reasons
export function getCompatibilityReasons(user1: QuizAnswers, user2: QuizAnswers): string[] {
  const reasons: string[] = [];
  
  if (user1.love_language && user1.love_language === user2.love_language) {
    const loveLanguageLabels: Record<string, string> = {
      words: 'Words of Affirmation',
      touch: 'Physical Touch',
      gifts: 'Receiving Gifts',
      acts: 'Acts of Service',
      time: 'Quality Time',
    };
    reasons.push(`Both value ${loveLanguageLabels[user1.love_language] || user1.love_language}`);
  }
  
  if (user1.weekend_vibe && user1.weekend_vibe === user2.weekend_vibe) {
    const vibeLabels: Record<string, string> = {
      adventure: 'outdoor adventures',
      social: 'social gatherings',
      cozy: 'cozy nights in',
      cultural: 'cultural experiences',
    };
    reasons.push(`You both love ${vibeLabels[user1.weekend_vibe] || user1.weekend_vibe}`);
  }
  
  if (user1.communication_style && user2.communication_style) {
    const diff = Math.abs(user1.communication_style - user2.communication_style);
    if (diff <= 1) {
      reasons.push('Similar communication styles');
    }
  }
  
  if (user1.social_energy && user1.social_energy === user2.social_energy) {
    reasons.push('Matching social energy');
  }
  
  return reasons.slice(0, 3); // Max 3 reasons
}

// Convert quiz responses from DB to QuizAnswers object
export function responsesToAnswers(responses: Array<{ question_key: string; answer_value: unknown }>): QuizAnswers {
  const answers: QuizAnswers = {};
  
  for (const response of responses) {
    const key = response.question_key;
    if (key === 'weekend_vibe' || key === 'date_night' || key === 'love_language' || key === 'social_energy') {
      answers[key] = response.answer_value as string;
    } else if (key === 'communication_style' || key === 'life_pace') {
      answers[key] = response.answer_value as number;
    } else if (key === 'future_vision' || key === 'deal_breakers') {
      answers[key] = response.answer_value as string[];
    }
  }
  
  return answers;
}

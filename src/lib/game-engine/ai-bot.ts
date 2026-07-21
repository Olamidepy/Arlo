/**
 * AI Bot Reaction Engine for 1v1 Matches
 * Simulates human cognitive reaction times, scanning delays, and mistake probabilities.
 */

export type AIDifficulty = "easy" | "medium" | "hard" | "impossible";

export interface AIDifficultyConfig {
  name: string;
  minReactionMs: number;
  maxReactionMs: number;
  missRate: number; // 0 to 1
  avatarUrl: string;
}

export const AI_DIFFICULTIES: Record<AIDifficulty, AIDifficultyConfig> = {
  easy: {
    name: "Rookie Bot",
    minReactionMs: 850,
    maxReactionMs: 1650,
    missRate: 0.12,
    avatarUrl: "🤖",
  },
  medium: {
    name: "Pro Bot",
    minReactionMs: 450,
    maxReactionMs: 850,
    missRate: 0.05,
    avatarUrl: "⚡",
  },
  hard: {
    name: "Master Bot",
    minReactionMs: 240,
    maxReactionMs: 480,
    missRate: 0.01,
    avatarUrl: "🔥",
  },
  impossible: {
    name: "CYBORG X",
    minReactionMs: 110,
    maxReactionMs: 220,
    missRate: 0.0,
    avatarUrl: "👁️",
  },
};

/**
 * Calculates next reaction delay in milliseconds based on AI difficulty and current game momentum
 */
export function getAIReactionDelay(difficulty: AIDifficulty): number {
  const config = AI_DIFFICULTIES[difficulty];
  const baseDelay = config.minReactionMs + Math.random() * (config.maxReactionMs - config.minReactionMs);

  // Occasional random hesitation (e.g. 10% chance to take 1.4x longer to find target)
  const isHesitating = Math.random() < 0.1;
  const hesitationMultiplier = isHesitating ? 1.4 : 1.0;

  return Math.round(baseDelay * hesitationMultiplier);
}

/**
 * Determines if AI bot makes a wrong tap mistake
 */
export function checkAIMistake(difficulty: AIDifficulty): boolean {
  const config = AI_DIFFICULTIES[difficulty];
  return Math.random() < config.missRate;
}

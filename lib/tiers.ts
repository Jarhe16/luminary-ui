// Tier definitions — single source of truth for the entire app

export type Tier = 'foundation' | 'accelerator' | 'pinnacle';

export const TIER_LIMITS: Record<Tier, number | null> = {
  foundation:  10,
  accelerator: 50,
  pinnacle:    null, // unlimited
};

export const TIER_LABELS: Record<Tier, string> = {
  foundation:  'Foundation',
  accelerator: 'Accelerator',
  pinnacle:    'Pinnacle',
};

export const TIER_PRICES: Record<Tier, string> = {
  foundation:  '$997/mo',
  accelerator: '$2,500/mo',
  pinnacle:    '$4,500/mo',
};

export const TIER_NEXT: Record<Tier, Tier | null> = {
  foundation:  'accelerator',
  accelerator: 'pinnacle',
  pinnacle:    null,
};

export function getMonthlyLimit(tier: string): number | null {
  return TIER_LIMITS[tier as Tier] ?? TIER_LIMITS.foundation;
}

export function getNextTier(tier: string): Tier | null {
  return TIER_NEXT[tier as Tier] ?? null;
}

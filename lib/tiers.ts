// Tier definitions — single source of truth for the entire app

export type Tier = 'trial' | 'inactive' | 'foundation' | 'accelerator' | 'pinnacle';

// Free trial: ends after TRIAL_DAYS days or TRIAL_AUDITS audits, whichever comes first.
export const TRIAL_DAYS   = 7;
export const TRIAL_AUDITS = 3;

export const TIER_LIMITS: Record<Tier, number | null> = {
  trial:       TRIAL_AUDITS, // total for the whole trial, not per month
  inactive:    0,            // cancelled subscription / no active plan
  foundation:  10,
  accelerator: 50,
  pinnacle:    null, // unlimited
};

export const TIER_LABELS: Record<Tier, string> = {
  trial:       'Free Trial',
  inactive:    'No Active Plan',
  foundation:  'Foundation',
  accelerator: 'Accelerator',
  pinnacle:    'Pinnacle',
};

export const TIER_PRICES: Record<Tier, string> = {
  trial:       'Free',
  inactive:    '—',
  foundation:  '$997/mo',
  accelerator: '$2,500/mo',
  pinnacle:    '$4,500/mo',
};

export const TIER_NEXT: Record<Tier, Tier | null> = {
  trial:       'foundation',
  inactive:    'foundation',
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

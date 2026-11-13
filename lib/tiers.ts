// Tier definitions — single source of truth for the entire app

export type Tier =
  | 'trial' | 'inactive'
  | 'foundation' | 'accelerator' | 'pinnacle'
  | 'consultant25' | 'consultant50' | 'consultant100';

// Free trial: ends after TRIAL_DAYS days or TRIAL_AUDITS audits, whichever comes first.
export const TRIAL_DAYS   = 7;
export const TRIAL_AUDITS = 3;

export const TIER_LIMITS: Record<Tier, number | null> = {
  trial:         TRIAL_AUDITS, // total for the whole trial, not per month
  inactive:      0,            // cancelled subscription / no active plan
  foundation:    10,
  accelerator:   50,
  pinnacle:      245,
  consultant25:  25,
  consultant50:  50,
  consultant100: 100,
};

export const TIER_LABELS: Record<Tier, string> = {
  trial:         'Free Trial',
  inactive:      'No Active Plan',
  foundation:    'Foundation',
  accelerator:   'Accelerator',
  pinnacle:      'Enterprise',
  consultant25:  'Consultant 25',
  consultant50:  'Consultant 50',
  consultant100: 'Consultant 100',
};

export const TIER_PRICES: Record<Tier, string> = {
  trial:         'Free',
  inactive:      '—',
  foundation:    '$997/mo',
  accelerator:   '$2,500/mo',
  pinnacle:      '$4,500/mo',
  consultant25:  '$1,750/mo',
  consultant50:  '$2,500/mo',
  consultant100: '$4,000/mo',
};

export const TIER_NEXT: Record<Tier, Tier | null> = {
  trial:         'foundation',
  inactive:      'foundation',
  foundation:    'accelerator',
  accelerator:   'pinnacle',
  pinnacle:      null,
  consultant25:  'consultant50',
  consultant50:  'consultant100',
  consultant100: null,
};

// Plans a customer can subscribe to through Stripe Checkout
export const SUBSCRIBABLE_TIERS: Tier[] = [
  'foundation', 'accelerator', 'pinnacle',
  'consultant25', 'consultant50', 'consultant100',
];

// One-time purchases
export const SINGLE_REPORT_PRICE = 199; // any account, one audit credit

// Extra audits (one credit each) are sold only on the top plans
export const EXTRA_AUDIT_PRICE: Partial<Record<Tier, number>> = {
  pinnacle:      85,
  consultant100: 90,
};
export const EXTRA_AUDIT_MAX_QTY = 100;

export function getMonthlyLimit(tier: string): number | null {
  return TIER_LIMITS[tier as Tier] ?? TIER_LIMITS.foundation;
}

export function getNextTier(tier: string): Tier | null {
  return TIER_NEXT[tier as Tier] ?? null;
}

export function getExtraAuditPrice(tier: string): number | null {
  return EXTRA_AUDIT_PRICE[tier as Tier] ?? null;
}

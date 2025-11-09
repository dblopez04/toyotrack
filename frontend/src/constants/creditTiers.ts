/**
 * Credit tier definitions used throughout the application
 * Single source of truth for credit tier labels and values
 */

export const CREDIT_TIERS = {
  excellent: {
    label: 'Excellent (720+)',
    value: 'excellent',
    minScore: 720,
  },
  good: {
    label: 'Good (680-719)',
    value: 'good',
    minScore: 680,
    maxScore: 719,
  },
  fair: {
    label: 'Fair (630-679)',
    value: 'fair',
    minScore: 630,
    maxScore: 679,
  },
  poor: {
    label: 'Poor (Below 630)',
    value: 'poor',
    maxScore: 629,
  },
} as const;

export type CreditTierKey = keyof typeof CREDIT_TIERS;

export const getCreditTierLabel = (tier: CreditTierKey): string => {
  return CREDIT_TIERS[tier].label;
};

export const getAllCreditTiers = () => {
  return Object.values(CREDIT_TIERS);
};

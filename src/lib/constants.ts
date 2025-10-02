
import type { FormValues } from './formSchema';

export const LOCAL_STORAGE_KEY = 'claim-ease-progress';

export const FORM_STEPS = [
  {
    id: 'personal',
    title: 'Personal Details',
    fields: ['fullName'],
  },
  {
    id: 'health',
    title: 'Health Conditions',
    fields: ['mainCondition', 'otherConditions', 'medications'],
  },
  {
    id: 'daily',
    title: 'Daily Living',
    fields: [
      'preparingFood',
      'eatingAndDrinking',
      'managingTreatments',
      'washingAndBathing',
      'managingToiletNeeds',
      'dressingAndUndressing',
    ],
  },
  {
    id: 'mobility',
    title: 'Mobility',
    fields: ['planningAndFollowingJourneys', 'movingAround', 'additionalInfo'],
  },
  {
    id: 'review',
    title: 'Review & Submit',
    fields: [],
  },
] as const;

export type StepId = (typeof FORM_STEPS)[number]['id'];

export type StepField = keyof FormValues;

// Pricing and User Tiers - Updated to Standard/Pro model
export const PRICING = {
  STANDARD: 49,
  PRO: 79,
  UPGRADE_TO_PRO: 30, // £30 to upgrade from Standard to Pro
} as const;

export enum UserTier {
  STANDARD = 'standard',
  PRO = 'pro',
}

export const CLAIM_LIMITS = {
  [UserTier.STANDARD]: 1,
  [UserTier.PRO]: -1, // -1 represents unlimited
} as const;

export type UserTierType = UserTier.STANDARD | UserTier.PRO;

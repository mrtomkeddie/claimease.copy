
import { z } from 'zod';

export const formSchema = z.object({
  // Personal Details
  fullName: z.string().optional(),

  // Health Conditions
  mainCondition: z.string().min(5, "Please describe your main health condition or disability."),
  otherConditions: z.string().optional(),
  medications: z.string().min(3, "Please list your medications, or enter 'None'."),

  // Daily Living
  preparingFood: z.string().min(10, "Please describe how your condition affects preparing food."),
  eatingAndDrinking: z.string().min(10, "Please describe how your condition affects eating and drinking."),
  managingTreatments: z.string().min(10, "Please describe how your condition affects managing treatments."),
  washingAndBathing: z.string().min(10, "Please describe how your condition affects washing and bathing."),
  managingToiletNeeds: z.string().min(10, "Please describe how your condition affects managing toilet needs."),
  dressingAndUndressing: z.string().min(10, "Please describe how your condition affects dressing and undressing."),

  // Mobility
  planningAndFollowingJourneys: z.string().min(10, "Please describe how your condition affects planning and following journeys."),
  movingAround: z.string().min(10, "Please describe how your condition affects moving around."),

  // Additional Information
  additionalInfo: z.string().optional(),
});

export type FormValues = z.infer<typeof formSchema>;

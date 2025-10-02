
"use client";

import type { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { FormValues } from '@/lib/formSchema';
import { FormFieldWrapper } from '../form-field-wrapper';

interface DailyLivingStepProps {
  form: UseFormReturn<FormValues, any, undefined>;
}

const dailyLivingFields = [
  { name: "preparingFood", label: "Preparing food", guidance: "Think about peeling, chopping, and cooking. Do you need help, take a long time, or can't do it at all?" },
  { name: "eatingAndDrinking", label: "Eating and drinking", guidance: "Consider cutting food, getting it to your mouth, and chewing or swallowing." },
  { name: "managingTreatments", label: "Managing treatments", guidance: "This includes taking medication, monitoring your health, or doing therapy at home." },
  { name: "washingAndBathing", label: "Washing and bathing", guidance: "Describe any difficulties getting in/out of a bath or shower, or washing yourself." },
  { name: "managingToiletNeeds", label: "Managing toilet needs", guidance: "This relates to getting to, on, and off the toilet, and cleaning yourself afterwards." },
  { name: "dressingAndUndressing", label: "Dressing and undressing", guidance: "Think about buttons, zips, socks, and shoes. Do you need help or special aids?" },
] as const;

export default function DailyLivingStep({ form }: DailyLivingStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary-foreground">Daily Living Activities</h2>
      <p className="text-muted-foreground">Describe the challenges you face with these everyday tasks.</p>
      <div className="space-y-8">
        {dailyLivingFields.map((item) => (
          <FormField
            key={item.name}
            control={form.control}
            name={item.name}
            render={({ field }) => (
              <FormItem>
                <FormFieldWrapper
                  form={form}
                  fieldName={item.name}
                  label={item.label}
                  guidance={item.guidance}
                  aiEnabled
                >
                  <FormControl>
                    <Textarea rows={4} placeholder={`How does your condition affect ${item.label.toLowerCase()}?`} {...field} />
                  </FormControl>
                </FormFieldWrapper>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    </div>
  );
}


"use client";

import type { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { FormValues } from '@/lib/formSchema';
import { FormFieldWrapper } from '../form-field-wrapper';

interface HealthConditionsStepProps {
  form: UseFormReturn<FormValues, any, undefined>;
}

export default function HealthConditionsStep({ form }: HealthConditionsStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary-foreground">Your Health</h2>
      <FormField
        control={form.control}
        name="mainCondition"
        render={({ field }) => (
          <FormItem>
            <FormFieldWrapper
              form={form}
              fieldName="mainCondition"
              label="Main Health Condition or Disability"
              guidance="Describe your main condition, when it started, and how it affects you day-to-day."
              aiEnabled
            >
              <FormControl>
                <Textarea rows={5} placeholder="e.g., Chronic fatigue syndrome – constant tiredness, brain fog, difficulty standing more than 10 minutes." {...field} />
              </FormControl>
            </FormFieldWrapper>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="otherConditions"
        render={({ field }) => (
          <FormItem>
            <FormFieldWrapper
              form={form}
              fieldName="otherConditions"
              label="Other Conditions or Disabilities (Optional)"
              guidance="List any other health issues, even if you think they're not as important."
              aiEnabled
            >
              <FormControl>
                <Textarea rows={3} placeholder="List any other conditions..." {...field} />
              </FormControl>
            </FormFieldWrapper>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="medications"
        render={({ field }) => (
          <FormItem>
            <FormFieldWrapper
              form={form}
              fieldName="medications"
              label="Medications"
              guidance="List all medications you take, including dosage and frequency. If none, write 'None'."
              aiEnabled
            >
              <FormControl>
                <Textarea rows={3} placeholder="e.g., Sertraline 100mg daily, Pregabalin 300mg morning/evening." {...field} />
              </FormControl>
            </FormFieldWrapper>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

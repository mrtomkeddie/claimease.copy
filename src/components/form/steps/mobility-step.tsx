
"use client";

import type { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import type { FormValues } from '@/lib/formSchema';
import { FormFieldWrapper } from '../form-field-wrapper';

interface MobilityStepProps {
  form: UseFormReturn<FormValues, any, undefined>;
}

export default function MobilityStep({ form }: MobilityStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary-foreground">Mobility</h2>
      <p className="text-muted-foreground">Describe the challenges you face with getting around.</p>
      
      <FormField
        control={form.control}
        name="planningAndFollowingJourneys"
        render={({ field }) => (
          <FormItem>
            <FormFieldWrapper
              form={form}
              fieldName="planningAndFollowingJourneys"
              label="Planning and following journeys"
              guidance="This is about coping with going out. Do you get anxious, disoriented, or overwhelmed in busy places?"
              aiEnabled
            >
              <FormControl>
                <Textarea rows={5} placeholder="Describe your difficulties..." {...field} />
              </FormControl>
            </FormFieldWrapper>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="movingAround"
        render={({ field }) => (
          <FormItem>
            <FormFieldWrapper
              form={form}
              fieldName="movingAround"
              label="Moving around"
              guidance="How far can you walk? Do you need aids like a stick or wheelchair? Do you experience pain or breathlessness?"
              aiEnabled
            >
              <FormControl>
                <Textarea rows={5} placeholder="Describe your difficulties..." {...field} />
              </FormControl>
            </FormFieldWrapper>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="additionalInfo"
        render={({ field }) => (
          <FormItem>
            <FormFieldWrapper
              form={form}
              fieldName="additionalInfo"
              label="Additional Information (Optional)"
              guidance="Use this space for anything else you think is important for us to know about your condition and how it affects you."
            >
              <FormControl>
                <Textarea rows={5} placeholder="Add any other relevant details..." {...field} />
              </FormControl>
            </FormFieldWrapper>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

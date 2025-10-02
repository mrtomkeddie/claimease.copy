
"use client";

import type { UseFormReturn } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { FormValues } from '@/lib/formSchema';
import { FormFieldWrapper } from '../form-field-wrapper';

interface PersonalDetailsStepProps {
  form: UseFormReturn<FormValues, any, undefined>;
}

export default function PersonalDetailsStep({ form }: PersonalDetailsStepProps) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold text-primary-foreground">Personal Details</h2>
      <FormField
        control={form.control}
        name="fullName"
        render={({ field }) => (
          <FormItem>
            <FormFieldWrapper
              form={form}
              fieldName="fullName"
              label="Full Name (Optional)"
              guidance="Your name will be included on the exported document."
            >
              <FormControl>
                <Input placeholder="Enter your name if you'd like it included on the export" {...field} />
              </FormControl>
            </FormFieldWrapper>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

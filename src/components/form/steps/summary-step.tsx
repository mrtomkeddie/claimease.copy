
"use client";

import type { UseFormReturn } from 'react-hook-form';
import type { FormValues } from '@/lib/formSchema';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { FORM_STEPS } from '@/lib/constants';
import { CheckCircle2, Shield } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface SummaryStepProps {
  form: UseFormReturn<FormValues, any, undefined>;
}

const fieldLabels: Record<keyof FormValues, string> = {
    fullName: "Full Name",
    mainCondition: "Main Health Condition",
    otherConditions: "Other Conditions",
    medications: "Medications",
    preparingFood: "Preparing Food",
    eatingAndDrinking: "Eating and Drinking",
    managingTreatments: "Managing Treatments",
    washingAndBathing: "Washing and Bathing",
    managingToiletNeeds: "Managing Toilet Needs",
    dressingAndUndressing: "Dressing and Undressing",
    planningAndFollowingJourneys: "Planning Journeys",
    movingAround: "Moving Around",
    additionalInfo: "Additional Information"
};

export default function SummaryStep({ form }: SummaryStepProps) {
  const allValues = form.getValues();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-green-500" />
        <h2 className="mt-4 text-2xl font-semibold text-primary-foreground">Review Your Answers</h2>
        <p className="mt-2 text-muted-foreground">Please check that all your information is correct before downloading.</p>
      </div>

      <Alert>
        <Shield className="h-4 w-4" />
        <AlertTitle>Confidence Check!</AlertTitle>
        <AlertDescription>
          Looks good — ClaimEase has formatted your answers in DWP style.
        </AlertDescription>
      </Alert>

      <Accordion type="multiple" className="w-full" defaultValue={FORM_STEPS.map(s => s.id)}>
        {FORM_STEPS.filter(step => step.id !== 'review' && step.fields.length > 0).map((step) => (
          <AccordionItem value={step.id} key={step.id}>
            <AccordionTrigger className="text-lg font-medium hover:no-underline">
              {step.title}
            </AccordionTrigger>
            <AccordionContent className="pt-4">
              <dl className="space-y-4">
                {step.fields.map(field => {
                    const value = allValues[field as keyof FormValues];
                    if (!value) return null;
                    return (
                        <div key={field} className="grid grid-cols-1 md:grid-cols-3 gap-1">
                            <dt className="font-semibold text-muted-foreground md:col-span-1">{fieldLabels[field as keyof FormValues]}</dt>
                            <dd className="md:col-span-2 text-primary-foreground whitespace-pre-wrap">{String(value)}</dd>
                        </div>
                    );
                })}
              </dl>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}

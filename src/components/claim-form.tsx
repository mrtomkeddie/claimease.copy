
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useForm, type UseFormReturn } from 'react-hook-form';
import { AnimatePresence, motion } from 'framer-motion';

import { formSchema, type FormValues } from '@/lib/formSchema';
import { LOCAL_STORAGE_KEY, FORM_STEPS } from '@/lib/constants';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StepIndicator } from '@/components/form/step-indicator';
import PersonalDetailsStep from '@/components/form/steps/personal-details-step';
import HealthConditionsStep from '@/components/form/steps/health-conditions-step';
import DailyLivingStep from '@/components/form/steps/daily-living-step';
import MobilityStep from '@/components/form/steps/mobility-step';
import SummaryStep from '@/components/form/steps/summary-step';
import { ArrowLeft, ArrowRight, Download, Save, Lock, List } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SavedClaim } from '@/lib/mockData';

const stepComponents = [
  PersonalDetailsStep,
  HealthConditionsStep,
  DailyLivingStep,
  MobilityStep,
  SummaryStep,
];

interface ClaimFormProps {
  loadedClaim?: SavedClaim | null;
  onBackToSaved?: () => void;
}

export function ClaimForm({ loadedClaim, onBackToSaved }: ClaimFormProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const { toast } = useToast();

  const form = useForm<FormValues>({
    mode: 'onTouched',
  });

  useEffect(() => {
    setIsMounted(true);
    
    // If we have a loaded claim, use its data
    if (loadedClaim) {
      // Convert SavedClaim format to FormValues format
      const formData: Partial<FormValues> = {
        firstName: loadedClaim.formData.personalInfo?.firstName || '',
        lastName: loadedClaim.formData.personalInfo?.lastName || '',
        dateOfBirth: loadedClaim.formData.personalInfo?.dateOfBirth || '',
        address: loadedClaim.formData.personalInfo?.address || '',
        phoneNumber: loadedClaim.formData.personalInfo?.phoneNumber || '',
        email: loadedClaim.formData.personalInfo?.email || '',
        // Add more field mappings as needed
      };
      
      form.reset(formData);
      toast({
        title: "Claim Loaded",
        description: `Loaded "${loadedClaim.title}" - ${loadedClaim.progress}% complete`,
      });
    } else {
      // Try to load from localStorage if no claim is loaded
      try {
        const savedData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (savedData) {
          const parsedData = JSON.parse(savedData);
          form.reset(parsedData);
          toast({
            title: "Progress Restored",
            description: "We've loaded your previously saved answers.",
          });
        }
      } catch (error) {
        console.error("Failed to parse saved data:", error);
      }
    }
  }, [form, toast, loadedClaim]);

  const watchedValues = form.watch();
  useEffect(() => {
    if (isMounted) {
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(watchedValues));
      } catch (error) {
        console.error("Failed to save data:", error);
      }
    }
  }, [watchedValues, isMounted]);

  const handleNext = async () => {
    setCurrentStep((prev) => Math.min(prev + 1, FORM_STEPS.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const CurrentStepComponent = useMemo(() => stepComponents[currentStep], [currentStep]);

  const handleSaveProgress = () => {
    toast({
      title: "Progress Saved",
      description: "Your answers have been saved to this browser.",
      action: <Save className="h-5 w-5 text-green-500" />,
    });
  };

  const handleDownloadPdf = () => {
    handleSaveProgress();
    toast({
      title: "Preparing PDF Preview",
      description: "Your document will open in a new tab to be printed or saved. The final version is a paid feature.",
    });
    window.open('/print', '_blank');
  };

  if (!isMounted) {
    return (
      <Card className="w-full max-w-4xl mx-auto animate-pulse">
        <CardHeader><div className="h-8 bg-muted rounded w-1/2 mx-auto"></div></CardHeader>
        <CardContent><div className="h-64 bg-muted rounded"></div></CardContent>
        <CardFooter><div className="h-10 bg-muted rounded w-1/4 ml-auto"></div></CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl shadow-primary/10">
      <CardHeader className="space-y-6">
        <div className="flex justify-between items-center">
          {onBackToSaved && (
            <Button variant="outline" onClick={onBackToSaved}>
              <List className="mr-2 h-4 w-4" />
              Back to Saved Claims
            </Button>
          )}
          <div className="flex-1">
            {loadedClaim && (
              <div className="text-center">
                <h2 className="text-lg font-semibold text-gray-900">{loadedClaim.title}</h2>
                <p className="text-sm text-gray-600">Progress: {loadedClaim.progress}%</p>
              </div>
            )}
          </div>
        </div>
        <StepIndicator currentStep={currentStep} onStepClick={setCurrentStep} />
      </CardHeader>
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <CardContent className="space-y-8 px-8">
                <CurrentStepComponent form={form as UseFormReturn<FormValues, any, undefined>} />
              </CardContent>
            </motion.div>
          </AnimatePresence>
          <CardFooter className="flex justify-between p-8 bg-secondary/30 rounded-b-lg">
            <div>
              {currentStep > 0 && currentStep < FORM_STEPS.length - 1 && (
                <Button type="button" variant="outline" onClick={handleSaveProgress}>
                  <Save className="mr-2" />
                  Save Progress
                </Button>
              )}
            </div>
            <div className="flex gap-4">
              {currentStep > 0 && (
                <Button type="button" variant="ghost" onClick={handleBack}>
                  <ArrowLeft className="mr-2" />
                  Back
                </Button>
              )}
              {currentStep < FORM_STEPS.length - 1 ? (
                <Button type="button" onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2" />
                </Button>
              ) : (
                <Button type="button" onClick={handleDownloadPdf}>
                  <Download className="mr-2" />
                  Download PDF Preview
                </Button>
              )}
            </div>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}

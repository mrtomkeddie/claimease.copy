
"use client";

import { cn } from "@/lib/utils";
import { FORM_STEPS } from "@/lib/constants";
import { Check } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick: (step: number) => void;
}

export function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <nav aria-label="Form Steps">
      <ol className="flex items-center justify-center space-x-2 sm:space-x-4">
        {FORM_STEPS.map((step, index) => {
          const isCompleted = currentStep > index;
          const isActive = currentStep === index;
          
          return (
            <li key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() => onStepClick(index)}
                className="flex flex-col items-center cursor-pointer disabled:cursor-not-allowed group"
                aria-label={`Go to step ${index + 1}: ${step.title}`}
              >
                <div
                  className={cn(
                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 group-hover:ring-4 group-hover:ring-primary/20",
                    isCompleted ? "bg-accent text-accent-foreground" : "",
                    isActive ? "bg-primary text-primary-foreground ring-4 ring-primary/30" : "",
                    !isCompleted && !isActive ? "bg-secondary text-secondary-foreground" : ""
                  )}
                >
                  {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
                </div>
                <p className={cn(
                  "text-xs sm:text-sm mt-2 text-center",
                  isActive ? "text-primary font-semibold" : "text-muted-foreground",
                  "hidden sm:block"
                )}>
                  {step.title}
                </p>
              </button>

              {index < FORM_STEPS.length - 1 && (
                <div className={cn(
                  "flex-auto h-1 mx-2 sm:mx-4 transition-colors duration-300",
                  isCompleted ? "bg-accent" : "bg-border"
                )} />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

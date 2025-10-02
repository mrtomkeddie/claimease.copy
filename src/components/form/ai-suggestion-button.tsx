
"use client";

import { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { Loader2, Sparkles } from 'lucide-react';

import { suggestResponse, type SuggestResponseInput } from '@/ai/flows/suggest-response';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import type { FormValues } from '@/lib/formSchema';
import type { StepField } from '@/lib/constants';

interface AiSuggestionButtonProps {
  form: UseFormReturn<FormValues, any, undefined>;
  fieldName: StepField;
  fieldLabel: string;
  onSuggestion: (suggestion: string) => void;
}

export function AiSuggestionButton({ form, fieldName, fieldLabel, onSuggestion }: AiSuggestionButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSuggest = async () => {
    const rawAnswer = form.getValues(fieldName);
    if (!rawAnswer || rawAnswer.trim().length < 10) {
        toast({
            variant: "destructive",
            title: "Please write a bit more",
            description: "The AI needs at least 10 characters to provide a helpful suggestion.",
        });
        return;
    }


    setIsLoading(true);
    try {
      const allValues = form.getValues();
      const previousAnswers: Record<string, string> = {
        rawAnswer: allValues[fieldName]!,
      };

      // Add other relevant context
      if(allValues.mainCondition) {
        previousAnswers.mainCondition = allValues.mainCondition;
      }

      const input: SuggestResponseInput = {
        currentQuestion: fieldLabel,
        previousAnswers,
      };

      const result = await suggestResponse(input);
      
      if (result.suggestedResponse) {
        onSuggestion(result.suggestedResponse);
        toast({
          title: "Suggestion ready!",
          description: `AI suggestion for "${fieldLabel}" has been generated.`,
        });
      } else {
        throw new Error("AI did not return a suggestion.");
      }

    } catch (error) {
      console.error("AI Suggestion Error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not get an AI suggestion. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleSuggest}
      disabled={isLoading}
      className="gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4 text-yellow-500" />
      )}
      AI Suggest
    </Button>
  );
}

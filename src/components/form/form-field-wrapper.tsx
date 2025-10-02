
'use client';

import { useState } from "react";
import { FormLabel } from "@/components/ui/form"
import { GuidanceTooltip } from "./guidance-tooltip"
import { AiSuggestionButton } from "./ai-suggestion-button"
import type { UseFormReturn } from "react-hook-form"
import type { FormValues } from "@/lib/formSchema"
import type { StepField } from "@/lib/constants"
import { Button } from "../ui/button";
import { ThumbsUp } from "lucide-react";
import { Textarea } from "../ui/textarea";

interface FormFieldWrapperProps {
    children: React.ReactNode
    form: UseFormReturn<FormValues, any, undefined>;
    fieldName: StepField
    label: string
    guidance?: string
    aiEnabled?: boolean
}

export function FormFieldWrapper({
    children,
    form,
    fieldName,
    label,
    guidance,
    aiEnabled,
}: FormFieldWrapperProps) {
    const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);
    const [originalAnswer, setOriginalAnswer] = useState<string>("");

    const handleSuggestion = (suggestion: string) => {
        setOriginalAnswer(form.getValues(fieldName));
        setAiSuggestion(suggestion);
    }

    const acceptSuggestion = () => {
        if (aiSuggestion) {
            form.setValue(fieldName, aiSuggestion, { shouldValidate: true, shouldDirty: true });
            setAiSuggestion(null);
        }
    }

    const editOriginal = () => {
        setAiSuggestion(null);
    }

    if (aiSuggestion) {
        return (
             <div>
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center">
                        <FormLabel>{label}</FormLabel>
                        {guidance && <GuidanceTooltip>{guidance}</GuidanceTooltip>}
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <h3 className="font-semibold text-muted-foreground">Your Answer</h3>
                        <div className="p-3 rounded-md border border-dashed border-border h-full min-h-[120px] bg-secondary/50 text-sm">
                           {originalAnswer}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-primary">ClaimEase Answer</h3>
                        <div className="p-3 rounded-md border border-primary/50 bg-primary/10 h-full min-h-[120px] text-sm">
                            {aiSuggestion}
                        </div>
                    </div>
                </div>
                <div className="flex justify-end gap-2 mt-2">
                     <Button variant="ghost" size="sm" onClick={editOriginal}>Edit my answer</Button>
                     <Button size="sm" onClick={acceptSuggestion} className="gap-2">
                        <ThumbsUp className="h-4 w-4" />
                        Accept Suggestion
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center">
                    <FormLabel>{label}</FormLabel>
                    {guidance && <GuidanceTooltip>{guidance}</GuidanceTooltip>}
                </div>
                {aiEnabled && <AiSuggestionButton form={form} fieldName={fieldName} fieldLabel={label} onSuggestion={handleSuggestion} />}
            </div>
            {children}
        </div>
    )
}

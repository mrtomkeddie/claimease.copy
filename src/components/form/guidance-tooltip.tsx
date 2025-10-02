
"use client";

import { Info } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';

interface GuidanceTooltipProps {
  children: React.ReactNode;
}

export function GuidanceTooltip({ children }: GuidanceTooltipProps) {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 ml-1 text-muted-foreground hover:text-accent hover:bg-accent/20"
            aria-label="More information"
          >
            <Info className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-accent text-accent-foreground border-accent-foreground/20" side="top" align="center">
          {children}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

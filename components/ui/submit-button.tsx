"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  isSubmitting: boolean;
  submittingText: string;
  defaultText: string;
  className?: string;
  buttonClassName?: string;
  disabled?: boolean;
}

export function SubmitButton({
  isSubmitting,
  submittingText,
  defaultText,
  className,
  buttonClassName,
  disabled = false,
}: SubmitButtonProps) {
  return (
    <div className={cn("pt-4", className)}>
      <Button
        type="submit"
        className={cn("w-full sm:w-auto", buttonClassName)}
        disabled={isSubmitting || disabled}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {submittingText}
          </>
        ) : (
          defaultText
        )}
      </Button>
    </div>
  );
} 

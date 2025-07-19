"use client";

import { useEffect, useState } from "react";
import { format as formatDateFns, formatDistanceToNow } from "date-fns";
import { vi, enUS } from "date-fns/locale";
import { useTranslations, useLocale } from "next-intl";

interface ClientDateProps {
  date: string | Date;
  format?: string;
  className?: string;
  variant?: "default" | "short" | "timeOnly" | "full" | "relative";
}

/**
 * ClientDate component with internationalization support
 * 
 * Features:
 * - Automatic locale detection (English/Vietnamese)
 * - Multiple date format variants
 * - Relative time formatting
 * - Custom format support
 * 
 * Usage examples:
 * <ClientDate date={new Date()} /> // Default format
 * <ClientDate date={new Date()} variant="short" /> // Short format
 * <ClientDate date={new Date()} variant="relative" /> // Relative time
 * <ClientDate date={new Date()} format="yyyy-MM-dd" /> // Custom format
 */
export function ClientDate({
  date,
  format,
  className,
  variant = "default",
}: ClientDateProps) {
  const [local, setLocal] = useState<string>("");
  const t = useTranslations("DateFormats");
  const locale = useLocale();

  // Get the appropriate date-fns locale
  const dateFnsLocale = locale === "vi" ? vi : enUS;

  useEffect(() => {
    if (!date) {
      setLocal("");
      return;
    }

    const d = typeof date === "string" ? new Date(date) : date;
    
    if (variant === "relative") {
      // Use date-fns relative formatting with locale
      setLocal(formatDistanceToNow(d, { 
        addSuffix: true, 
        locale: dateFnsLocale 
      }));
    } else {
      // Use the provided format or get from translations based on variant
      const formatString = format || t(variant);
      setLocal(formatDateFns(d, formatString, { locale: dateFnsLocale }));
    }
  }, [date, format, variant, t, locale]);

  if (!local) return null;
  return <span className={className}>{local}</span>;
}

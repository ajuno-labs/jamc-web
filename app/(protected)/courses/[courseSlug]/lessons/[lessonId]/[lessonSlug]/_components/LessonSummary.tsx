"use client"
import { MathContent } from '@/components/MathContent';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";

interface LessonSummaryProps {
  summary: string;
}

export default function LessonSummary({ summary }: LessonSummaryProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-primary" />
          Lesson Summary
        </CardTitle>
      </CardHeader>
      <CardContent>
        <MathContent content={summary} className="text-muted-foreground leading-relaxed" />
      </CardContent>
    </Card>
  );
} 
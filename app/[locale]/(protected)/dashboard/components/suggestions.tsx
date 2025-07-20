"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, ArrowRight } from "lucide-react";

interface SuggestionsProps {
  suggestions: string[];
}

export default function Suggestions({ suggestions }: SuggestionsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5" />
          Suggested for You
        </CardTitle>
        <CardDescription>Topics and questions you might find interesting</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors cursor-pointer"
            >
              <span className="font-medium">{suggestion}</span>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircle, BookOpen, TrendingUp } from "lucide-react";

export default function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button className="w-full justify-start bg-transparent" variant="outline">
          <MessageCircle className="h-4 w-4 mr-2" />
          Ask a Question
        </Button>
        <Button className="w-full justify-start bg-transparent" variant="outline">
          <BookOpen className="h-4 w-4 mr-2" />
          Browse Courses
        </Button>
        <Button className="w-full justify-start bg-transparent" variant="outline">
          <TrendingUp className="h-4 w-4 mr-2" />
          View Progress
        </Button>
      </CardContent>
    </Card>
  );
}

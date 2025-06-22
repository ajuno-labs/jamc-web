import React from "react";
import { CreateCourseForm } from "./_components/CreateCourseForm";
import { getCourseTags } from "./_actions/tag-actions";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function NewCoursePage() {
  const availableTags = await getCourseTags();

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="bg-background">
        <CardHeader>
          <CardTitle>Create New Course</CardTitle>
        </CardHeader>
        <CardContent>
          <CreateCourseForm availableTags={availableTags} />
        </CardContent>
      </Card>
    </div>
  );
}

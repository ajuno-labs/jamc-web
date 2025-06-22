"use client";

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BookOpen, Compass, Plus } from "lucide-react";
import { Link } from "@/i18n/navigation";
import MyCourses from "./MyCourses";
import ExploreCourses from "./ExploreCourses";

interface CoursesClientProps {
  isTeacher: boolean;
}

export default function CoursesClient({ isTeacher }: CoursesClientProps) {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Mathematics Courses</h1>
        {isTeacher && (
          <Button asChild>
            <Link href="/courses/new">
              <Plus className="h-4 w-4 mr-2" />
              Create New Course
            </Link>
          </Button>
        )}
      </div>

      <Tabs defaultValue="my-courses" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="my-courses" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            My Courses
          </TabsTrigger>
          <TabsTrigger value="explore" className="flex items-center gap-2">
            <Compass className="h-4 w-4" />
            Explore
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="my-courses" className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">My Courses</h2>
          </div>
          <MyCourses />
        </TabsContent>
        
        <TabsContent value="explore" className="mt-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Explore Courses</h2>
            <p className="text-muted-foreground">
              Discover new courses and expand your knowledge
            </p>
          </div>
          <ExploreCourses />
        </TabsContent>
      </Tabs>
    </div>
  );
}

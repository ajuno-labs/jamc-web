"use client";

import React, { useState, useEffect } from "react";
import { getMyAccessibleCourses, type Course } from "../_actions/course-actions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Users } from "lucide-react";
import Link from "next/link";

export default function MyCourses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's accessible courses
  useEffect(() => {
    async function fetchMyCourses() {
      setLoading(true);
      try {
        const data = await getMyAccessibleCourses();
        setCourses(data);
      } catch (error) {
        console.error("Error fetching my courses:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMyCourses();
  }, []);

  // Filter courses based on search term
  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          type="text"
          placeholder="Search your courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Course cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-4">
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-muted rounded w-full animate-pulse" />
            </Card>
          ))
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <Card className="p-4 h-full hover:shadow-lg transition-shadow">
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-muted-foreground">
                    By {course.author.name}
                  </span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span className="text-sm text-muted-foreground">
                      {course.lessonCount} lessons
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">•</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span className="text-sm text-muted-foreground">
                      {course.enrollmentCount} students
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag) => (
                    <Badge key={tag.id} variant="secondary">
                      {tag.name}
                    </Badge>
                  ))}
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No courses found</h3>
            <p className="text-muted-foreground">
              {searchTerm
                ? "No courses match your search criteria."
                : "You haven't enrolled in any courses yet, or created any courses."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 
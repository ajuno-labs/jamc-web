"use client";

import React, { useState, useEffect } from "react";
import {
  getCourses,
  getTopics,
  getTeachers,
  type Course,
} from "../_actions/course-actions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Users } from "lucide-react";
import Link from "next/link";

interface Topic {
  name: string;
  count: number;
}

interface Teacher {
  id: string;
  name: string;
  image: string | null;
  courseCount: number;
}

export default function ExploreCourses() {
  const [searchTerm, setSearchTerm] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [courses, setCourses] = useState<Course[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch initial data
  useEffect(() => {
    async function fetchInitial() {
      setLoading(true);
      try {
        const [coursesData, topicsData, teachersData] = await Promise.all([
          getCourses(),
          getTopics(),
          getTeachers(),
        ]);
        setCourses(coursesData);
        setTopics(topicsData);
        setTeachers(teachersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchInitial();
  }, []);

  // Fetch filtered courses when filters change
  useEffect(() => {
    const handler = setTimeout(() => {
      async function fetchFiltered() {
        setLoading(true);
        try {
          const data = await getCourses({
            searchTerm: searchTerm || undefined,
            topic: topicFilter !== "all" ? topicFilter : undefined,
            teacherId: teacherFilter !== "all" ? teacherFilter : undefined,
          });
          setCourses(data);
        } catch (error) {
          console.error("Error fetching filtered courses:", error);
        } finally {
          setLoading(false);
        }
      }
      fetchFiltered();
    }, 300);
    return () => clearTimeout(handler);
  }, [searchTerm, topicFilter, teacherFilter]);

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="text-sm font-medium mb-1 block">Topic</label>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="border rounded-md p-2"
            >
              <option value="all">All Topics</option>
              {topics.map((topic) => (
                <option key={topic.name} value={topic.name}>
                  {topic.name} ({topic.count})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Teacher</label>
            <select
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              className="border rounded-md p-2"
            >
              <option value="all">All Teachers</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.courseCount})
                </option>
              ))}
            </select>
          </div>
        </div>
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
        ) : courses.length > 0 ? (
          courses.map((course) => (
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
            <p className="text-muted-foreground">
              No courses found matching your criteria.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 
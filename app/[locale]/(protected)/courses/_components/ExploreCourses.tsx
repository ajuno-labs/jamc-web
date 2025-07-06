"use client";

import React, { useState, useEffect, useTransition, useCallback } from "react";
import {
  getCourses,
  getTopics,
  getTeachers,
  type PaginatedResult,
  type Course,
} from "../_actions/course-actions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PaginationWrapper } from "@/components/ui/pagination-wrapper";
import { useTranslations } from 'next-intl';

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

/**
 * Displays a searchable, filterable, and paginated list of courses with internationalized UI.
 *
 * Fetches and displays courses based on user-selected search terms, topic and teacher filters, and pagination. Shows loading states, handles empty results, and integrates with internationalization for all user-facing text.
 *
 * @returns The rendered React component for exploring courses.
 */
export default function ExploreCourses() {
  const t = useTranslations('CoursesPage');
  const [searchTerm, setSearchTerm] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [teacherFilter, setTeacherFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [result, setResult] = useState<PaginatedResult<Course>>({
    data: [],
    pagination: {
      page: 1,
      limit: 12,
      total: 0,
      totalPages: 0,
      hasNext: false,
      hasPrev: false,
    },
  });
  const [topics, setTopics] = useState<Topic[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [isPending, startTransition] = useTransition();
  const [initialLoading, setInitialLoading] = useState(true);

  // Fetch initial data (topics and teachers)
  useEffect(() => {
    async function fetchInitialData() {
      try {
        const [topicsData, teachersData] = await Promise.all([
          getTopics(),
          getTeachers(),
        ]);
        setTopics(topicsData);
        setTeachers(teachersData);
      } catch (error) {
        console.error("Error fetching initial data:", error);
      } finally {
        setInitialLoading(false);
      }
    }
    fetchInitialData();
  }, []);

  const fetchCourses = useCallback((page: number, resetPage = false) => {
    if (resetPage) {
      setCurrentPage(1);
    }
    
    startTransition(async () => {
      try {
        const data = await getCourses({
          searchTerm: searchTerm,
          topic: topicFilter !== "all" ? topicFilter : undefined,
          teacherId: teacherFilter !== "all" ? teacherFilter : undefined,
          page,
          limit: 12,
        });
        setResult(data);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    });
  }, [searchTerm, topicFilter, teacherFilter]);

  // Initial load
  useEffect(() => {
    if (!initialLoading) {
      fetchCourses(1);
    }
  }, [initialLoading, fetchCourses]);

  // Fetch when filters change (with debounce for search)
  useEffect(() => {
    if (initialLoading) return;
    
    const handler = setTimeout(() => {
      fetchCourses(1, true);
    }, searchTerm ? 300 : 0);
    
    return () => clearTimeout(handler);
  }, [searchTerm, topicFilter, teacherFilter, initialLoading, fetchCourses]);

  // Fetch when page changes
  useEffect(() => {
    if (!initialLoading && currentPage > 1) {
      fetchCourses(currentPage);
    }
  }, [currentPage, initialLoading, fetchCourses]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (initialLoading) {
    return (
      <div className="space-y-6">
        {/* Loading skeletons for filters */}
        <div className="space-y-4">
          <div className="h-10 bg-muted rounded animate-pulse" />
          <div className="flex gap-4">
            <div className="h-16 w-32 bg-muted rounded animate-pulse" />
            <div className="h-16 w-32 bg-muted rounded animate-pulse" />
          </div>
        </div>
        {/* Loading skeletons for courses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-4">
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-muted rounded w-full animate-pulse" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={t('searchCourses')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-4 flex-wrap">
          <div>
            <label className="text-sm font-medium mb-1 block">{t('topic')}</label>
            <select
              value={topicFilter}
              onChange={(e) => setTopicFilter(e.target.value)}
              className="border rounded-md p-2"
              disabled={isPending}
            >
              <option value="all">{t('allTopics')}</option>
              {topics.map((topic) => (
                <option key={topic.name} value={topic.name}>
                  {topic.name} ({topic.count})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">{t('teacher')}</label>
            <select
              value={teacherFilter}
              onChange={(e) => setTeacherFilter(e.target.value)}
              className="border rounded-md p-2"
              disabled={isPending}
            >
              <option value="all">{t('allTeachers')}</option>
              {teachers.map((teacher) => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} ({teacher.courseCount})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading overlay */}
      {isPending && (
        <div className="relative">
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm z-10 flex items-center justify-center">
            <div className="flex items-center gap-2">
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              <span className="text-sm text-muted-foreground">{t('loadingCourses')}</span>
            </div>
          </div>
        </div>
      )}

      {/* Course cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isPending && result.data.length === 0 ? (
          // Initial loading skeletons
          Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-4 space-y-4">
              <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
              <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
              <div className="h-4 bg-muted rounded w-full animate-pulse" />
            </Card>
          ))
        ) : result.data.length > 0 ? (
          result.data.map((course) => (
            <Link key={course.id} href={`/courses/${course.slug}`}>
              <Card className={`p-4 h-full hover:shadow-lg transition-shadow ${isPending ? 'opacity-50' : ''}`}>
                <h2 className="text-xl font-semibold mb-2">{course.title}</h2>
                <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm text-muted-foreground">
                    {t('by')} {course.author.name}
                  </span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3" />
                    <span className="text-sm text-muted-foreground">
                      {course.lessonCount} {t('lessons')}
                    </span>
                  </div>
                  <span className="text-sm text-muted-foreground">•</span>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span className="text-sm text-muted-foreground">
                      {course.enrollmentCount} {t('students')}
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
              {t('noCoursesMatchSearch')}
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <PaginationWrapper
        currentPage={result.pagination.page}
        totalPages={result.pagination.totalPages}
        hasNext={result.pagination.hasNext}
        hasPrev={result.pagination.hasPrev}
        onPageChange={handlePageChange}
        loading={isPending}
      />
    </div>
  );
} 

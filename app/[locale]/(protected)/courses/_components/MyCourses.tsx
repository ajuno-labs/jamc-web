"use client";

import React, { useState, useEffect, useTransition } from "react";
import { getMyAccessibleCourses, type PaginatedResult, type Course } from "../_actions/course-actions";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, BookOpen, Users } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { PaginationWrapper } from "@/components/ui/pagination-wrapper";
import JoinCourseDialog from "./JoinCourseDialog";
import { useTranslations } from 'next-intl';

/**
 * Displays a paginated, searchable list of courses accessible to the user, with support for joining new courses and internationalized UI text.
 *
 * Fetches the user's accessible courses, allows client-side filtering by search term, and provides pagination controls. Shows loading states, handles empty results, and integrates a dialog for joining additional courses.
 */
export default function MyCourses() {
  const t = useTranslations('CoursesPage');
  const [searchTerm, setSearchTerm] = useState("");
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
  const [isPending, startTransition] = useTransition();

  // Fetch user's accessible courses
  const fetchMyCourses = (page: number) => {
    startTransition(async () => {
      try {
        const data = await getMyAccessibleCourses({ page, limit: 12 });
        setResult(data);
      } catch (error) {
        console.error("Error fetching my courses:", error);
      }
    });
  };

  useEffect(() => {
    fetchMyCourses(currentPage);
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Filter courses based on search term (client-side filtering for simplicity)
  const filteredCourses = result.data.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.author.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Search and Join Course */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder={t('searchMyCourses')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <JoinCourseDialog />
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
        ) : filteredCourses.length > 0 ? (
          filteredCourses.map((course) => (
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
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t('noCoursesFound')}</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm
                ? t('noCoursesMatchSearch')
                : t('noEnrolledCourses')}
            </p>
            {!searchTerm && <JoinCourseDialog />}
          </div>
        )}
      </div>

      {/* Pagination */}
      {!searchTerm && (
        <PaginationWrapper
          currentPage={result.pagination.page}
          totalPages={result.pagination.totalPages}
          hasNext={result.pagination.hasNext}
          hasPrev={result.pagination.hasPrev}
          onPageChange={handlePageChange}
          loading={isPending}
        />
      )}
    </div>
  );
} 

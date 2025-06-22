"use server"

import { prisma } from "@/lib/db/prisma"
import { QuestionType, Prisma } from "@prisma/client"
import { auth } from "@/auth"
import { questionWithRelationsInclude } from "@/lib/types/prisma"
import { getPublicEnhancedPrisma } from "@/lib/db/enhanced"

interface SearchQuestionsResult {
  items: Array<{
    id: string
    slug: string
    title: string
    content: string
    type: QuestionType
    author: {
      name: string | null
      image: string | null
    }
    tags: Array<{ name: string }>
    answerCount: number
    voteCount: number
    createdAt: string
  }>
  total: number
  hasMore: boolean
}

export interface Course {
  id: string;
  title: string;
  description: string;
  slug: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  tags: {
    id: string;
    name: string;
  }[];
  lessonCount: number;
  enrollmentCount: number;
  createdAt: Date;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Search for questions with pagination
 * 
 * This function uses the original Prisma client for public questions
 * and handles its own access control with the visibility filter
 */
export async function searchQuestions(
  query: string = "",
  type: "all" | QuestionType = "all",
  page: number = 1,
  pageSize: number = 10,
  tags: string[] = []
): Promise<SearchQuestionsResult> {
  try {
    // For public question listing, we use the original prisma client
    // with explicit filtering rather than relying on ZenStack's policies
    const db = prisma
    const skip = (page - 1) * pageSize
    const session = await auth()

    // Debug logging
    console.log('Current session:', {
      user: session?.user,
      email: session?.user?.email
    })

    // Build the where clause
    const where: Prisma.QuestionWhereInput = {
      AND: [
        // Only apply search conditions if query is not empty
        query ? {
          OR: [
            { title: { contains: query, mode: "insensitive" as Prisma.QueryMode } },
            { content: { contains: query, mode: "insensitive" as Prisma.QueryMode } },
            {
              tags: {
                some: {
                  name: { contains: query, mode: "insensitive" as Prisma.QueryMode }
                }
              }
            }
          ]
        } : {},
        // Always apply type filter if not "all"
        type === "all" ? {} : { type },
        // Apply tags filter if any tags are selected
        tags.length > 0 ? {
          tags: {
            some: {
              name: { in: tags }
            }
          }
        } : {},
        // Only show public questions to maintain some access control
        { visibility: "PUBLIC" }
      ]
    }

    // Get total count for pagination
    const total = await db.question.count({ where })

    // Get paginated questions
    const questions = await db.question.findMany({
      where,
      include: questionWithRelationsInclude,
      orderBy: {
        createdAt: "desc"
      },
      skip,
      take: pageSize
    })

    // Debug logging
    console.log('Found questions:', questions.length)
    console.log('Total questions:', total)
    if (tags.length > 0) {
      console.log('Filtering by tags:', tags)
    }

    return {
      items: questions.map((question) => ({
        id: question.id,
        slug: question.slug,
        title: question.title,
        content: question.content,
        type: question.type,
        author: question.author,
        tags: question.tags,
        answerCount: question._count.answers,
        voteCount: question._count.votes,
        createdAt: question.createdAt.toISOString()
      })),
      total,
      hasMore: skip + questions.length < total
    }
  } catch (error) {
    console.error("Search error:", error)
    return { items: [], total: 0, hasMore: false }
  }
}

/**
 * Get all courses with filtering options and pagination
 */
export async function getCourses(options?: {
  searchTerm?: string;
  topic?: string;
  teacherId?: string;
  page?: number;
  limit?: number;
}): Promise<PaginatedResult<Course>> {
  try {
    const { searchTerm, topic, teacherId, page = 1, limit = 12 } = options || {};
    const skip = (page - 1) * limit;

    // Build the where clause based on filter options
    const where: Prisma.CourseWhereInput = {};

    if (searchTerm) {
      where.OR = [
        { title: { contains: searchTerm, mode: "insensitive" } },
        { description: { contains: searchTerm, mode: "insensitive" } },
      ];
    }

    if (topic) {
      where.tags = {
        some: {
          name: topic,
        },
      };
    }

    if (teacherId) {
      where.authorId = teacherId;
    }

    // Fetch courses with related data
    const db = getPublicEnhancedPrisma();
    
    // Get total count for pagination
    const total = await db.course.count({ where });
    
    const courses = await db.course.findMany({
      where,
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        createdAt: true,
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        tags: {
          select: {
            id: true,
            name: true,
          },
        },
        lessons: {
          select: {
            id: true,
          },
        },
        enrollments: {
          select: {
            userId: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: limit,
    });

    // Transform the data for the frontend
    const transformedCourses = courses.map((course) => ({
      id: course.id,
      title: course.title,
      description: course.description,
      slug: course.slug,
      author: {
        id: course.author.id,
        name: course.author.name || "Unknown",
        image: course.author.image,
      },
      tags: course.tags,
      lessonCount: course.lessons.length,
      enrollmentCount: course.enrollments.length,
      createdAt: course.createdAt,
    }));

    const totalPages = Math.ceil(total / limit);

    return {
      data: transformedCourses,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    };
  } catch (error) {
    console.error("Error fetching courses:", error);
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 12,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }
} 
"use server";

import { getPublicEnhancedPrisma, getEnhancedPrisma } from "@/lib/db/enhanced";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

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

export type CourseWithLessons = Prisma.CourseGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    lessons: {
      orderBy: {
        order: "asc";
      };
    };
  };
}>;

export type CourseWithBasicRelations = Prisma.CourseGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        image: true;
      };
    };
    tags: {
      select: {
        id: true;
        name: true;
      };
    };
    lessons: {
      select: {
        id: true;
        title: true;
        slug: true;
        order: true;
      };
      orderBy: {
        order: "asc";
      };
    };
    enrollments: {
      select: {
        userId: true;
      };
    };
  };
}>;

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

/**
 * Get a single course by ID
 */
export async function getCourseById(
  id: string
): Promise<CourseWithBasicRelations | null> {
  if (!id) {
    throw new Error("Course ID is required");
  }

  try {
    const db = getPublicEnhancedPrisma();
    const course = await db.course.findUnique({
      where: {
        id: id,
      },
      include: {
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
            title: true,
            slug: true,
            order: true,
          },
          orderBy: {
            order: "asc",
          },
        },
        enrollments: {
          select: {
            userId: true,
          },
        },
      },
    });

    return course;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

/**
 * Get unique topics (tags) used in courses
 */
export type TopicWithCount = {
  name: string;
  count: number;
};

export async function getTopics(): Promise<TopicWithCount[]> {
  try {
    const db = getPublicEnhancedPrisma();
    const tags = await db.tag.findMany({
      where: {
        courses: {
          some: {},
        },
      },
      select: {
        name: true,
        _count: {
          select: {
            courses: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return tags.map((tag) => ({
      name: tag.name,
      count: tag._count.courses,
    }));
  } catch (error) {
    console.error("Error fetching topics:", error);
    return [];
  }
}

/**
 * Get teachers who have created courses
 */
export type TeacherWithCount = {
  id: string;
  name: string;
  image: string | null;
  courseCount: number;
};

export async function getTeachers(): Promise<TeacherWithCount[]> {
  try {
    const db = getPublicEnhancedPrisma();
    const teachers = await db.user.findMany({
      where: {
        createdCourses: {
          some: {},
        },
      },
      select: {
        id: true,
        name: true,
        image: true,
        _count: {
          select: {
            createdCourses: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return teachers.map((teacher) => ({
      id: teacher.id,
      name: teacher.name || "Unknown",
      image: teacher.image,
      courseCount: teacher._count.createdCourses,
    }));
  } catch (error) {
    console.error("Error fetching teachers:", error);
    return [];
  }
}

export async function enrollInCourse(formData: FormData) {
  const user = await getAuthUser();
  if (!user?.id) {
    throw new Error("You must be logged in to enroll in a course");
  }
  const db = await getEnhancedPrisma();

  const courseId = formData.get("courseId") as string;
  if (!courseId) {
    throw new Error("Course ID is required");
  }

  try {
    await db.courseEnrollment.create({
      data: {
        userId: user.id,
        courseId,
      },
    });

    revalidatePath(`/courses/${courseId}`);
    return { success: true };
  } catch (error: unknown) {
    console.error("Failed to enroll in course:", error);
    throw new Error("Failed to enroll in course");
  }
}

/**
 * Get a course with its lessons
 */
export async function getCourseWithLessons(
  id: string
): Promise<CourseWithLessons | null> {
  if (!id) {
    throw new Error("Course ID is required");
  }

  try {
    const db = getPublicEnhancedPrisma();
    const course = await db.course.findUnique({
      where: {
        id: id,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        lessons: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    return course;
  } catch (error) {
    console.error("Error fetching course lessons:", error);
    return null;
  }
}

/**
 * Get courses the user has access to (enrolled + authored) with pagination
 */
export async function getMyAccessibleCourses(options?: {
  page?: number;
  limit?: number;
}): Promise<PaginatedResult<Course>> {
  try {
    const user = await getAuthUser();
    if (!user?.id) {
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

    const { page = 1, limit = 12 } = options || {};
    const skip = (page - 1) * limit;

    const db = await getEnhancedPrisma();

    const where = {
      OR: [
        {
          enrollments: {
            some: {
              userId: user.id,
            },
          },
        },
        {
          authorId: user.id,
        },
      ],
    };

    // Get total count for pagination
    const total = await db.course.count({ where });

    // Get courses where user is enrolled OR is the author
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
    console.error("Error fetching user's accessible courses:", error);
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

/**
 * Join a course using a join code
 */
export async function joinCourseWithCode(formData: FormData) {
  const user = await getAuthUser();
  if (!user?.id) {
    throw new Error("You must be logged in to join a course");
  }

  const joinCode = formData.get("joinCode") as string;
  if (!joinCode) {
    throw new Error("Join code is required");
  }

  const db = await getEnhancedPrisma();

  try {
    // Find the course by join code
    const course = await db.course.findUnique({
      where: { joinCode: joinCode.trim() },
      select: { id: true, title: true, slug: true },
    });

    if (!course) {
      throw new Error("Invalid join code. Please check and try again.");
    }

    // Check if user is already enrolled
    const existingEnrollment = await db.courseEnrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
    });

    if (existingEnrollment) {
      throw new Error("You are already enrolled in this course.");
    }

    // Create enrollment
    await db.courseEnrollment.create({
      data: {
        userId: user.id,
        courseId: course.id,
      },
    });

    revalidatePath("/courses");
    revalidatePath(`/courses/${course.slug}`);
    
    return { 
      success: true, 
      message: `Successfully joined "${course.title}"!`,
      courseSlug: course.slug,
    };
  } catch (error: unknown) {
    console.error("Failed to join course:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to join course");
  }
}

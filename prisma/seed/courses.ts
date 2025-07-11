import { prisma, slugify } from "./utils";

export async function seedCourses(teacherId: string) {
  console.log("Seeding Vietnamese math course...");

  const toanTag = await prisma.tag.upsert({
    where: { name: "Toán" },
    update: {},
    create: {
      name: "Toán",
      description: "Toán học phổ thông",
    },
  });

  const daiSoTag = await prisma.tag.upsert({
    where: { name: "Đại số" },
    update: {},
    create: {
      name: "Đại số",
      description: "Algebra",
    },
  });

  const hinhHocTag = await prisma.tag.upsert({
    where: { name: "Hình học" },
    update: {},
    create: {
      name: "Hình học",
      description: "Geometry",
    },
  });

  const luongGiacTag = await prisma.tag.upsert({
    where: { name: "Lượng giác" },
    update: {},
    create: {
      name: "Lượng giác",
      description: "Trigonometry",
    },
  });

  const giaiTichTag = await prisma.tag.upsert({
    where: { name: "Giải tích" },
    update: {},
    create: {
      name: "Giải tích",
      description: "Calculus",
    },
  });

  const thongKeTag = await prisma.tag.upsert({
    where: { name: "Thống kê" },
    update: {},
    create: {
      name: "Thống kê",
      description: "Statistics",
    },
  });

  // Vietnamese High School Math Course
  return await prisma.$transaction(async (tx) => {
    const existingCourse = await tx.course.findUnique({
      where: { slug: "toan-thpt" },
      include: { modules: { include: { chapters: true } } },
    });

    if (existingCourse) {
      // Delete lessons first, then chapters, then modules
      for (const module of existingCourse.modules) {
        for (const chapter of module.chapters) {
          await tx.lesson.deleteMany({ where: { chapterId: chapter.id } });
        }
        await tx.courseChapter.deleteMany({ where: { moduleId: module.id } });
      }
      await tx.courseModule.deleteMany({ where: { courseId: existingCourse.id } });
    }

    const vietnameseMath = await tx.course.upsert({
      where: { slug: "toan-thpt" },
      update: {},
      create: {
        title: "Toán THPT",
        description: "Khóa học Toán dành cho học sinh trung học phổ thông, bao gồm Đại số, Hình học, Lượng giác, Giải tích và Thống kê.",
        slug: "toan-thpt",
        authorId: teacherId,
        tags: {
          connect: [
            { id: toanTag.id },
            { id: daiSoTag.id },
            { id: hinhHocTag.id },
            { id: luongGiacTag.id },
            { id: giaiTichTag.id },
            { id: thongKeTag.id },
          ],
        },
      },
    });

    await tx.courseModule.create({
      data: {
        courseId: vietnameseMath.id,
        title: "Đại số và Lượng giác",
        slug: slugify("Đại số và Lượng giác"),
        order: 1,
        chapters: {
          create: [
            {
              title: "Đại số căn bản",
              slug: slugify("Đại số căn bản"),
              order: 1,
              lessons: {
                create: [
                  {
                    title: "Đại số căn bản",
                    slug: slugify("Đại số căn bản"),
                    summary: "Giới thiệu về đại số, phương trình, bất phương trình, và các phép biến đổi đại số cơ bản.",
                    order: 1,
                    courseId: vietnameseMath.id,
                  },
                ],
              },
            },
            {
              title: "Lượng giác",
              slug: slugify("Lượng giác"),
              order: 2,
              lessons: {
                create: [
                  {
                    title: "Lượng giác",
                    slug: slugify("Lượng giác"),
                    summary: "Các hàm lượng giác, công thức lượng giác, và ứng dụng trong giải toán.",
                    order: 3,
                    courseId: vietnameseMath.id,
                  },
                ],
              },
            },
          ],
        },
      },
    });

    await tx.courseModule.create({
      data: {
        courseId: vietnameseMath.id,
        title: "Hình học và Giải tích",
        slug: slugify("Hình học và Giải tích"),
        order: 2,
        chapters: {
          create: [
            {
              title: "Hình học phẳng",
              slug: slugify("Hình học phẳng"),
              order: 1,
              lessons: {
                create: [
                  {
                    title: "Hình học phẳng",
                    slug: slugify("Hình học phẳng"),
                    summary: "Các khái niệm cơ bản về hình học phẳng, tam giác, đường tròn, và các định lý quan trọng.",
                    order: 2,
                    courseId: vietnameseMath.id,
                  },
                ],
              },
            },
            {
              title: "Giải tích cơ bản",
              slug: slugify("Giải tích cơ bản"),
              order: 2,
              lessons: {
                create: [
                  {
                    title: "Giải tích cơ bản",
                    slug: slugify("Giải tích cơ bản"),
                    summary: "Giới thiệu về giới hạn, đạo hàm, tích phân và ứng dụng.",
                    order: 4,
                    courseId: vietnameseMath.id,
                  },
                ],
              },
            },
          ],
        },
      },
    });

    await tx.courseModule.create({
      data: {
        courseId: vietnameseMath.id,
        title: "Thống kê và Xác suất",
        slug: slugify("Thống kê và Xác suất"),
        order: 3,
        chapters: {
          create: [
            {
              title: "Thống kê và Xác suất",
              slug: slugify("Thống kê và Xác suất"),
              order: 1,
              lessons: {
                create: [
                  {
                    title: "Thống kê và Xác suất",
                    slug: slugify("Thống kê và Xác suất"),
                    summary: "Các khái niệm cơ bản về thống kê, xác suất và ứng dụng thực tế.",
                    order: 5,
                    courseId: vietnameseMath.id,
                  },
                ],
              },
            },
          ],
        },
      },
    });

    return { vietnameseMath };
  });
}

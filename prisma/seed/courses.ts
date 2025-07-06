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
  const vietnameseMath = await prisma.course.upsert({
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
        ]
      },
      lessons: {
        create: [
          {
            title: "Đại số căn bản",
            slug: slugify("Đại số căn bản"),
            summary: "Giới thiệu về đại số, phương trình, bất phương trình, và các phép biến đổi đại số cơ bản.",
            order: 1,
          },
          {
            title: "Hình học phẳng",
            slug: slugify("Hình học phẳng"),
            summary: "Các khái niệm cơ bản về hình học phẳng, tam giác, đường tròn, và các định lý quan trọng.",
            order: 2,
          },
          {
            title: "Lượng giác",
            slug: slugify("Lượng giác"),
            summary: "Các hàm lượng giác, công thức lượng giác, và ứng dụng trong giải toán.",
            order: 3,
          },
          {
            title: "Giải tích cơ bản",
            slug: slugify("Giải tích cơ bản"),
            summary: "Giới thiệu về giới hạn, đạo hàm, tích phân và ứng dụng.",
            order: 4,
          },
          {
            title: "Thống kê và Xác suất",
            slug: slugify("Thống kê và Xác suất"),
            summary: "Các khái niệm cơ bản về thống kê, xác suất và ứng dụng thực tế.",
            order: 5,
          },
        ]
      },
    },
  });
  return { vietnameseMath };
}

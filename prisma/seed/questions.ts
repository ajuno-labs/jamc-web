import { prisma, slugify } from './utils'

export async function seedQuestions({
  students,
  course,
  lessons
}: {
  students: { id: string, name: string }[],
  course: { id: string },
  lessons: { id: string, title: string }[]
}) {
  console.log('Seeding 100 Vietnamese high school math questions...')

  // Topics for each lesson
  const lessonTopics = [
    'Đại số',
    'Hình học',
    'Lượng giác',
    'Giải tích',
    'Thống kê'
  ] as const;
  type Topic = typeof lessonTopics[number];

  // Example questions for each topic (4 per topic, will cycle)
  const exampleQuestions = {
    'Đại số': [
      {
        title: 'Giải phương trình bậc hai',
        content: 'Hãy giải phương trình $$x^2 - 5x + 6 = 0$$.'
      },
      {
        title: 'Tìm giá trị lớn nhất',
        content: 'Tìm giá trị lớn nhất của hàm số $$y = -x^2 + 4x + 5$$.'
      },
      {
        title: 'Chứng minh bất đẳng thức',
        content: 'Chứng minh rằng $$a^2 + b^2 \geq 2ab$$ với mọi $$a, b \in \mathbb{R}$$.'
      },
      {
        title: 'Tính tổng dãy số',
        content: 'Tính $$S = 1 + 2 + 3 + ... + 100$$.'
      }
    ],
    'Hình học': [
      {
        title: 'Tính diện tích tam giác',
        content: 'Cho tam giác có độ dài các cạnh là $$a=3$$, $$b=4$$, $$c=5$$. Tính diện tích.'
      },
      {
        title: 'Chứng minh ba điểm thẳng hàng',
        content: 'Cho ba điểm $$A(1,2)$$, $$B(3,6)$$, $$C(5,10)$$. Chứng minh rằng chúng thẳng hàng.'
      },
      {
        title: 'Tính bán kính đường tròn ngoại tiếp',
        content: 'Cho tam giác đều cạnh $$a$$. Tính bán kính đường tròn ngoại tiếp.'
      },
      {
        title: 'Tính góc giữa hai đường thẳng',
        content: 'Tính góc giữa hai đường thẳng $$d_1: y = 2x + 1$$ và $$d_2: y = -x + 3$$.'
      }
    ],
    'Lượng giác': [
      {
        title: 'Tính giá trị lượng giác',
        content: 'Tính $$\sin 30^\circ$$, $$\cos 60^\circ$$, $$\tan 45^\circ$$.'
      },
      {
        title: 'Giải phương trình lượng giác',
        content: 'Giải phương trình $$2\sin x - 1 = 0$$ trên đoạn $$[0, 2\pi]$$.'
      },
      {
        title: 'Chứng minh đẳng thức lượng giác',
        content: 'Chứng minh rằng $$\sin^2 x + \cos^2 x = 1$$.'
      },
      {
        title: 'Tính tổng lượng giác',
        content: 'Tính $$\sum_{k=1}^{90} \sin k^\circ$$.'
      }
    ],
    'Giải tích': [
      {
        title: 'Tính giới hạn',
        content: 'Tính $$\lim_{x \to 0} \frac{\sin x}{x}$$.'
      },
      {
        title: 'Tính đạo hàm',
        content: 'Tính đạo hàm của hàm số $$y = x^3 + 2x^2 - x + 1$$.'
      },
      {
        title: 'Tính tích phân',
        content: 'Tính $$\int_0^1 x^2 dx$$.'
      },
      {
        title: 'Ứng dụng đạo hàm',
        content: 'Tìm điểm cực trị của hàm số $$y = x^3 - 3x^2 + 2$$.'
      }
    ],
    'Thống kê': [
      {
        title: 'Tính trung bình cộng',
        content: 'Cho dãy số $$2, 4, 6, 8, 10$$. Tính trung bình cộng.'
      },
      {
        title: 'Tính phương sai',
        content: 'Cho dãy số $$1, 3, 5, 7, 9$$. Tính phương sai.'
      },
      {
        title: 'Tính xác suất',
        content: 'Một con xúc xắc được tung 1 lần. Xác suất để ra số chẵn là bao nhiêu?'
      },
      {
        title: 'Giải bài toán tổ hợp',
        content: 'Có bao nhiêu cách chọn 2 học sinh từ 10 học sinh?'
      }
    ]
  };

  let questionCount = 0;
  for (let lessonIdx = 0; lessonIdx < lessons.length; lessonIdx++) {
    const lesson = lessons[lessonIdx];
    const topic: Topic = lessonTopics[lessonIdx % lessonTopics.length];
    for (let i = 0; i < 20; i++) {
      const student = students[(questionCount) % students.length];
      const qTemplate = exampleQuestions[topic][i % 4];
      const title = `${qTemplate.title} (${topic}) #${i+1}`;
      const content = qTemplate.content;
      const slug = slugify(`${student.name}-${title}`);
      await prisma.question.upsert({
        where: { slug },
        update: {},
        create: {
          title,
          content,
          type: "FORMAL",
          topic,
          visibility: "PUBLIC",
          status: "OPEN",
          slug,
          authorId: student.id,
          courseId: course.id,
          lessonId: lesson.id
        }
      });
      questionCount++;
    }
  }

  console.log('100 Vietnamese questions seeded successfully');
} 

## **Recommended Folder Structure**
```bash
jamc
├── app
│   ├── (auth)                     # Auth-related routes
│   │   ├── login
│   │   └── register
│   ├── (main)                     # Protected routes (require auth)
│   │   ├── layout.tsx            # Main app layout (sidebar/navbar)
│   │   ├── dashboard
│   │   ├── classes
│   │   │   ├── [classId]         # Dynamic class page
│   │   │   └── create            # Class creation (modal)
│   │   ├── courses
│   │   ├── qa
│   │   └── settings
│   ├── api                       # API routes
│   └── layout.tsx                # Root layout
│   └── lib
│       ├── config/              # Cấu hình ứng dụng
│       ├── constants/           # Hằng số toàn cục
│       ├── db/                  # Database & ORM
│       ├── utils/               # Tiện ích tái sử dụng
│       ├── services/            # Tích hợp dịch vụ bên ngoài
│       ├── types/               # TypeScript types
│       └── errors/              # Xử lý lỗi tập trung
│       └── server-actions          # Server Actions organized by domain
│           ├── courses
│           │   ├── create.ts
│           │   └── update.ts
│           ├── classes
│           ├── auth
│           └── utils.ts            # Error handling helpers
└── components                    # Shared components
├── tests/
│   ├── e2e/
│   │   ├── oauth.spec.ts       # Playwright/Cypress tests
│   │   └── auth.spec.ts        # Other auth-related tests
│   │
│   ├── integration/
│   │   ├── auth.integration.ts # Prisma/Auth.js integration tests
│   │   └── setup.ts            # Integration test setup
│   │
│   ├── mocks/
│   │   ├── handlers.ts         # MSW mock handlers
│   │   └── server.ts           # Mock server setup
│   │
│   ├── unit/
│   │   ├── auth.service.test.ts # Unit tests for auth logic
│   │   └── ...                 
│   │
│   └── setup.ts               # Global test setup
│
├── playwright.config.ts       # Playwright config
├── next.config.js             # Next.js config
├── .env.test                  # Test environment variables
└── prisma/
    └── schema.prisma    

### **2. Route Grouping Strategy**
Use Next.js **[Route Groups](https://nextjs.org/docs/app/building-your-application/routing/route-groups)** (`(folder)`) to organize without affecting URL paths:

#### **A. Auth Routes** (`(auth)`)
- `/login` → Renders student/teacher login based on user type  
- `/register` → Unified form with role switcher

#### **B. Protected Routes** (`(main)`)
Wrap with authentication middleware:
```tsx
// app/(main)/layout.tsx
export default function Layout({ children }) {
  const { role } = useAuth(); // Custom auth hook

  if (!role) redirect('/login'); // Protect entire group
  
  return (
    <RoleContext.Provider value={role}>
      <MainLayout>{children}</MainLayout>
    </RoleContext.Provider>
  )
}
```

---

### **3. Dynamic Routing for Classes/Courses**
Use Next.js **[Dynamic Segments](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)**:

#### **Class Detail Page**
- Path: `/classes/[classId]`  
- Folder: `app/(main)/classes/[classId]/page.tsx`  
- Access: `params.classId` in page component

#### **Course Enrollment**
- Path: `/courses/[courseId]/enroll`  
- Folder: `app/(main)/courses/[courseId]/enroll/page.tsx`

---

### **4. Parallel Routes for Teacher/Student Views**
Instead of separate routes, use **conditional rendering** within layouts:
```tsx
// app/(main)/dashboard/page.tsx
export default function Dashboard() {
  const { role } = useRoleContext();

  return (
    <>
      {role === 'student' && <StudentDashboard />}
      {role === 'teacher' && <TeacherDashboard />}
    </>
  )
}
```

---

### **5. Modal Routing (Advanced)**
Use Next.js **[Intercepting Routes](https://nextjs.org/docs/app/building-your-application/routing/intercepting-routes)** for modals/overlays:  
![Modal Routing Diagram](https://nextjs.org/_next/image?url=%2Fdocs%2Flight%2Fintercepting-routes-soft-navigate.png&w=3840&q=75)

**Example**:  
- Path: `/classes/create` opens as modal overlay  
- Folder: `app/(main)/classes/create/page.tsx`

---

### **6. API Route Organization**
```bash
/app
└── api
    ├── auth
    │   └── [...nextauth]         # NextAuth.js
    ├── classes
    │   ├── [classId]
    │   │   └── route.ts
    │   └── route.ts
    ├── ai                        # AI endpoints
    │   ├── questions
    │   └── recommendations
    └── webhooks                  # Stripe/VNPay
```

---

### **7. Recommended Middleware**
`middleware.ts` at root for:
- Authentication checks
- Role-based redirects
- Locale handling (if supporting Vietnamese)

```ts
// middleware.ts
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const session = await getToken({ req: request });

  // Redirect unauthenticated users
  if (!session && pathname.startsWith('/main')) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Teacher-only routes
  if (session?.role !== 'teacher' && pathname.startsWith('/main/teacher')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
}
```

---

### **8. Key Route Examples**
| **Feature**              | **Route**                    | **File Path**                              |
|--------------------------|------------------------------|--------------------------------------------|
| Student Dashboard        | `/dashboard`                 | `app/(main)/dashboard/page.tsx`            |
| Class Detail             | `/classes/abc123`            | `app/(main)/classes/[classId]/page.tsx`    |
| Q&A Thread               | `/qa/[questionId]`           | `app/(main)/qa/[questionId]/page.tsx`      |
| Teacher Course Creation  | `/courses/create`            | `app/(main)/courses/create/page.tsx`       |
| Payment Success          | `/payment/success`           | `app/(main)/payment/success/page.tsx`      |

---

### **9. Pro Tips**
1. **Layout Nesting**:  
   Use nested layouts for sections like `/settings` that need consistent UI.

2. **Loading States**:  
   Add `loading.tsx` files in route segments for better UX.

3. **Error Boundaries**:  
   Include `error.tsx` in critical routes.

4. **Type Safety**:  
   Use Zod for route params validation:
   ```ts
   // app/(main)/classes/[classId]/page.tsx
   const paramsSchema = z.object({ classId: z.string().uuid() });
   ```

5. **i18n**:  
   If localizing for Vietnam, use Next.js internationalized routing:
   ```
   /vi/dashboard
   /en/dashboard
   ```

---

This structure scales well while keeping routes clean and maintainable. Start with this foundation and expand as needed! Would you like me to elaborate on any specific routing scenario?


Dưới đây là cấu trúc chi tiết cho thư mục `lib` trong dự án Next.js của bạn, phù hợp với hệ thống giáo dục đa vai trò và tích hợp AI:

---

### **Cấu trúc mẫu**
```bash
/src/app/lib/
├── config/              # Cấu hình ứng dụng
├── constants/           # Hằng số toàn cục
├── db/                  # Database & ORM
├── utils/               # Tiện ích tái sử dụng
├── services/            # Tích hợp dịch vụ bên ngoài
├── types/               # TypeScript types
├── server-actions/      # Server Actions (đã triển khai)
└── errors/              # Xử lý lỗi tập trung
```

---

### **1. Thư mục `config` - Cấu hình ứng dụng**
Dành cho các thiết lập toàn cục:
```bash
/config
├── site.ts          # Meta data website
├── theme.ts         # Cài đặt UI/UX
├── feature-flags.ts # Bật/tắt tính năng
└── roles.ts         # Phân quyền theo vai trò
```

**Ví dụ `roles.ts`:**
```ts
export const ROLE_PERMISSIONS = {
  student: {
    maxClasses: 5,
    aiAccess: true
  },
  teacher: {
    canCreateCourses: true,
    aiQuota: 'unlimited'
  }
} as const;
```

---

### **2. Thư mục `constants` - Dữ liệu tĩnh**
```bash
/constants
├── navigation.ts    # Menu điều hướng
├── api-endpoints.ts # URL API
└── ai-prompts.ts    # Prompt mẫu cho AI
```

**Ví dụ `ai-prompts.ts`:**
```ts
export const MATH_TUTOR_PROMPTS = {
  basic: `Bạn là trợ lý toán học cho học sinh cấp 2. Giải thích khái niệm {{topic}}...`,
  advanced: `Giả sử bạn là giáo sư toán, hãy phân tích bài toán {{problem}}...`
};
```

---

### **3. Thư mục `db` - Quản lý database**
```bash
/db
├── index.ts         # Khởi tạo Prisma/Drizzle
├── schema/          # Database schema
├── queries/         # Raw SQL queries
└── seed.ts          # Dữ liệu mẫu
```

**Ví dụ `index.ts`:**
```ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' 
    ? ['query', 'error', 'warn'] 
    : ['error']
});

export default prisma;
```

---

### **4. Thư mục `utils` - Tiện ích tái sử dụng**
```bash
/utils
├── validators/      # Zod schemas
├── formatters/      # Định dạng dữ liệu
├── ai/              # Xử lý AI response
└── auth/            # Helper xác thực
```

**Ví dụ `validators/course.ts`:**
```ts
import { z } from 'zod';

export const CourseSchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().max(500).optional(),
  isPublished: z.boolean().default(false)
});
```

---

### **5. Thư mục `services` - Tích hợp dịch vụ bên ngoài**
```bash
/services
├── deepseek/        # AI service
├── payment/         # VNPay/Momo
├── email/           # Gửi email
└── storage/         # AWS S3/Vercel Blob
```

**Ví dụ `services/deepseek/api.ts`:**
```ts
import { createOpenAI } from '@ai-sdk/openai';

export const deepseek = createOpenAI({
  baseURL: 'https://api.deepseek.com/v1',
  apiKey: process.env.DEEPSEEK_API_KEY,
  defaultHeaders: {
    'Content-Type': 'application/json'
  }
});
```

---

### **6. Thư mục `types` - Định nghĩa TypeScript**
```bash
/types
├── database.d.ts    # Prisma types
├── ai.d.ts          # Kiểu dữ liệu AI
└── custom.d.ts      # Custom types
```

**Ví dụ `types/custom.d.ts`:**
```ts
declare global {
  type UserRole = 'student' | 'teacher' | 'admin';
  
  interface Classroom {
    id: string;
    members: UserRole[];
    aiAssistantEnabled: boolean;
  }
}
```

---

### **7. Thư mục `errors` - Xử lý lỗi tập trung**
```bash
/errors
├── http.ts          # Lỗi HTTP
├── database.ts      # Lỗi DB
└── ai.ts            # Lỗi AI service
```

**Ví dụ `errors/ai.ts`:**
```ts
export class AIResponseError extends Error {
  constructor(
    public readonly code: string,
    message: string
  ) {
    super(`[AI-${code}] ${message}`);
  }
}
```

---

### **Tích hợp với Server Actions**
Cấu trúc này hoạt động hài hòa với server actions:
```ts
// lib/server-actions/courses/create.ts
import prisma from '@/lib/db';
import { CourseSchema } from '@/lib/utils/validators/course';
import { handleServerError } from '@/lib/errors/http';

export async function createCourse(formData: FormData) {
  try {
    const data = CourseSchema.parse(Object.fromEntries(formData));
    const course = await prisma.course.create({ data });
    return course;
  } catch (error) {
    return handleServerError(error);
  }
}
```

---

### **Lợi ích chính**
- **Tách biệt mối quan tâm**: Mỗi thư mục giải quyết một phạm vi cụ thể
- **Tái sử dụng code**: Dễ dàng import qua alias `@/lib`
- **Bảo trì dễ dàng**: Thay đổi dịch vụ bên ngoài mà không ảnh hưởng logic chính
- **An toàn type**: TypeScript hỗ trợ xuyên suốt

**Pro tip**: Thêm `.npmrc` để optimize package imports:
```ini
# .npmrc
public-hoist-pattern[]=*@types*
```

Bạn cần mình giải thích thêm về phần nào không? 😊



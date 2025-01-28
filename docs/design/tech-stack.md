### **Core Stack**
| Category          | Technology                                                                 | Why?                                                                                                                                                                                                 |
|--------------------|----------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Frontend**       | Next.js (App Router) + TypeScript + Tailwind CSS                           | - Type safety with TypeScript<br>- Built-in API routes for backend logic<br>- Server-side rendering for SEO<br>- Tailwind for rapid UI development                                                   |
| **Backend**        | Next.js API Routes + Prisma                                                | - Keep full-stack in a single framework<br>- Prisma for type-safe database operations                                                                                                               |
| **Database**       | PostgreSQL (Supabase)                                                     | - Relational structure fits educational data<br>- Supabase adds real-time capabilities + auth<br>- Free tier suitable for early stages                                                              |
| **AI/ML**          | Python (FastAPI) + LangChain + OpenAI/Hugging Face                         | - Separate microservice for AI features<br>- LangChain for question filtering/analysis<br>- OpenAI for quick NLP implementation                                                                     |
| **Realtime**       | Supabase Realtime/Socket.io                                                | - Supabase has built-in realtime for DB changes<br>- Socket.io for custom chat/notification systems                                                                                                 |
| **Authentication** | NextAuth.js + Supabase Auth                                                | - Support for social logins + school credentials<br>- Role-based access control (teachers/students)                                                                                                 |
| **State Management** | Zustand + React Query                                                     | - Lightweight client-side state<br>- Server-state management with caching                                                                                                                           |

---

### **Key Integrations**
| Feature                  | Solution                                                                   | Why?                                                                                                                                                                                                 |
|--------------------------|----------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Payment System**       | Stripe/VNPay                                                              | - Stripe for international payments<br>- VNPay for local Vietnam transactions                                                                                                                       |
| **File Storage**         | AWS S3/Cloudflare R2                                                      | - Affordable cloud storage for course videos<br>- CDN integration for global access                                                                                                                  |
| **Notifications**        | Novu/Resend                                                               | - Multi-channel notifications (email/in-app)                                                                                                                                                        |
| **Analytics**            | Metabase (self-hosted)                                                    | - Open-source business intelligence<br>- Custom dashboards for teacher analytics                                                                                                                    |
| **CI/CD**                | GitHub Actions + Vercel                                                   | - Automatic deployments from main branch<br>- Preview deployments for PRs                                                                                                                           |

---

### **Recommended Libraries**
1. **Forms**: React Hook Form + Zod (type-safe validation)
2. **Rich Text Editor**: TipTap (collaborative editing capabilities)
3. **UI Components**: Shadcn/ui (accessible, customizable components)
4. **Data Visualization**: Recharts (for student progress dashboards)
5. **Testing**: Jest + React Testing Library + Playwright (E2E testing)

---

### **AI Implementation Strategy**
1. **Question Filtering**:
   - Use LangChain to create question clusters
   - Implement priority scoring based on:
     ```ts
     type QuestionPriority = {
       frequency: number // How many students asked similar questions
       complexity: number // NLP analysis of question depth
       student_rank: number // Asker's performance history
     }
     ```
2. **Recommendation System**:
   - Collaborative filtering for course suggestions
   - Vector embeddings for content-based recommendations

---

### **Infrastructure Diagram**
```
                          ┌──────────────┐
                          │   Next.js    │
                          │  (Frontend)  │
                          └──────┬───────┘
                                 │
                          ┌──────▼───────┐
                          │ Next.js API  │
                          │   (BFF)      │
                          └──────┬───────┘
                   ┌─────────────┴─────────────┐
         ┌─────────▼─────────┐       ┌─────────▼─────────┐
         │    Supabase       │       │   AI Microservice │
         │ (PostgreSQL + Auth)       │  (Python/FastAPI) │
         └─────────┬─────────┘       └─────────┬─────────┘
                   │                           │
         ┌─────────▼─────────┐       ┌─────────▼─────────┐
         │ Cloud Storage     │       │   ML Models       │
         │ (S3/R2)           │       │ (Hugging Face)    │
         └───────────────────┘       └───────────────────┘
```

---

### **Migration Path**
1. **Phase 1 (MVP)**:
   - Next.js + Supabase (free tier)
   - Basic Q&A system without AI
   - Manual student grouping

2. **Phase 2 (Scale)**:
   - Add AI microservice
   - Implement payment system
   - Introduce real-time features

3. **Phase 3 (Optimization)**:
   - Add analytics dashboards
   - Implement advanced recommendation engine
   - Localize for Vietnam (i18n, VNPay integration)

---

### **Key Considerations**
1. **Vietnam-Specific**:
   - Localize date/time formats
   - Integrate with popular Vietnamese social logins
   - Optimize for mobile-first usage

2. **Performance**:
   - Implement ISR for course pages
   - Use CDN for video content
   - Database indexing for student progress tracking

3. **Security**:
   - Role-based access control (RBAC)
   - Data encryption at rest/in-transit
   - Regular security audits (OWASP Top 10)

This stack balances development speed (using your existing Next.js knowledge) with scalability. Start with Supabase's free tier to validate your concept, then gradually add the AI components as you gain traction.

### **Next.js Ecosystem**

- **Auth.js**
- **Playwright**
- **React Hook Form**
- **Zod validation**
- **Mock Service Worker**
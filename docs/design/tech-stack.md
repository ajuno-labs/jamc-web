# Tech Stack

## **Core Stack**

**Frontend**: Next.js (App Router) + TypeScript + Tailwind CSS  
- Type safety with TypeScript  
- Built-in API routes for backend logic  
- Server-side rendering for SEO  
- Tailwind for rapid UI development  
- Parallel routes for RBAC

**Backend**: Next.js API Routes/Server Actions + ZenStack + Prisma  
- Keep full-stack in a single framework  
- Prisma for type-safe database operations  

**Database**: PostgreSQL + Supabase  
- Relational structure fits educational data  
- Supabase adds real-time capabilities + auth  
- Free tier suitable for early stages  

**AI/ML**: Python (FastAPI) + LangChain + OpenAI/Hugging Face  
- Separate microservice for AI features  
- LangChain for question filtering/analysis  
- OpenAI for quick NLP implementation  

**Realtime**: Supabase Realtime/Socket.io  
- Supabase has built-in realtime for DB changes  
- Socket.io for custom chat/notification systems  

**Authentication**: Auth.js  
- Support for social logins + school credentials  
- Role-based access control (teachers/students)  

**State Management**: Zustand + React Query  
- Lightweight client-side state  
- Server-state management with caching  

---

### **Key Integrations**

**Payment System**: Stripe/VNPay  
- Stripe for international payments  
- VNPay for local Vietnam transactions  

**File Storage**: AWS S3/Cloudflare R2  
- Affordable cloud storage for course videos  
- CDN integration for global access  

**Notifications**: Novu/Resend  
- Multi-channel notifications (email/in-app)  

**Analytics**: Metabase (self-hosted)  
- Open-source business intelligence  
- Custom dashboards for teacher analytics  

**CI/CD**: GitHub Actions + Vercel  
- Automatic deployments from main branch  
- Preview deployments for PRs  

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
       frequency: number; // How many students asked similar questions
       complexity: number; // NLP analysis of question depth
       student_rank: number; // Asker's performance history
     };
     ```  
2. **Recommendation System**:  
   - Collaborative filtering for course suggestions  
   - Vector embeddings for content-based recommendations  

---

### **Infrastructure Diagram**

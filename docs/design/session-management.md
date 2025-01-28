Here's how to **access user session data in client components** with Next.js and Auth.js (NextAuth), along with best practices for security and TypeScript:

---

### **1. Client Component Setup**
Use the `useSession` hook from `next-auth/react`:

```tsx
'use client'
import { useSession } from "next-auth/react"

export default function UserProfile() {
  const { data: session, status } = useSession()

  if (status === "loading") {
    return <p>Loading...</p>
  }

  if (!session?.user) {
    return <p>Not authenticated</p>
  }

  return (
    <div>
      <p>Email: {session.user.email}</p>
      <p>Name: {session.user.name}</p>
      <p>Role: {session.user.role}</p> {/* Custom property */}
    </div>
  )
}
```

---

### **2. Required Setup**
#### **A. Session Provider**  
Wrap your app in `SessionProvider` (required for client components):

```tsx
// app/layout.tsx
import { SessionProvider } from "next-auth/react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <SessionProvider>
          {children}
        </SessionProvider>
      </body>
    </html>
  )
}
```

#### **B. Type Safety (Optional but Recommended)**  
Extend the session type in `auth.d.ts`:

```ts
// auth.d.ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
}
```

---

### **3. Access Patterns**

| Scenario | Server Components | Client Components |
|----------|--------------------|--------------------|
| **Get Session** | `await auth()` | `useSession()` |
| **Sign In** | `redirect('/api/auth/signin')` | `signIn('google')` |
| **Sign Out** | `redirect('/api/auth/signout')` | `signOut()` |

---

### **4. Security Considerations**
1. **Never Expose Sensitive Data**  
   Only expose what's needed to the client:
   ```ts
   // auth.ts
   callbacks: {
     async session({ session, token }) {
       // ✅ Safe to expose
       session.user.id = token.sub
       // ❌ Avoid exposing
       session.user.sensitiveData = token.internalData
       return session
     }
   }
   ```

2. **Validate Client-Side Actions**  
   Always verify permissions server-side:
   ```ts
   // app/api/admin/route.ts
   export async function POST() {
     const session = await auth()
     if (session?.user.role !== "admin") {
       return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
     }
     // Proceed with admin action
   }
   ```

---

### **5. Common Mistakes**
1. **Missing SessionProvider**  
   Error: `useSession must be wrapped in a SessionProvider`

2. **Direct Async Calls in Client Components**  
   ❌ Wrong:
   ```tsx
   // app/client-component.tsx
   const session = await auth() // Fails - client component
   ```
   ✅ Correct:
   ```tsx
   // app/client-component.tsx
   const { data: session } = useSession()
   ```

---

### **Alternative: Pass Session via Props**
If you need initial session data from server components:

```tsx
// app/page.tsx (Server Component)
import { auth } from "@/auth"

export default async function Home() {
  const session = await auth()
  return <ClientComponent session={session} />
}
```

```tsx
// app/ClientComponent.tsx
'use client'
export default function ClientComponent({ session }: { session: Session | null }) {
  // Use session passed from parent
}
```

---

This setup ensures secure, type-safe access to user sessions while leveraging Next.js 14's hybrid rendering capabilities. For real-time updates, combine with WebSocket/Socket.io if needed.
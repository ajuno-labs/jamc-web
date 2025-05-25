import { SessionProvider } from "next-auth/react"
import { Header } from "@/components/layout/header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { auth } from "@/auth"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SessionProvider>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <AppSidebar />
          <div className="flex-1 overflow-auto">
            <Header user={session?.user} />
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </SidebarProvider>
    </SessionProvider>
  )
}

import { SessionProvider } from "next-auth/react"
import { Header } from "@/components/layout/header"
import { auth } from "@/auth"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()

  return (
    <SessionProvider>
      <div className="relative flex min-h-screen flex-col">
        <Header user={session?.user} />
        <main className="flex-1">{children}</main>
      </div>
    </SessionProvider>
  )
}

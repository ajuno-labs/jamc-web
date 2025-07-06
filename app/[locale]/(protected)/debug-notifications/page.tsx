import { getAuthUser } from "@/lib/auth/get-user"
import { redirect } from "@/i18n/navigation"
import { DebugNotificationActions } from "./_components/DebugNotificationActions"
import { getLocale } from "next-intl/server";

export default async function DebugNotificationsPage() {
  const locale = await getLocale();
  const user = await getAuthUser()
  
  if (!user) {
    redirect({
      href: "/signin",
      locale,
    });
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Debug Notifications</h1>
        <p className="text-muted-foreground">Test the notification system functionality</p>
      </div>
      
      <DebugNotificationActions userId={user.id} />
    </div>
  )
} 

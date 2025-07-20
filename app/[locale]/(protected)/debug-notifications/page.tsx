import { getCurrentUser } from "@/lib/auth/user";
import { DebugNotificationActions } from "./_components/DebugNotificationActions";

export default async function DebugNotificationsPage() {
  const user = await getCurrentUser();

  return (
    <div className="container max-w-4xl py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Debug Notifications</h1>
        <p className="text-muted-foreground">Test the notification system functionality</p>
      </div>
      <DebugNotificationActions userId={user.id} />
    </div>
  );
}

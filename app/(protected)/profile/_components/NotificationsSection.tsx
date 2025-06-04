import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserNotifications } from "@/lib/services/notification-service";
import { NotificationItem } from "./NotificationItem";

export async function NotificationsSection() {
  try {
    const result = await getUserNotifications(undefined, { limit: 5 });
    const notifications = result.notifications;

    return (
      <Card>
        <CardHeader>
          <CardTitle>Recent Notifications</CardTitle>
          <CardDescription>Latest activity on your content</CardDescription>
        </CardHeader>

        <CardContent>
          {notifications.length === 0 ? (
            <div className="flex flex-col gap-4 items-center justify-center py-6 text-center">
              <p className="text-muted-foreground">
                You have no new notifications.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <NotificationItem key={notification.id} notification={notification} />
              ))}
              {notifications.length >= 5 && (
                <div className="pt-2 text-center">
                  <p className="text-sm text-muted-foreground">
                    View all notifications in the notification bell above
                  </p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    );
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Recent activity on your content</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 items-center justify-center py-6 text-center">
            <p className="text-muted-foreground">
              Error loading notifications.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }
} 
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function NotificationsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Recent activity on your content</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4 items-center justify-center py-6 text-center">
          <p className="text-muted-foreground">
            You have no new notifications.
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 
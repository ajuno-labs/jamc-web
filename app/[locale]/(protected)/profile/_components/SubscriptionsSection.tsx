import { Link } from "@/i18n/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function SubscriptionsSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Subscriptions</CardTitle>
        <CardDescription>Topics and questions you follow</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4 items-center justify-center py-6 text-center">
          <p className="text-muted-foreground">
            You&apos;re not following any topics yet.
          </p>
          <Button variant="outline" asChild>
            <Link href="/explore">Explore Topics</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 
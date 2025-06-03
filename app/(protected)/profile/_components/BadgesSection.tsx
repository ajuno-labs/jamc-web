import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function BadgesSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Badges</CardTitle>
        <CardDescription>Achievements you&apos;ve earned</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-4 items-center justify-center py-6 text-center">
          <p className="text-muted-foreground">
            You haven&apos;t earned any badges yet.
          </p>
          <p className="text-sm text-muted-foreground">
            Continue participating to earn badges!
          </p>
        </div>
      </CardContent>
    </Card>
  );
} 
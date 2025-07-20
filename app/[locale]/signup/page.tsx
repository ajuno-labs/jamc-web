import { GraduationCap } from "lucide-react";
import { SignUpForm } from "./_components/signup-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

export default function SignUpPage() {
  const t = useTranslations("SignUpPage");

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <GraduationCap className="mx-auto h-12 w-12 text-primary" />
          <CardTitle className="text-3xl font-bold">{t("createAccount")}</CardTitle>
          <CardDescription>{t("joinCommunity")}</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <p className="text-xs text-muted-foreground">{t("termsOfService")}</p>
          <div className="text-center text-sm text-muted-foreground">
            {t("alreadyHaveAccount")}{" "}
            <Button variant="link" className="p-0 h-auto font-medium" asChild>
              <Link href="/signin">{t("signIn")}</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

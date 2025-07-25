import { redirect } from "@/i18n/navigation";
import { getLocale } from "next-intl/server";

export default async function RootPage() {

  const locale = await getLocale();

  redirect({
    href: {
      pathname: "/home",
    },
    locale
  });
}

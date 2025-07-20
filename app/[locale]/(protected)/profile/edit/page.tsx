import { ProfileEditForm } from "./components/ProfileEditForm";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { userWithRolesInclude, UserWithRoles } from "@/lib/types/prisma";
import { getCurrentUser } from "@/lib/auth/user";

export default async function EditProfilePage() {
  const user = (await getCurrentUser(userWithRolesInclude)) as unknown as UserWithRoles;
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="mb-6">
        <Button variant="ghost" asChild className="mb-4">
          <Link href="/profile">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Link>
        </Button>

        <h1 className="text-2xl font-bold">Edit Profile</h1>
        <p className="text-muted-foreground">Update your profile information and avatar</p>
      </div>

      <div className="space-y-6">
        <ProfileEditForm
          user={{
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
            createdAt: user.createdAt,
            roles: user.roles.map((role) => ({
              name: role.name,
              permissions: role.permissions.map((p) => p.name),
            })),
          }}
        />
      </div>
    </div>
  );
}

"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { updateUserRole } from "../../../_actions/profile-actions"
import { useRouter } from "@/i18n/navigation"
import { toast } from "sonner"

interface RoleSectionProps {
  user: {
    roles: Array<{
      name: string
      permissions: string[]
    }>
  }
}

export function RoleSection({ user }: RoleSectionProps) {
  const router = useRouter()
  const [isUpdatingRole, setIsUpdatingRole] = useState(false)
  
  const currentRole = user.roles[0]?.name?.toLowerCase() || ""
  const canSwitchRole = currentRole === "student" || currentRole === "teacher"

  const handleRoleChange = async (newRole: string) => {
    if (newRole === currentRole || !canSwitchRole) return
    
    setIsUpdatingRole(true)
    try {
      const result = await updateUserRole(newRole as "teacher" | "student")
      if (result.success) {
        toast.success("Role updated successfully!")
        router.refresh()
      } else {
        toast.error(result.error || "Failed to update role")
      }
    } catch (error) {
      console.error("Error updating role:", error)
      toast.error("An error occurred while updating role")
    } finally {
      setIsUpdatingRole(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Role & Permissions</CardTitle>
        <CardDescription>
          Your current role and the ability to switch between student and teacher
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Current Roles</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {user.roles.map((role) => (
              <Badge key={role.name} variant="secondary">
                {role.name}
              </Badge>
            ))}
          </div>
        </div>

        {canSwitchRole && (
          <div className="space-y-2">
            <Label>Switch Role</Label>
            <Select 
              value={currentRole} 
              onValueChange={handleRoleChange}
              disabled={isUpdatingRole}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="teacher">Teacher</SelectItem>
              </SelectContent>
            </Select>
            {isUpdatingRole && (
              <p className="text-sm text-muted-foreground">
                Updating role...
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

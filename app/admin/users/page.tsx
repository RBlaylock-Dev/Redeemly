import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/admin"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Shield, UserCog } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function UsersPage() {
  const admin = await requireAdmin()

  if (!admin) {
    redirect("/auth/login")
  }

  // Only super admins can manage users and roles
  if (admin.role !== "super_admin") {
    redirect("/admin")
  }

  const supabase = await createClient()

  // Fetch all users with their profiles and admin roles
  const { data: profiles } = await supabase.from("profiles").select("*").order("created_at", { ascending: false })

  const { data: adminRoles } = await supabase.from("admin_roles").select("*")

  // Create a map of user_id to admin role
  const adminRoleMap = new Map(adminRoles?.map((role) => [role.user_id, role]) || [])

  const getRoleBadgeVariant = (role: string | undefined) => {
    if (!role) return "secondary"
    if (role === "super_admin") return "destructive"
    if (role === "content_admin") return "default"
    return "outline"
  }

  const getRoleLabel = (role: string | undefined) => {
    if (!role) return "User"
    if (role === "super_admin") return "Super Admin"
    if (role === "content_admin") return "Content Admin"
    if (role === "moderator") return "Moderator"
    return "User"
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Users & Roles</h1>
        <p className="text-muted-foreground">Manage user accounts and admin permissions</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profiles?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admin Users</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminRoles?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Super Admins</CardTitle>
            <UserCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{adminRoles?.filter((r) => r.role === "super_admin").length || 0}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
          <CardDescription>View and manage user accounts and their roles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {profiles?.map((profile) => {
              const adminRole = adminRoleMap.get(profile.id)
              return (
                <div key={profile.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="font-medium text-foreground">{profile.display_name || "Anonymous User"}</p>
                        <p className="text-sm text-muted-foreground">
                          Joined {new Date(profile.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    {profile.bio && <p className="text-sm text-muted-foreground mt-2">{profile.bio}</p>}
                  </div>

                  <div className="flex items-center gap-3">
                    <Badge variant={getRoleBadgeVariant(adminRole?.role)}>{getRoleLabel(adminRole?.role)}</Badge>
                    <Button variant="outline" size="sm" disabled>
                      Manage
                    </Button>
                  </div>
                </div>
              )
            })}

            {!profiles || profiles.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No users found</div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Role Management</CardTitle>
          <CardDescription>Add or remove admin roles for users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg">
              <h3 className="font-medium mb-2">How to Add Admin Roles</h3>
              <p className="text-sm text-muted-foreground mb-3">
                To grant admin access to a user, run the following SQL script with their user ID:
              </p>
              <pre className="bg-background p-3 rounded text-xs overflow-x-auto">
                {`INSERT INTO admin_roles (user_id, role, granted_by)
VALUES ('USER_ID_HERE', 'content_admin', '${admin.user_id}');`}
              </pre>
              <p className="text-sm text-muted-foreground mt-3">
                Available roles: <code>super_admin</code>, <code>content_admin</code>, <code>moderator</code>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

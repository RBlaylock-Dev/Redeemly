import { requireAdmin } from "@/lib/admin"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { FileText, MessageSquare, BookOpen, Users } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AdminDashboard() {
  const admin = await requireAdmin()
  const supabase = await createClient()

  const { data: profile } = await supabase.from("profiles").select("display_name").eq("id", admin.id).single()

  // Get counts for dashboard stats
  const [resourcesCount, testimonialsCount, bibleStudiesCount, usersCount] = await Promise.all([
    supabase.from("resources").select("id", { count: "exact", head: true }),
    supabase.from("testimonials").select("id", { count: "exact", head: true }),
    supabase.from("bible_studies").select("id", { count: "exact", head: true }),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
  ])

  const stats = [
    {
      title: "Resources",
      value: resourcesCount.count || 0,
      icon: FileText,
      href: "/admin/resources",
    },
    {
      title: "Testimonials",
      value: testimonialsCount.count || 0,
      icon: MessageSquare,
      href: "/admin/testimonials",
    },
    {
      title: "Bible Studies",
      value: bibleStudiesCount.count || 0,
      icon: BookOpen,
      href: "/admin/bible-studies",
    },
    {
      title: "Users",
      value: usersCount.count || 0,
      icon: Users,
      href: "/admin/users",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {profile?.display_name || "Admin"}. You have {admin.role.replace("_", " ")} access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.title} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Activity tracking coming soon...</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex flex-col space-y-2">
              <a href="/admin/resources/new" className="text-primary hover:underline">
                Add New Resource
              </a>
              <a href="/admin/testimonials/new" className="text-primary hover:underline">
                Add New Testimony
              </a>
              <a href="/admin/bible-studies/new" className="text-primary hover:underline">
                Create Bible Study
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

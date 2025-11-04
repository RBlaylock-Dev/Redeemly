import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Heart, MessageCircle, Users, BookOpen, PlusCircle, User } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get recent posts
  const { data: recentPosts } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:author_id (display_name, journey_stage),
      post_reactions (reaction_type),
      comments (id)
    `)
    .order("created_at", { ascending: false })
    .limit(5)

  const { data: memberships } = await supabase.from("group_memberships").select("group_id").eq("user_id", user.id)

  // Then fetch the group details separately
  let userGroups = null
  if (memberships && memberships.length > 0) {
    const groupIds = memberships.map((m) => m.group_id)
    const { data: groups } = await supabase
      .from("support_groups")
      .select("id, name, group_type, description")
      .in("id", groupIds)

    userGroups = groups
  }

  const getJourneyStageColor = (stage: string) => {
    switch (stage) {
      case "questioning":
        return "bg-yellow-100 text-yellow-800"
      case "beginning":
        return "bg-blue-100 text-blue-800"
      case "progressing":
        return "bg-green-100 text-green-800"
      case "established":
        return "bg-purple-100 text-purple-800"
      case "mentor":
        return "bg-indigo-100 text-indigo-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatJourneyStage = (stage: string) => {
    switch (stage) {
      case "questioning":
        return "Questioning/Exploring"
      case "beginning":
        return "Just Beginning"
      case "progressing":
        return "Making Progress"
      case "established":
        return "Well Established"
      case "mentor":
        return "Ready to Mentor"
      default:
        return stage
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="text-xl font-bold text-slate-800">
                Redeemly
              </Link>
              <div className="hidden md:flex space-x-4">
                <Link href="/dashboard" className="text-sky-600 font-medium">
                  Dashboard
                </Link>
                <Link href="/community" className="text-slate-600 hover:text-slate-800">
                  Community
                </Link>
                <Link href="/messages" className="text-slate-600 hover:text-slate-800">
                  Messages
                </Link>
                <Link href="/resources" className="text-slate-600 hover:text-slate-800">
                  Resources
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/profile">
                <Button variant="outline" size="sm">
                  <User className="w-4 h-4 mr-2" />
                  Profile
                </Button>
              </Link>
              <form
                action={async () => {
                  "use server"
                  const supabase = await createClient()
                  await supabase.auth.signOut()
                  redirect("/")
                }}
              >
                <Button type="submit" variant="outline" size="sm">
                  Sign Out
                </Button>
              </form>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome back, {profile?.display_name || "Friend"}!</h1>
          <div className="flex items-center space-x-3">
            <Badge className={getJourneyStageColor(profile?.journey_stage || "")}>
              {formatJourneyStage(profile?.journey_stage || "")}
            </Badge>
            {profile?.is_mentor && <Badge className="bg-gold-100 text-gold-800">Mentor</Badge>}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <PlusCircle className="w-5 h-5 mr-2 text-sky-600" />
                  Share with Community
                </CardTitle>
                <CardDescription>What's on your heart today?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button asChild variant="outline" className="h-auto p-4 flex-col bg-transparent">
                    <Link href="/community/new-post?type=testimony">
                      <Heart className="w-6 h-6 mb-2 text-red-500" />
                      <span className="text-sm">Share Testimony</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4 flex-col bg-transparent">
                    <Link href="/community/new-post?type=prayer_request">
                      <BookOpen className="w-6 h-6 mb-2 text-purple-500" />
                      <span className="text-sm">Prayer Request</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4 flex-col bg-transparent">
                    <Link href="/community/new-post?type=encouragement">
                      <MessageCircle className="w-6 h-6 mb-2 text-green-500" />
                      <span className="text-sm">Encouragement</span>
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="h-auto p-4 flex-col bg-transparent">
                    <Link href="/community/new-post?type=question">
                      <Users className="w-6 h-6 mb-2 text-blue-500" />
                      <span className="text-sm">Ask Question</span>
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Recent Community Posts */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Community Posts</CardTitle>
                <CardDescription>See what others in the community are sharing</CardDescription>
              </CardHeader>
              <CardContent>
                {recentPosts && recentPosts.length > 0 ? (
                  <div className="space-y-4">
                    {recentPosts.map((post: any) => (
                      <div key={post.id} className="border-l-4 border-sky-200 pl-4 py-2">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium text-slate-800">
                              {post.is_anonymous ? "Anonymous" : post.profiles?.display_name}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {post.post_type.replace("_", " ")}
                            </Badge>
                            {!post.is_anonymous && (
                              <Badge className={`text-xs ${getJourneyStageColor(post.profiles?.journey_stage || "")}`}>
                                {formatJourneyStage(post.profiles?.journey_stage || "")}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-slate-500">
                            {new Date(post.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        {post.title && <h4 className="font-medium text-slate-800 mb-1">{post.title}</h4>}
                        <p className="text-slate-600 text-sm line-clamp-2">{post.content}</p>
                        <div className="flex items-center space-x-4 mt-2 text-xs text-slate-500">
                          <span>{post.post_reactions?.length || 0} reactions</span>
                          <span>{post.comments?.length || 0} comments</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-center py-8">No recent posts. Be the first to share!</p>
                )}
                <div className="mt-4">
                  <Button asChild variant="outline" className="w-full bg-transparent">
                    <Link href="/community">View All Community Posts</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Your Groups */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="w-5 h-5 mr-2 text-sky-600" />
                  Your Groups
                </CardTitle>
              </CardHeader>
              <CardContent>
                {userGroups && userGroups.length > 0 ? (
                  <div className="space-y-3">
                    {userGroups.map((group: any) => (
                      <div key={group.id} className="p-3 bg-slate-50 rounded-lg">
                        <h4 className="font-medium text-slate-800">{group.name}</h4>
                        <p className="text-sm text-slate-600 mt-1">{group.description}</p>
                        <Badge variant="secondary" className="mt-2 text-xs">
                          {group.group_type.replace("_", " ")}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-slate-500 text-sm">You haven't joined any groups yet.</p>
                )}
                <Button asChild variant="outline" className="w-full mt-4 bg-transparent">
                  <Link href="/community/groups">Browse Groups</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Quick Links */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link href="/bible-study">
                    <BookOpen className="w-4 h-4 mr-2" />
                    Bible Study
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link href="/resources">
                    <Heart className="w-4 h-4 mr-2" />
                    Recovery Resources
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link href="/testimonials">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Testimonials
                  </Link>
                </Button>
                <Button asChild variant="ghost" className="w-full justify-start">
                  <Link href="/contact">
                    <Users className="w-4 h-4 mr-2" />
                    Get Support
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

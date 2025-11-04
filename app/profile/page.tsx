import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { User, Edit, Calendar, MapPin, Heart } from "lucide-react"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Get user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  // Get user's posts count
  const { count: postsCount } = await supabase
    .from("posts")
    .select("*", { count: "exact", head: true })
    .eq("author_id", user.id)

  // Get user's groups count
  const { count: groupsCount } = await supabase
    .from("group_memberships")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)

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
                <Link href="/dashboard" className="text-slate-600 hover:text-slate-800">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center">
                    <User className="w-6 h-6 mr-2 text-sky-600" />
                    Your Profile
                  </CardTitle>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/profile/edit">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Basic Info */}
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-2">{profile?.display_name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mb-4">
                    <Badge className={getJourneyStageColor(profile?.journey_stage || "")}>
                      {formatJourneyStage(profile?.journey_stage || "")}
                    </Badge>
                    {profile?.is_mentor && <Badge className="bg-gold-100 text-gold-800">Mentor</Badge>}
                  </div>
                  {profile?.location && (
                    <div className="flex items-center text-slate-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      {profile.location}
                    </div>
                  )}
                  <div className="flex items-center text-slate-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    Joined {new Date(profile?.created_at || "").toLocaleDateString()}
                  </div>
                </div>

                {/* Bio */}
                {profile?.bio && (
                  <div>
                    <h4 className="font-semibold text-slate-800 mb-2">About Me</h4>
                    <p className="text-slate-600 leading-relaxed">{profile.bio}</p>
                  </div>
                )}

                {/* Account Info */}
                <div>
                  <h4 className="font-semibold text-slate-800 mb-2">Account Information</h4>
                  <div className="space-y-2 text-sm text-slate-600">
                    <div>
                      <span className="font-medium">Email:</span> {user.email}
                    </div>
                    <div>
                      <span className="font-medium">Account Status:</span>{" "}
                      <Badge variant={user.email_confirmed_at ? "default" : "secondary"}>
                        {user.email_confirmed_at ? "Verified" : "Pending Verification"}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Stats & Actions */}
          <div className="space-y-6">
            {/* Activity Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Posts Shared</span>
                  <span className="font-semibold text-slate-800">{postsCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Groups Joined</span>
                  <span className="font-semibold text-slate-800">{groupsCount || 0}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Member Since</span>
                  <span className="font-semibold text-slate-800">
                    {new Date(profile?.created_at || "").toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/community/new-post">
                    <Heart className="w-4 h-4 mr-2" />
                    Share Your Story
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/messages">
                    <User className="w-4 h-4 mr-2" />
                    Send Message
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/community/groups">
                    <User className="w-4 h-4 mr-2" />
                    Join Groups
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Privacy Notice */}
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Privacy & Safety</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your profile information is only visible to other community members. You can choose to post
                  anonymously at any time, and your personal information is always kept confidential.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

import { createClient } from "@/lib/supabase/server"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { Heart, MessageCircle, Users, PlusCircle, User, Play as Pray, HelpCircle } from "lucide-react"

export default async function CommunityPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Get community posts with author profiles and reactions
  const { data: posts } = await supabase
    .from("posts")
    .select(`
      *,
      profiles:author_id (display_name, journey_stage, is_mentor),
      post_reactions (reaction_type, user_id),
      comments (id)
    `)
    .order("created_at", { ascending: false })
    .limit(20)

  // Get support groups
  const { data: supportGroups } = await supabase
    .from("support_groups")
    .select(`
      *,
      profiles:created_by (display_name),
      group_memberships (id)
    `)
    .order("created_at", { ascending: false })

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
        return "Questioning"
      case "beginning":
        return "Beginning"
      case "progressing":
        return "Progressing"
      case "established":
        return "Established"
      case "mentor":
        return "Mentor"
      default:
        return stage
    }
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "testimony":
        return <Heart className="w-4 h-4 text-red-500" />
      case "prayer_request":
        return <Pray className="w-4 h-4 text-purple-500" />
      case "encouragement":
        return <MessageCircle className="w-4 h-4 text-green-500" />
      case "question":
        return <HelpCircle className="w-4 h-4 text-blue-500" />
      default:
        return <MessageCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const formatPostType = (type: string) => {
    return type.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-sky-50 to-indigo-100">
      <Navigation />
      <main className="flex-1">
        {/* Header */}
        <section className="py-16 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-balance text-slate-800">Community</h1>
              <p className="text-xl text-slate-600 text-pretty max-w-3xl mx-auto leading-relaxed">
                Connect with others on similar journeys. Share your story, find encouragement, and grow together in
                faith.
              </p>
              {user && (
                <div className="flex justify-center">
                  <Button asChild size="lg" className="bg-sky-600 hover:bg-sky-700">
                    <Link href="/community/new-post">
                      <PlusCircle className="w-5 h-5 mr-2" />
                      Share Your Story
                    </Link>
                  </Button>
                </div>
              )}
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content - Community Posts */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <MessageCircle className="w-5 h-5 mr-2 text-sky-600" />
                    Community Posts
                  </CardTitle>
                  <CardDescription>Stories, prayers, and encouragement from our community</CardDescription>
                </CardHeader>
                <CardContent>
                  {posts && posts.length > 0 ? (
                    <div className="space-y-6">
                      {posts.map((post: any) => (
                        <div key={post.id} className="border-l-4 border-sky-200 bg-white p-6 rounded-r-lg shadow-sm">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-sky-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-sky-600" />
                              </div>
                              <div>
                                <div className="flex items-center space-x-2">
                                  <span className="font-medium text-slate-800">
                                    {post.is_anonymous ? "Anonymous" : post.profiles?.display_name}
                                  </span>
                                  {!post.is_anonymous && (
                                    <>
                                      <Badge
                                        className={`text-xs ${getJourneyStageColor(post.profiles?.journey_stage || "")}`}
                                      >
                                        {formatJourneyStage(post.profiles?.journey_stage || "")}
                                      </Badge>
                                      {post.profiles?.is_mentor && (
                                        <Badge className="bg-gold-100 text-gold-800 text-xs">Mentor</Badge>
                                      )}
                                    </>
                                  )}
                                </div>
                                <div className="flex items-center space-x-2 text-xs text-slate-500">
                                  {getPostTypeIcon(post.post_type)}
                                  <span>{formatPostType(post.post_type)}</span>
                                  <span>•</span>
                                  <span>{new Date(post.created_at).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          </div>

                          {post.title && <h3 className="text-lg font-semibold text-slate-800 mb-3">{post.title}</h3>}

                          <p className="text-slate-700 leading-relaxed mb-4">{post.content}</p>

                          <div className="flex items-center space-x-6 text-sm text-slate-500">
                            <button className="flex items-center space-x-1 hover:text-sky-600 transition-colors">
                              <Heart className="w-4 h-4" />
                              <span>{post.post_reactions?.length || 0} reactions</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-sky-600 transition-colors">
                              <MessageCircle className="w-4 h-4" />
                              <span>{post.comments?.length || 0} comments</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                      <p className="text-slate-500 mb-4">No posts yet. Be the first to share!</p>
                      {user && (
                        <Button asChild>
                          <Link href="/community/new-post">Share Your Story</Link>
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Support Groups */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-sky-600" />
                    Support Groups
                  </CardTitle>
                  <CardDescription>Join groups for deeper connection</CardDescription>
                </CardHeader>
                <CardContent>
                  {supportGroups && supportGroups.length > 0 ? (
                    <div className="space-y-4">
                      {supportGroups.slice(0, 3).map((group: any) => (
                        <div key={group.id} className="p-4 bg-slate-50 rounded-lg">
                          <h4 className="font-medium text-slate-800 mb-1">{group.name}</h4>
                          <p className="text-sm text-slate-600 mb-2">{group.description}</p>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              {group.group_type.replace("_", " ")}
                            </Badge>
                            <span className="text-xs text-slate-500">
                              {group.group_memberships?.length || 0} members
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-slate-500 text-sm">No groups available yet.</p>
                  )}
                  <Button asChild variant="outline" className="w-full mt-4 bg-transparent">
                    <Link href="/community/groups">View All Groups</Link>
                  </Button>
                </CardContent>
              </Card>

              {/* Community Guidelines */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Community Guidelines</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="text-xs text-slate-600 space-y-2">
                    <li>• Treat everyone with respect and kindness</li>
                    <li>• Keep personal information confidential</li>
                    <li>• Share from your heart, listen with compassion</li>
                    <li>• No judgment - we're all on a journey</li>
                    <li>• Seek professional help when needed</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              {user && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <Button asChild variant="outline" className="w-full justify-start text-sm bg-transparent">
                      <Link href="/community/new-post?type=testimony">
                        <Heart className="w-4 h-4 mr-2" />
                        Share Testimony
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start text-sm bg-transparent">
                      <Link href="/community/new-post?type=prayer_request">
                        <Pray className="w-4 h-4 mr-2" />
                        Prayer Request
                      </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full justify-start text-sm bg-transparent">
                      <Link href="/messages">
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Send Message
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              )}

              {/* Sign Up CTA for non-authenticated users */}
              {!user && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Join Our Community</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs text-slate-600 mb-4">
                      Create an account to share your story, connect with others, and access exclusive resources.
                    </p>
                    <div className="space-y-2">
                      <Button asChild className="w-full" size="sm">
                        <Link href="/auth/sign-up">Join Community</Link>
                      </Button>
                      <Button asChild variant="outline" className="w-full bg-transparent" size="sm">
                        <Link href="/auth/login">Sign In</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

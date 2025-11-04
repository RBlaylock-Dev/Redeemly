"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Heart, Play as Pray, MessageCircle, HelpCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function NewPostPage() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [postType, setPostType] = useState("")
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }
      setUser(user)
    }
    getUser()

    // Set post type from URL params
    const typeParam = searchParams.get("type")
    if (typeParam) {
      setPostType(typeParam)
    }
  }, [supabase.auth, router, searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("posts").insert({
        title: title.trim() || null,
        content: content.trim(),
        post_type: postType,
        is_anonymous: isAnonymous,
        author_id: user.id,
      })

      if (error) throw error

      router.push("/community")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case "testimony":
        return <Heart className="w-5 h-5 text-red-500" />
      case "prayer_request":
        return <Pray className="w-5 h-5 text-purple-500" />
      case "encouragement":
        return <MessageCircle className="w-5 h-5 text-green-500" />
      case "question":
        return <HelpCircle className="w-5 h-5 text-blue-500" />
      default:
        return <MessageCircle className="w-5 h-5 text-gray-500" />
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-100">
      <Navigation />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <Button asChild variant="ghost" className="mb-4">
              <Link href="/community">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Community
              </Link>
            </Button>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Share with Community</h1>
            <p className="text-slate-600">
              Your story matters. Share your heart with others who understand your journey.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create New Post</CardTitle>
              <CardDescription>
                Share your testimony, ask for prayer, offer encouragement, or ask questions.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Post Type */}
                <div className="space-y-2">
                  <Label htmlFor="postType">Post Type</Label>
                  <Select value={postType} onValueChange={setPostType} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select post type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="testimony">
                        <div className="flex items-center space-x-2">
                          <Heart className="w-4 h-4 text-red-500" />
                          <span>Testimony</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="prayer_request">
                        <div className="flex items-center space-x-2">
                          <Pray className="w-4 h-4 text-purple-500" />
                          <span>Prayer Request</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="encouragement">
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4 text-green-500" />
                          <span>Encouragement</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="question">
                        <div className="flex items-center space-x-2">
                          <HelpCircle className="w-4 h-4 text-blue-500" />
                          <span>Question</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="resource">
                        <div className="flex items-center space-x-2">
                          <MessageCircle className="w-4 h-4 text-blue-500" />
                          <span>Resource</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Title (Optional) */}
                <div className="space-y-2">
                  <Label htmlFor="title">Title (Optional)</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="Give your post a title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="border-slate-200 focus:border-sky-500"
                  />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <Label htmlFor="content">Your Message</Label>
                  <Textarea
                    id="content"
                    placeholder="Share your heart... Your story, prayer request, encouragement, or question."
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="border-slate-200 focus:border-sky-500 min-h-[150px]"
                  />
                  <p className="text-xs text-slate-500">
                    Remember: This is a safe space. Share authentically and with compassion.
                  </p>
                </div>

                {/* Anonymous Option */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="anonymous"
                    checked={isAnonymous}
                    onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                  />
                  <Label htmlFor="anonymous" className="text-sm">
                    Post anonymously
                  </Label>
                </div>

                {error && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
                )}

                <div className="flex space-x-4">
                  <Button type="submit" disabled={isLoading} className="bg-sky-600 hover:bg-sky-700">
                    {isLoading ? "Sharing..." : "Share Post"}
                  </Button>
                  <Button asChild type="button" variant="outline">
                    <Link href="/community">Cancel</Link>
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Guidelines Reminder */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="text-sm">Community Guidelines Reminder</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm text-slate-600 space-y-1">
                <li>• Be respectful and kind to all community members</li>
                <li>• Keep personal information confidential</li>
                <li>• Share authentically from your heart</li>
                <li>• Avoid giving medical or legal advice</li>
                <li>• Report any concerning content to moderators</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Heart, MessageCircle, Send } from "lucide-react"
import Link from "next/link"

interface Post {
  id: string
  title: string
  content: string
  post_type: string
  created_at: string
  author: {
    id: string
    display_name: string
    journey_stage: string
  }
  likes_count: number
  comments_count: number
  user_liked: boolean
}

interface Comment {
  id: string
  content: string
  created_at: string
  author: {
    id: string
    display_name: string
    journey_stage: string
  }
}

export default function PostDetail() {
  const router = useRouter()
  const params = useParams()
  const postId = params.postId as string

  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [currentUser, setCurrentUser] = useState<any>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    async function loadPost() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      setCurrentUser(user)

      // Load post with author info and user's like status
      const { data: postData } = await supabase
        .from("posts")
        .select(`
          id,
          title,
          content,
          post_type,
          created_at,
          author:profiles!posts_author_id_fkey(id, display_name, journey_stage),
          likes:post_likes(count),
          comments:post_comments(count),
          user_likes:post_likes!inner(user_id)
        `)
        .eq("id", postId)
        .eq("user_likes.user_id", user.id)
        .single()

      if (postData) {
        setPost({
          ...postData,
          likes_count: postData.likes?.[0]?.count || 0,
          comments_count: postData.comments?.[0]?.count || 0,
          user_liked: postData.user_likes?.length > 0,
        })
      }

      // Load comments
      const { data: commentsData } = await supabase
        .from("post_comments")
        .select(`
          id,
          content,
          created_at,
          author:profiles!post_comments_author_id_fkey(id, display_name, journey_stage)
        `)
        .eq("post_id", postId)
        .order("created_at", { ascending: true })

      if (commentsData) {
        setComments(commentsData)
      }

      setLoading(false)
    }

    loadPost()
  }, [postId])

  const handleLike = async () => {
    if (!currentUser || !post) return

    try {
      if (post.user_liked) {
        // Unlike
        await supabase.from("post_likes").delete().eq("post_id", postId).eq("user_id", currentUser.id)

        setPost((prev) =>
          prev
            ? {
                ...prev,
                likes_count: prev.likes_count - 1,
                user_liked: false,
              }
            : null,
        )
      } else {
        // Like
        await supabase.from("post_likes").insert({
          post_id: postId,
          user_id: currentUser.id,
        })

        setPost((prev) =>
          prev
            ? {
                ...prev,
                likes_count: prev.likes_count + 1,
                user_liked: true,
              }
            : null,
        )
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !currentUser || submitting) return

    setSubmitting(true)

    try {
      const { data, error } = await supabase
        .from("post_comments")
        .insert({
          post_id: postId,
          author_id: currentUser.id,
          content: newComment.trim(),
        })
        .select(`
          id,
          content,
          created_at,
          author:profiles!post_comments_author_id_fkey(id, display_name, journey_stage)
        `)
        .single()

      if (error) throw error

      setComments((prev) => [...prev, data])
      setNewComment("")

      // Update comments count
      setPost((prev) =>
        prev
          ? {
              ...prev,
              comments_count: prev.comments_count + 1,
            }
          : null,
      )
    } catch (error) {
      console.error("Error adding comment:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString([], {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">Loading post...</div>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">Post not found</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6">
          <Link href="/community" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Community
          </Link>
        </div>

        {/* Post */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback>{post.author.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{post.author.display_name}</h3>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Badge variant="outline" className="text-xs">
                      {post.author.journey_stage.replace("_", " ")}
                    </Badge>
                    <span>•</span>
                    <span>{formatDate(post.created_at)}</span>
                  </div>
                </div>
              </div>
              <Badge variant="secondary">{post.post_type.replace("_", " ")}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <h1 className="text-2xl font-bold mb-4">{post.title}</h1>
            <div className="prose prose-sm max-w-none mb-6">
              <p className="whitespace-pre-wrap">{post.content}</p>
            </div>

            <div className="flex items-center space-x-4 pt-4 border-t">
              <Button
                variant={post.user_liked ? "default" : "ghost"}
                size="sm"
                onClick={handleLike}
                className="flex items-center space-x-2"
              >
                <Heart className={`w-4 h-4 ${post.user_liked ? "fill-current" : ""}`} />
                <span>{post.likes_count}</span>
              </Button>

              <div className="flex items-center space-x-2 text-muted-foreground">
                <MessageCircle className="w-4 h-4" />
                <span>{post.comments_count} comments</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Comments */}
        <Card>
          <CardHeader>
            <h2 className="text-lg font-semibold">Comments</h2>
          </CardHeader>
          <CardContent>
            {/* Add Comment Form */}
            <form onSubmit={handleComment} className="mb-6">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts or encouragement..."
                rows={3}
                className="mb-3"
              />
              <Button type="submit" disabled={submitting || !newComment.trim()}>
                <Send className="w-4 h-4 mr-2" />
                {submitting ? "Posting..." : "Post Comment"}
              </Button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {comments.length === 0 ? (
                <p className="text-muted-foreground text-center py-4">
                  No comments yet. Be the first to share your thoughts!
                </p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="flex space-x-3 p-4 bg-accent/20 rounded-lg">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="text-xs">
                        {comment.author.display_name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-semibold text-sm">{comment.author.display_name}</span>
                        <Badge variant="outline" className="text-xs">
                          {comment.author.journey_stage.replace("_", " ")}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{formatDate(comment.created_at)}</span>
                      </div>
                      <p className="text-sm whitespace-pre-wrap">{comment.content}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

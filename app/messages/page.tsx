"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MessageCircle, Search, Plus } from "lucide-react"
import Link from "next/link"

interface Conversation {
  id: string
  other_user: {
    id: string
    display_name: string
    journey_stage: string
  }
  last_message: {
    content: string
    created_at: string
    sender_id: string
  }
  unread_count: number
}

export default function Messages() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    async function loadConversations() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      // Get conversations with last message and unread count
      const { data: conversationsData } = await supabase
        .from("messages")
        .select(`
          id,
          sender_id,
          receiver_id,
          content,
          created_at,
          sender:profiles!messages_sender_id_fkey(id, display_name, journey_stage),
          receiver:profiles!messages_receiver_id_fkey(id, display_name, journey_stage)
        `)
        .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
        .order("created_at", { ascending: false })

      // Group by conversation and get latest message
      const conversationMap = new Map()

      conversationsData?.forEach((message) => {
        const otherUserId = message.sender_id === user.id ? message.receiver_id : message.sender_id
        const otherUser = message.sender_id === user.id ? message.receiver : message.sender

        if (!conversationMap.has(otherUserId)) {
          conversationMap.set(otherUserId, {
            id: otherUserId,
            other_user: otherUser,
            last_message: {
              content: message.content,
              created_at: message.created_at,
              sender_id: message.sender_id,
            },
            unread_count: 0,
          })
        }
      })

      setConversations(Array.from(conversationMap.values()))
      setLoading(false)
    }

    loadConversations()
  }, [])

  const filteredConversations = conversations.filter((conv) =>
    conv.other_user.display_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInHours < 168) {
      // 7 days
      return date.toLocaleDateString([], { weekday: "short" })
    } else {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">Loading messages...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Messages</h1>
            <p className="text-muted-foreground mt-2">Connect privately with community members</p>
          </div>
          <Link href="/community">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Find People
            </Button>
          </Link>
        </div>

        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
              <p className="text-muted-foreground mb-4">
                Start connecting with community members to begin conversations
              </p>
              <Link href="/community">
                <Button>Browse Community</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conversation) => (
              <Link key={conversation.id} href={`/messages/${conversation.id}`}>
                <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-4">
                      <Avatar>
                        <AvatarFallback>{conversation.other_user.display_name.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold truncate">{conversation.other_user.display_name}</h3>
                          <span className="text-sm text-muted-foreground">
                            {formatTime(conversation.last_message.created_at)}
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-1">
                          <p className="text-sm text-muted-foreground truncate">{conversation.last_message.content}</p>
                          {conversation.unread_count > 0 && (
                            <Badge variant="default" className="ml-2">
                              {conversation.unread_count}
                            </Badge>
                          )}
                        </div>

                        <Badge variant="outline" className="mt-2 text-xs">
                          {conversation.other_user.journey_stage.replace("_", " ")}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

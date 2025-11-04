"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Send } from "lucide-react"
import Link from "next/link"

interface Message {
  id: string
  content: string
  sender_id: string
  created_at: string
  sender: {
    display_name: string
  }
}

interface UserProfile {
  id: string
  display_name: string
  journey_stage: string
  bio: string
}

export default function ChatPage() {
  const router = useRouter()
  const params = useParams()
  const userId = params.userId as string

  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [otherUser, setOtherUser] = useState<UserProfile | null>(null)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    async function loadChat() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      setCurrentUser(user)

      // Load other user's profile
      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (profileData) {
        setOtherUser(profileData)
      }

      // Load messages
      const { data: messagesData } = await supabase
        .from("messages")
        .select(`
          id,
          content,
          sender_id,
          created_at,
          sender:profiles!messages_sender_id_fkey(display_name)
        `)
        .or(
          `and(sender_id.eq.${user.id},receiver_id.eq.${userId}),and(sender_id.eq.${userId},receiver_id.eq.${user.id})`,
        )
        .order("created_at", { ascending: true })

      if (messagesData) {
        setMessages(messagesData)
      }

      setLoading(false)
    }

    loadChat()
  }, [userId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || !currentUser || sending) return

    setSending(true)

    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          content: newMessage.trim(),
          sender_id: currentUser.id,
          receiver_id: userId,
        })
        .select(`
          id,
          content,
          sender_id,
          created_at,
          sender:profiles!messages_sender_id_fkey(display_name)
        `)
        .single()

      if (error) throw error

      setMessages((prev) => [...prev, data])
      setNewMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setSending(false)
    }
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 py-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center">Loading conversation...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50">
      <div className="container mx-auto px-4 max-w-4xl h-screen flex flex-col">
        {/* Header */}
        <div className="py-4 border-b bg-background/80 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <Link href="/messages">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>

            <Avatar>
              <AvatarFallback>{otherUser?.display_name.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>

            <div>
              <h2 className="font-semibold">{otherUser?.display_name}</h2>
              <Badge variant="outline" className="text-xs">
                {otherUser?.journey_stage.replace("_", " ")}
              </Badge>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center text-muted-foreground py-8">
              <p>Start your conversation with {otherUser?.display_name}</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender_id === currentUser?.id ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender_id === currentUser?.id
                      ? "bg-primary text-primary-foreground"
                      : "bg-background border"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender_id === currentUser?.id ? "text-primary-foreground/70" : "text-muted-foreground"
                    }`}
                  >
                    {formatTime(message.created_at)}
                  </p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="py-4 border-t bg-background/80 backdrop-blur-sm">
          <form onSubmit={sendMessage} className="flex space-x-2">
            <Input
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={sending}
              className="flex-1"
            />
            <Button type="submit" disabled={sending || !newMessage.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}

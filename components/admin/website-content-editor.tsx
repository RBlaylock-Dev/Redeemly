"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, Save } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface WebsiteContentEditorProps {
  content: any[]
}

export function WebsiteContentEditor({ content }: WebsiteContentEditorProps) {
  const supabase = createClient()
  const [loading, setLoading] = useState<string | null>(null)
  const [contentData, setContentData] = useState(content)

  const updateContent = (id: string, newContent: any) => {
    setContentData((prev) => prev.map((item) => (item.id === id ? { ...item, content: newContent } : item)))
  }

  const saveContent = async (item: any) => {
    setLoading(item.id)
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("website_content")
        .update({
          content: item.content,
          updated_by: user.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", item.id)

      if (error) throw error

      alert("Content saved successfully!")
    } catch (error) {
      console.error("Error saving content:", error)
      alert("Error saving content. Please try again.")
    } finally {
      setLoading(null)
    }
  }

  if (contentData.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground mb-4">No website content sections found.</p>
          <p className="text-sm text-muted-foreground">Run the seed script to create initial content sections.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {contentData.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{item.page_section}</span>
              <Button size="sm" onClick={() => saveContent(item)} disabled={loading === item.id}>
                {loading === item.id ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Save className="mr-2 h-4 w-4" />
                )}
                Save
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={typeof item.content === "string" ? item.content : JSON.stringify(item.content, null, 2)}
              onChange={(e) => {
                try {
                  const parsed = JSON.parse(e.target.value)
                  updateContent(item.id, parsed)
                } catch {
                  updateContent(item.id, e.target.value)
                }
              }}
              placeholder="Enter content as JSON..."
              rows={10}
              className="font-mono text-sm"
            />
            <p className="text-xs text-muted-foreground">
              Last updated: {item.updated_at ? new Date(item.updated_at).toLocaleString() : "Never"}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

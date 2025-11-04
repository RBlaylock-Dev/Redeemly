"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface TestimonialFormProps {
  testimonial?: any
  isEditing?: boolean
}

export function TestimonialForm({ testimonial, isEditing = false }: TestimonialFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: testimonial?.title || "",
    content: testimonial?.content || "",
    author_name: testimonial?.author_name || "",
    author_location: testimonial?.author_location || "",
    is_anonymous: testimonial?.is_anonymous || false,
    is_featured: testimonial?.is_featured || false,
    is_published: testimonial?.is_published ?? true,
    image_url: testimonial?.image_url || "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const testimonialData = {
        ...formData,
        created_by: user.id,
        updated_at: new Date().toISOString(),
      }

      if (isEditing) {
        const { error } = await supabase.from("testimonials").update(testimonialData).eq("id", testimonial.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("testimonials").insert([testimonialData])

        if (error) throw error
      }

      router.push("/admin/testimonials")
      router.refresh()
    } catch (error) {
      console.error("Error saving testimonial:", error)
      alert("Error saving testimonial. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Testimonial Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., From Darkness to Light: My Journey Back to Christ"
              required
            />
          </div>

          <div>
            <Label htmlFor="content">Testimonial Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Share the full story of transformation..."
              rows={10}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="author_name">Author Name</Label>
              <Input
                id="author_name"
                value={formData.author_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, author_name: e.target.value }))}
                placeholder="First name or initials"
                disabled={formData.is_anonymous}
              />
            </div>

            <div>
              <Label htmlFor="author_location">Location</Label>
              <Input
                id="author_location"
                value={formData.author_location}
                onChange={(e) => setFormData((prev) => ({ ...prev, author_location: e.target.value }))}
                placeholder="City, State or Country"
                disabled={formData.is_anonymous}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="image_url">Image URL (Optional)</Label>
            <Input
              id="image_url"
              value={formData.image_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, image_url: e.target.value }))}
              placeholder="https://example.com/image.jpg"
              type="url"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_anonymous">Anonymous Testimonial</Label>
              <p className="text-sm text-muted-foreground">Hide author name and location</p>
            </div>
            <Switch
              id="is_anonymous"
              checked={formData.is_anonymous}
              onCheckedChange={(checked) => {
                setFormData((prev) => ({
                  ...prev,
                  is_anonymous: checked,
                  author_name: checked ? "" : prev.author_name,
                  author_location: checked ? "" : prev.author_location,
                }))
              }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_featured">Featured Testimonial</Label>
              <p className="text-sm text-muted-foreground">Show this testimonial prominently</p>
            </div>
            <Switch
              id="is_featured"
              checked={formData.is_featured}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_featured: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_published">Published</Label>
              <p className="text-sm text-muted-foreground">Make this testimonial visible to users</p>
            </div>
            <Switch
              id="is_published"
              checked={formData.is_published}
              onCheckedChange={(checked) => setFormData((prev) => ({ ...prev, is_published: checked }))}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? "Update Testimonial" : "Create Testimonial"}
        </Button>
      </div>
    </form>
  )
}

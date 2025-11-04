"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface ResourceFormProps {
  resource?: any
  isEditing?: boolean
}

export function ResourceForm({ resource, isEditing = false }: ResourceFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: resource?.title || "",
    description: resource?.description || "",
    category: resource?.category || "guide",
    is_featured: resource?.is_featured || false,
    is_published: resource?.is_published ?? true,
    file_url: resource?.file_url || "",
    file_name: resource?.file_name || "",
    file_size: resource?.file_size || 0,
    file_type: resource?.file_type || "",
  })

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `resources/${fileName}`

      const { error: uploadError } = await supabase.storage.from("resources").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("resources").getPublicUrl(filePath)

      setFormData((prev) => ({
        ...prev,
        file_url: publicUrl,
        file_name: file.name,
        file_size: file.size,
        file_type: file.type,
      }))
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Error uploading file. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const resourceData = {
        ...formData,
        created_by: user.id,
        updated_at: new Date().toISOString(),
      }

      if (isEditing) {
        const { error } = await supabase.from("resources").update(resourceData).eq("id", resource.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("resources").insert([resourceData])

        if (error) throw error
      }

      router.push("/admin/resources")
      router.refresh()
    } catch (error) {
      console.error("Error saving resource:", error)
      alert("Error saving resource. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Resource Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="category">Category *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bible_study">Bible Study</SelectItem>
                <SelectItem value="testimony">Testimony</SelectItem>
                <SelectItem value="guide">Guide</SelectItem>
                <SelectItem value="book">Book</SelectItem>
                <SelectItem value="audio">Audio</SelectItem>
                <SelectItem value="video">Video</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="file">Upload File</Label>
            <div className="mt-2">
              <Input
                id="file"
                type="file"
                onChange={handleFileUpload}
                disabled={uploading}
                accept=".pdf,.doc,.docx,.mp3,.mp4,.zip,.epub"
              />
              {uploading && (
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </div>
              )}
            </div>
          </div>

          {formData.file_name && (
            <div className="text-sm text-muted-foreground">Current file: {formData.file_name}</div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_featured">Featured Resource</Label>
              <p className="text-sm text-muted-foreground">Show this resource prominently</p>
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
              <p className="text-sm text-muted-foreground">Make this resource visible to users</p>
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
          {isEditing ? "Update Resource" : "Create Resource"}
        </Button>
      </div>
    </form>
  )
}

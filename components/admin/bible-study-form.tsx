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
import { Badge } from "@/components/ui/badge"
import { Loader2, Plus, X } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface BibleStudyFormProps {
  bibleStudy?: any
  isEditing?: boolean
}

export function BibleStudyForm({ bibleStudy, isEditing = false }: BibleStudyFormProps) {
  const router = useRouter()
  const supabase = createClient()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: bibleStudy?.title || "",
    description: bibleStudy?.description || "",
    content: bibleStudy?.content || "",
    scripture_references: bibleStudy?.scripture_references || [],
    lesson_number: bibleStudy?.lesson_number || "",
    series_name: bibleStudy?.series_name || "",
    difficulty_level: bibleStudy?.difficulty_level || "beginner",
    estimated_duration: bibleStudy?.estimated_duration || "",
    is_published: bibleStudy?.is_published ?? true,
  })

  const [newReference, setNewReference] = useState("")

  const addScriptureReference = () => {
    if (newReference.trim()) {
      setFormData((prev) => ({
        ...prev,
        scripture_references: [...prev.scripture_references, newReference.trim()],
      }))
      setNewReference("")
    }
  }

  const removeScriptureReference = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      scripture_references: prev.scripture_references.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const studyData = {
        ...formData,
        lesson_number: formData.lesson_number ? Number.parseInt(formData.lesson_number) : null,
        estimated_duration: formData.estimated_duration ? Number.parseInt(formData.estimated_duration) : null,
        created_by: user.id,
        updated_at: new Date().toISOString(),
      }

      if (isEditing) {
        const { error } = await supabase.from("bible_studies").update(studyData).eq("id", bibleStudy.id)

        if (error) throw error
      } else {
        const { error } = await supabase.from("bible_studies").insert([studyData])

        if (error) throw error
      }

      router.push("/admin/bible-studies")
      router.refresh()
    } catch (error) {
      console.error("Error saving Bible study:", error)
      alert("Error saving Bible study. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Study Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="e.g., Understanding God's Love and Grace"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              placeholder="Brief overview of what this study covers..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="series_name">Series Name</Label>
              <Input
                id="series_name"
                value={formData.series_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, series_name: e.target.value }))}
                placeholder="e.g., Walking in Faith"
              />
            </div>

            <div>
              <Label htmlFor="lesson_number">Lesson Number</Label>
              <Input
                id="lesson_number"
                type="number"
                value={formData.lesson_number}
                onChange={(e) => setFormData((prev) => ({ ...prev, lesson_number: e.target.value }))}
                placeholder="1"
                min="1"
              />
            </div>

            <div>
              <Label htmlFor="estimated_duration">Duration (minutes)</Label>
              <Input
                id="estimated_duration"
                type="number"
                value={formData.estimated_duration}
                onChange={(e) => setFormData((prev) => ({ ...prev, estimated_duration: e.target.value }))}
                placeholder="30"
                min="1"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="difficulty_level">Difficulty Level</Label>
            <Select
              value={formData.difficulty_level}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, difficulty_level: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scripture References</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newReference}
              onChange={(e) => setNewReference(e.target.value)}
              placeholder="e.g., John 3:16, Romans 8:28"
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addScriptureReference())}
            />
            <Button type="button" onClick={addScriptureReference}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {formData.scripture_references.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.scripture_references.map((ref, index) => (
                <Badge key={index} variant="outline" className="flex items-center gap-1">
                  {ref}
                  <button
                    type="button"
                    onClick={() => removeScriptureReference(index)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Study Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="content">Content *</Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
              placeholder="Write the full Bible study content here. Include questions, reflections, and practical applications..."
              rows={15}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              You can use markdown formatting for better presentation.
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="is_published">Published</Label>
              <p className="text-sm text-muted-foreground">Make this Bible study visible to users</p>
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
          {isEditing ? "Update Bible Study" : "Create Bible Study"}
        </Button>
      </div>
    </form>
  )
}

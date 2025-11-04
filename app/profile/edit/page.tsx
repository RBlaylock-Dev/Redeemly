"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createBrowserClient } from "@supabase/ssr"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"

export default function EditProfile() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState({
    display_name: "",
    bio: "",
    journey_stage: "",
    location: "",
    interests: "",
  })

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      const { data: profileData } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      if (profileData) {
        setProfile({
          display_name: profileData.display_name || "",
          bio: profileData.bio || "",
          journey_stage: profileData.journey_stage || "",
          location: profileData.location || "",
          interests: profileData.interests || "",
        })
      }
    }

    loadProfile()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: profile.display_name,
          bio: profile.bio,
          journey_stage: profile.journey_stage,
          location: profile.location,
          interests: profile.interests,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (error) throw error

      router.push("/profile")
    } catch (error) {
      console.error("Error updating profile:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="mb-6">
          <Link href="/profile" className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Profile
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Edit Profile</h1>
          <p className="text-muted-foreground mt-2">Update your profile information to help others connect with you</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Share what feels comfortable to help build meaningful connections in our community
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="display_name">Display Name</Label>
                <Input
                  id="display_name"
                  value={profile.display_name}
                  onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                  placeholder="How would you like to be known?"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="journey_stage">Journey Stage</Label>
                <Select
                  value={profile.journey_stage}
                  onValueChange={(value) => setProfile({ ...profile, journey_stage: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Where are you in your journey?" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="questioning">Questioning</SelectItem>
                    <SelectItem value="early_journey">Early in Journey</SelectItem>
                    <SelectItem value="active_transition">Active Transition</SelectItem>
                    <SelectItem value="established_faith">Established in Faith</SelectItem>
                    <SelectItem value="mentor">Mentor/Helper</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profile.bio}
                  onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  placeholder="Share a bit about yourself and your journey..."
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location (Optional)</Label>
                <Input
                  id="location"
                  value={profile.location}
                  onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                  placeholder="City, State (helps find local connections)"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="interests">Interests & Hobbies</Label>
                <Input
                  id="interests"
                  value={profile.interests}
                  onChange={(e) => setProfile({ ...profile, interests: e.target.value })}
                  placeholder="Reading, hiking, music, etc."
                />
              </div>

              <Button type="submit" disabled={loading} className="w-full">
                <Save className="w-4 h-4 mr-2" />
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

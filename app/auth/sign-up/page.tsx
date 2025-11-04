"use client"

import type React from "react"

import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [repeatPassword, setRepeatPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [bio, setBio] = useState("")
  const [journeyStage, setJourneyStage] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()
    setIsLoading(true)
    setError(null)

    if (password !== repeatPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
          data: {
            display_name: displayName,
            bio: bio,
            journey_stage: journeyStage,
          },
        },
      })
      if (error) throw error
      router.push("/auth/sign-up-success")
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-indigo-100 p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl border-0">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl font-bold text-slate-800">Join Our Community</CardTitle>
            <CardDescription className="text-slate-600">
              Create your account to connect with others on a similar journey
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-slate-700">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-slate-200 focus:border-sky-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="displayName" className="text-slate-700">
                  Display Name
                </Label>
                <Input
                  id="displayName"
                  type="text"
                  placeholder="How you'd like to be known"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="border-slate-200 focus:border-sky-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="journeyStage" className="text-slate-700">
                  Where are you in your journey?
                </Label>
                <Select value={journeyStage} onValueChange={setJourneyStage} required>
                  <SelectTrigger className="border-slate-200 focus:border-sky-500">
                    <SelectValue placeholder="Select your current stage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="questioning">Questioning/Exploring</SelectItem>
                    <SelectItem value="beginning">Just Beginning</SelectItem>
                    <SelectItem value="progressing">Making Progress</SelectItem>
                    <SelectItem value="established">Well Established</SelectItem>
                    <SelectItem value="mentor">Ready to Mentor Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio" className="text-slate-700">
                  Brief Introduction (Optional)
                </Label>
                <Textarea
                  id="bio"
                  placeholder="Share a little about yourself and your journey..."
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="border-slate-200 focus:border-sky-500 min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-slate-700">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-slate-200 focus:border-sky-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="repeatPassword" className="text-slate-700">
                  Confirm Password
                </Label>
                <Input
                  id="repeatPassword"
                  type="password"
                  required
                  value={repeatPassword}
                  onChange={(e) => setRepeatPassword(e.target.value)}
                  className="border-slate-200 focus:border-sky-500"
                />
              </div>
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">{error}</div>
              )}
              <Button type="submit" className="w-full bg-sky-600 hover:bg-sky-700 text-white" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <p className="text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  href="/auth/login"
                  className="text-sky-600 hover:text-sky-700 font-medium underline underline-offset-4"
                >
                  Sign in here
                </Link>
              </p>
              <p className="mt-2 text-sm text-slate-600">
                <Link href="/" className="text-slate-500 hover:text-slate-700 underline underline-offset-4">
                  Return to homepage
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

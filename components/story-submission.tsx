"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { Send, Heart, Shield } from "lucide-react"

export function StorySubmission() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Story submitted successfully",
      description: "Thank you for sharing your testimony. It will be reviewed before publication.",
    })

    setIsSubmitting(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Heart className="h-5 w-5 text-primary" />
          <span>Share Your Story</span>
        </CardTitle>
        <CardDescription>
          Your testimony could encourage others on their journey. Share how God has worked in your life.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="submitterName">Your Name *</Label>
            <Input id="submitterName" required />
            <p className="text-xs text-muted-foreground">
              This can be your first name only or a pseudonym if you prefer
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address *</Label>
            <Input id="email" type="email" required />
            <p className="text-xs text-muted-foreground">For verification purposes only, not published</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="storyCategory">Story Category</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="transformation">Life Transformation</SelectItem>
                <SelectItem value="healing">Healing Journey</SelectItem>
                <SelectItem value="community">Community Support</SelectItem>
                <SelectItem value="growth">Spiritual Growth</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="timeframe">How long has it been since your transformation began?</Label>
            <Select required>
              <SelectTrigger>
                <SelectValue placeholder="Select timeframe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Less than 6 months</SelectItem>
                <SelectItem value="year">6 months - 1 year</SelectItem>
                <SelectItem value="years">1-3 years</SelectItem>
                <SelectItem value="longtime">3+ years</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="testimony">Your Story *</Label>
            <Textarea
              id="testimony"
              placeholder="Share your journey of transformation, healing, or growth in Christ..."
              className="min-h-[200px]"
              required
            />
            <p className="text-xs text-muted-foreground">
              Please focus on God's work in your life and how it might encourage others
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="anonymous" />
              <Label htmlFor="anonymous" className="text-sm">
                I prefer to remain anonymous (first name or initials only)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="contact" />
              <Label htmlFor="contact" className="text-sm">
                I'm open to being contacted by others who might benefit from my story
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="consent" required />
              <Label htmlFor="consent" className="text-sm">
                I consent to my story being shared on this website to encourage others *
              </Label>
            </div>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg">
            <div className="flex items-start space-x-2">
              <Shield className="h-4 w-4 text-primary mt-0.5" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium mb-1">Privacy & Review Process:</p>
                <ul className="space-y-1">
                  <li>• All stories are reviewed before publication</li>
                  <li>• Personal details are kept confidential</li>
                  <li>• You can request removal at any time</li>
                  <li>• Stories may be edited for length and clarity</li>
                </ul>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              "Submitting..."
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Story
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

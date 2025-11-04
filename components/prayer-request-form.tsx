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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { Heart, Send, Lock } from "lucide-react"

export function PrayerRequestForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Prayer request submitted",
      description: "Your request has been received and will be lifted up in prayer.",
    })

    setIsSubmitting(false)
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      {/* Prayer Request Form */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Heart className="h-5 w-5 text-primary" />
              <span>Submit a Prayer Request</span>
            </CardTitle>
            <CardDescription>
              Share your prayer needs with our caring community. All requests are kept confidential.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="requestorName">Your Name (Optional)</Label>
                <Input id="requestorName" placeholder="You can remain anonymous" />
                <p className="text-xs text-muted-foreground">Leave blank if you prefer to submit anonymously</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" type="email" placeholder="For prayer updates (optional)" />
              </div>

              <div className="space-y-3">
                <Label>Prayer Request Type</Label>
                <RadioGroup defaultValue="personal" className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="personal" id="personal" />
                    <Label htmlFor="personal" className="text-sm">
                      Personal Request
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="others" id="others" />
                    <Label htmlFor="others" className="text-sm">
                      For Others
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="praise" id="praise" />
                    <Label htmlFor="praise" className="text-sm">
                      Praise Report
                    </Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="guidance" id="guidance" />
                    <Label htmlFor="guidance" className="text-sm">
                      Seeking Guidance
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="space-y-2">
                <Label htmlFor="urgency">Urgency Level</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select urgency level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="routine">Routine Prayer</SelectItem>
                    <SelectItem value="urgent">Urgent Need</SelectItem>
                    <SelectItem value="crisis">Crisis Situation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="prayerRequest">Prayer Request *</Label>
                <Textarea
                  id="prayerRequest"
                  placeholder="Please share your prayer request..."
                  className="min-h-[150px]"
                  required
                />
                <p className="text-xs text-muted-foreground">Share as much or as little as you're comfortable with</p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="ongoing" />
                  <Label htmlFor="ongoing" className="text-sm">
                    This is an ongoing prayer need
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="updates" />
                  <Label htmlFor="updates" className="text-sm">
                    I would like to receive prayer updates and encouragement
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox id="share" />
                  <Label htmlFor="share" className="text-sm">
                    I'm comfortable with this request being shared with our prayer team
                  </Label>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Submitting..."
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Submit Prayer Request
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Prayer Information Sidebar */}
      <div className="space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center space-x-2">
              <Lock className="h-4 w-4" />
              <span>Confidential & Safe</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>All prayer requests are:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Kept completely confidential</li>
              <li>• Handled with care and respect</li>
              <li>• Prayed over by our prayer team</li>
              <li>• Never shared without permission</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">How We Pray</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>Our prayer team commits to:</p>
            <ul className="space-y-1 text-muted-foreground">
              <li>• Daily prayer for all requests</li>
              <li>• Following up on ongoing needs</li>
              <li>• Celebrating answered prayers</li>
              <li>• Providing encouragement</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Scripture Promise</CardTitle>
          </CardHeader>
          <CardContent>
            <blockquote className="text-sm italic text-muted-foreground border-l-4 border-primary pl-4">
              "Therefore confess your sins to each other and pray for each other so that you may be healed. The prayer
              of a righteous person is powerful and effective."
              <footer className="mt-2 text-xs">— James 5:16</footer>
            </blockquote>
          </CardContent>
        </Card>

        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="pt-6">
            <p className="text-sm text-center">
              <strong>Need immediate prayer?</strong>
              <br />
              Call our prayer line at <span className="font-medium text-accent">1-800-NEW-HOPE</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

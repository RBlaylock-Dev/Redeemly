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
import { Send, Phone, Mail, MapPin } from "lucide-react"

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    toast({
      title: "Message sent successfully",
      description: "Thank you for reaching out. We'll get back to you within 24 hours.",
    })

    setIsSubmitting(false)
  }

  return (
    <div className="grid lg:grid-cols-2 gap-8">
      {/* Contact Form */}
      <Card>
        <CardHeader>
          <CardTitle>Get in Touch</CardTitle>
          <CardDescription>
            We're here to support you. Send us a message and we'll respond within 24 hours.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input id="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number (Optional)</Label>
              <Input id="phone" type="tel" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">How can we help you? *</Label>
              <Select required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a topic" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General Questions</SelectItem>
                  <SelectItem value="support">Need Support</SelectItem>
                  <SelectItem value="mentorship">Mentorship Inquiry</SelectItem>
                  <SelectItem value="community">Join Community</SelectItem>
                  <SelectItem value="resources">Resource Request</SelectItem>
                  <SelectItem value="crisis">Crisis Support</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                placeholder="Please share how we can support you..."
                className="min-h-[120px]"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="confidential" />
              <Label htmlFor="confidential" className="text-sm">
                I understand that all communications are confidential and handled with care
              </Label>
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                "Sending..."
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>Multiple ways to reach our support team</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Mail className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">support@newhope.org</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Phone className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Crisis Hotline</p>
                <p className="text-sm text-muted-foreground">1-800-NEW-HOPE (24/7)</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-medium">Location</p>
                <p className="text-sm text-muted-foreground">Online & Confidential</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Response Times</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span className="text-sm">General Inquiries</span>
              <span className="text-sm text-muted-foreground">Within 24 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Support Requests</span>
              <span className="text-sm text-muted-foreground">Within 4 hours</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm">Crisis Support</span>
              <span className="text-sm text-muted-foreground">Immediate</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-accent/5 border-accent/20">
          <CardContent className="pt-6">
            <p className="text-sm text-center">
              <strong>Need immediate help?</strong>
              <br />
              Call our 24/7 crisis hotline at <span className="font-medium text-accent">1-800-NEW-HOPE</span>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

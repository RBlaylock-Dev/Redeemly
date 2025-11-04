"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ContactForm } from "@/components/contact-form"
import { PrayerRequestForm } from "@/components/prayer-request-form"
import { Button } from "@/components/ui/button"
import { MessageCircle, Heart } from "lucide-react"

export default function ContactPage() {
  const [activeTab, setActiveTab] = useState<"contact" | "prayer">("contact")

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Header */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-balance">We're Here for You</h1>
              <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
                Whether you need support, have questions, or want to share a prayer request, our caring team is ready to
                help you on your journey.
              </p>
            </div>
          </div>
        </section>

        {/* Tab Navigation */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-center space-x-4">
              <Button
                variant={activeTab === "contact" ? "default" : "outline"}
                onClick={() => setActiveTab("contact")}
                className="flex items-center space-x-2"
              >
                <MessageCircle className="h-4 w-4" />
                <span>Contact Us</span>
              </Button>
              <Button
                variant={activeTab === "prayer" ? "default" : "outline"}
                onClick={() => setActiveTab("prayer")}
                className="flex items-center space-x-2"
              >
                <Heart className="h-4 w-4" />
                <span>Prayer Request</span>
              </Button>
            </div>
          </div>
        </section>

        {/* Form Content */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {activeTab === "contact" ? <ContactForm /> : <PrayerRequestForm />}
          </div>
        </section>

        {/* Emergency Support */}
        <section className="py-12 bg-destructive/5 border-t border-destructive/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-bold text-destructive">Crisis Support Available 24/7</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                If you're in crisis or having thoughts of self-harm, please reach out immediately. You are not alone,
                and help is available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="destructive">
                  Call Crisis Hotline: 1-800-NEW-HOPE
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent">
                  National Suicide Prevention: 988
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

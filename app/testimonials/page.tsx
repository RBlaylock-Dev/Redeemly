"use client"

import { useState } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { TestimonialCard } from "@/components/testimonial-card"
import { StorySubmission } from "@/components/story-submission"
import { Button } from "@/components/ui/button"
import { Heart, Users, BookOpen, Lightbulb, Plus } from "lucide-react"

// Sample testimonial data
const testimonials = [
  {
    id: 1,
    name: "Michael R.",
    story:
      "After years of struggling with my identity and feeling lost, I found this community through a friend. The mentorship program connected me with someone who truly understood my journey. Through biblical counseling and the support of this community, I've discovered who I am in Christ. The shame and confusion that once defined me have been replaced with peace and purpose. God's love has transformed my heart completely.",
    timeframe: "2 years ago",
    category: "transformation" as const,
    featured: true,
  },
  {
    id: 2,
    name: "Sarah M.",
    story:
      "The healing I've experienced through this ministry has been profound. I was carrying so much guilt and shame from my past, but through the resources and prayer support here, I've learned to receive God's forgiveness. The community has shown me what unconditional love looks like. I'm now able to help others who are walking a similar path of healing.",
    timeframe: "18 months ago",
    category: "healing" as const,
  },
  {
    id: 3,
    name: "David L.",
    story:
      "I was skeptical about joining any kind of support group, but the confidential nature and biblical foundation of this community drew me in. The weekly Bible studies have grounded me in truth, and the friendships I've formed here are genuine and supportive. I've grown more in my faith in the past year than I had in the previous decade.",
    timeframe: "1 year ago",
    category: "growth" as const,
  },
  {
    id: 4,
    name: "Jennifer K.",
    story:
      "Finding this community was an answer to prayer. I felt so alone in my struggle until I connected with others who understood. The support group became my lifeline during the darkest period of my journey. Now I'm able to offer hope to newcomers and share how God's grace has sustained me through every challenge.",
    timeframe: "3 years ago",
    category: "community" as const,
    featured: true,
  },
  {
    id: 5,
    name: "Robert T.",
    story:
      "The transformation in my life has been nothing short of miraculous. Through the mentorship and biblical resources provided here, I've learned to see myself as God sees me. The identity crisis that plagued me for years has been resolved through understanding my worth in Christ. I now serve as a mentor to help others find the same freedom.",
    timeframe: "4 years ago",
    category: "transformation" as const,
  },
  {
    id: 6,
    name: "Lisa H.",
    story:
      "The prayer support I received during my most difficult season was incredible. This community prayed me through moments when I couldn't pray for myself. The healing process has been gradual but steady, and I've learned to trust God's timing. The relationships I've built here have become some of my most treasured friendships.",
    timeframe: "6 months ago",
    category: "healing" as const,
  },
]

const categories = [
  { value: "all", label: "All Stories", icon: BookOpen },
  { value: "transformation", label: "Transformation", icon: Heart },
  { value: "healing", label: "Healing", icon: Users },
  { value: "community", label: "Community", icon: Users },
  { value: "growth", label: "Growth", icon: Lightbulb },
]

export default function TestimonialsPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [showSubmissionForm, setShowSubmissionForm] = useState(false)

  const filteredTestimonials = testimonials.filter(
    (testimonial) => selectedCategory === "all" || testimonial.category === selectedCategory,
  )

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Header */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-balance">Stories of Hope</h1>
              <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
                Read inspiring testimonies from individuals who have found freedom, healing, and new life in Christ.
                Their stories demonstrate God's transforming power and love.
              </p>
            </div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="py-8 border-b border-border">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <Button
                  key={category.value}
                  variant={selectedCategory === category.value ? "default" : "outline"}
                  onClick={() => setSelectedCategory(category.value)}
                  className="flex items-center space-x-2"
                >
                  <category.icon className="h-4 w-4" />
                  <span>{category.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredTestimonials.map((testimonial) => (
                <TestimonialCard
                  key={testimonial.id}
                  name={testimonial.name}
                  story={testimonial.story}
                  timeframe={testimonial.timeframe}
                  category={testimonial.category}
                  featured={testimonial.featured}
                />
              ))}
            </div>

            {filteredTestimonials.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No stories found</h3>
                <p className="text-muted-foreground mb-4">Try selecting a different category</p>
                <Button variant="outline" onClick={() => setSelectedCategory("all")}>
                  View All Stories
                </Button>
              </div>
            )}
          </div>
        </section>

        {/* Share Your Story Section */}
        <section className="py-16 bg-muted/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">Share Your Story</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
                Your testimony could be the encouragement someone else needs to take their first step toward freedom.
                Share how God has worked in your life.
              </p>
              <Button
                size="lg"
                onClick={() => setShowSubmissionForm(!showSubmissionForm)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-5 w-5" />
                <span>{showSubmissionForm ? "Hide Form" : "Share Your Story"}</span>
              </Button>
            </div>

            {showSubmissionForm && (
              <div className="max-w-2xl mx-auto">
                <StorySubmission />
              </div>
            )}
          </div>
        </section>

        {/* Encouragement Section */}
        <section className="py-16 bg-primary/5">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-6">
              <h2 className="text-3xl font-bold">You Are Not Alone</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                These stories represent real people who have walked difficult paths and found hope in Christ. If you're
                struggling, know that transformation is possible and support is available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="px-8">
                  <Heart className="mr-2 h-5 w-5" />
                  Get Support Today
                </Button>
                <Button variant="outline" size="lg" className="px-8 bg-transparent">
                  <Users className="mr-2 h-5 w-5" />
                  Join Community
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

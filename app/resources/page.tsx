"use client"

import { useState, useMemo } from "react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { ResourceCard } from "@/components/resource-card"
import { ResourceFilter } from "@/components/resource-filter"
import { Button } from "@/components/ui/button"
import { BookOpen, Heart, Users, Lightbulb, Shield } from "lucide-react"

// Sample resource data
const resources = [
  {
    id: 1,
    title: "Understanding God's Design for Sexuality",
    description:
      "A comprehensive biblical study exploring God's original design for human sexuality and relationships, grounded in Scripture and Christian theology.",
    category: "Biblical Studies",
    type: "study" as const,
    duration: "45 min read",
    downloadUrl: "#",
  },
  {
    id: 2,
    title: "Freedom in Christ: Personal Testimonies",
    description:
      "Inspiring stories from individuals who have found freedom and new identity in Jesus Christ, sharing their journey of transformation.",
    category: "Testimonials",
    type: "article" as const,
    duration: "20 min read",
  },
  {
    id: 3,
    title: "Prayer and Spiritual Warfare",
    description:
      "Learn about the power of prayer in spiritual battles and how to stand firm in your faith during times of struggle and temptation.",
    category: "Spiritual Growth",
    type: "pdf" as const,
    duration: "30 min read",
    downloadUrl: "#",
  },
  {
    id: 4,
    title: "Building Healthy Relationships",
    description:
      "Practical guidance on developing Christ-centered relationships and friendships that support your spiritual growth and journey.",
    category: "Relationships",
    type: "video" as const,
    duration: "25 minutes",
    externalUrl: "#",
  },
  {
    id: 5,
    title: "Identity in Christ Devotional",
    description:
      "A 30-day devotional journey exploring who you are in Christ and how your identity is rooted in God's love and truth.",
    category: "Devotionals",
    type: "pdf" as const,
    duration: "Daily 10 min",
    downloadUrl: "#",
  },
  {
    id: 6,
    title: "Overcoming Shame and Guilt",
    description:
      "Understanding how Christ's forgiveness frees us from shame and guilt, and learning to walk in the freedom He provides.",
    category: "Healing",
    type: "audio" as const,
    duration: "35 minutes",
    externalUrl: "#",
  },
  {
    id: 7,
    title: "Biblical Counseling Principles",
    description:
      "Foundational principles of biblical counseling and how Scripture addresses the deepest needs of the human heart.",
    category: "Counseling",
    type: "study" as const,
    duration: "60 min read",
    downloadUrl: "#",
  },
  {
    id: 8,
    title: "Walking in the Spirit",
    description:
      "Practical steps for living a Spirit-filled life and allowing God's power to transform your thoughts, desires, and actions.",
    category: "Spiritual Growth",
    type: "article" as const,
    duration: "15 min read",
  },
  {
    id: 9,
    title: "Breaking Free from Addiction: A Biblical Approach",
    description:
      "Comprehensive guide to understanding addiction through a biblical lens and finding freedom through Christ's power and grace.",
    category: "Recovery",
    type: "study" as const,
    duration: "50 min read",
    downloadUrl: "#",
  },
  {
    id: 10,
    title: "The 12 Steps and Christian Faith",
    description:
      "How traditional 12-step recovery principles align with Christian beliefs and can be integrated into your Redeemly journey.",
    category: "Recovery",
    type: "pdf" as const,
    duration: "40 min read",
    downloadUrl: "#",
  },
  {
    id: 11,
    title: "Overcoming Substance Abuse: Testimonies of Hope",
    description:
      "Real stories from individuals who have overcome addiction through faith, showing that recovery and transformation are possible.",
    category: "Recovery",
    type: "video" as const,
    duration: "45 minutes",
    externalUrl: "#",
  },
  {
    id: 12,
    title: "Daily Recovery Devotional",
    description:
      "30-day devotional specifically designed for those in recovery, focusing on God's strength, healing, and daily renewal.",
    category: "Recovery",
    type: "pdf" as const,
    duration: "Daily 15 min",
    downloadUrl: "#",
  },
  {
    id: 13,
    title: "Understanding Triggers and Temptation",
    description:
      "Biblical strategies for identifying, understanding, and overcoming triggers that can lead to relapse or unhealthy behaviors.",
    category: "Recovery",
    type: "article" as const,
    duration: "25 min read",
  },
  {
    id: 14,
    title: "Building a Sober Support Network",
    description:
      "Practical guidance on creating healthy, Christ-centered relationships that support your recovery and spiritual growth.",
    category: "Recovery",
    type: "study" as const,
    duration: "35 min read",
    downloadUrl: "#",
  },
  {
    id: 15,
    title: "Healing from Trauma and Addiction",
    description:
      "Understanding the connection between trauma and addiction, and finding healing through God's love and professional support.",
    category: "Recovery",
    type: "audio" as const,
    duration: "55 minutes",
    externalUrl: "#",
  },
  {
    id: 16,
    title: "Recovery Resources Directory",
    description:
      "Comprehensive directory of Christian recovery programs, treatment centers, and support groups across the country.",
    category: "Recovery",
    type: "pdf" as const,
    duration: "Reference guide",
    downloadUrl: "#",
  },
  {
    id: 17,
    title: "Relapse Prevention Through Faith",
    description:
      "Biblical principles and practical strategies for maintaining sobriety and preventing relapse through spiritual disciplines.",
    category: "Recovery",
    type: "study" as const,
    duration: "45 min read",
    downloadUrl: "#",
  },
  {
    id: 18,
    title: "Family Recovery and Healing",
    description:
      "Resources for family members affected by addiction, including how to support loved ones while maintaining healthy boundaries.",
    category: "Recovery",
    type: "video" as const,
    duration: "40 minutes",
    externalUrl: "#",
  },
]

const categories = [...new Set(resources.map((r) => r.category))]
const types = [...new Set(resources.map((r) => r.type))]

export default function ResourcesPage() {
  const [filters, setFilters] = useState({
    search: "",
    categories: [] as string[],
    types: [] as string[],
  })

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        !filters.search ||
        resource.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        resource.description.toLowerCase().includes(filters.search.toLowerCase())

      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(resource.category)

      const matchesType = filters.types.length === 0 || filters.types.includes(resource.type)

      return matchesSearch && matchesCategory && matchesType
    })
  }, [filters])

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Header */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-balance">Resources for Your Redeemly Journey</h1>
              <p className="text-xl text-muted-foreground text-pretty max-w-3xl mx-auto leading-relaxed">
                Discover biblical resources, testimonies, and practical tools to support your walk with Christ and
                journey toward freedom and healing.
              </p>
            </div>
          </div>
        </section>

        {/* Resource Categories Overview */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-5 gap-6 mb-12">
              <div className="text-center space-y-3">
                <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto">
                  <BookOpen className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">Biblical Studies</h3>
                <p className="text-sm text-muted-foreground">Scripture-based teachings and studies</p>
              </div>
              <div className="text-center space-y-3">
                <div className="bg-accent/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto">
                  <Heart className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold">Healing & Growth</h3>
                <p className="text-sm text-muted-foreground">Resources for emotional and spiritual healing</p>
              </div>
              <div className="text-center space-y-3">
                <div className="bg-destructive/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto">
                  <Shield className="h-8 w-8 text-destructive" />
                </div>
                <h3 className="font-semibold">Recovery Support</h3>
                <p className="text-sm text-muted-foreground">Addiction recovery and sobriety resources</p>
              </div>
              <div className="text-center space-y-3">
                <div className="bg-primary/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold">Community Stories</h3>
                <p className="text-sm text-muted-foreground">Testimonies and shared experiences</p>
              </div>
              <div className="text-center space-y-3">
                <div className="bg-accent/10 w-16 h-16 rounded-lg flex items-center justify-center mx-auto">
                  <Lightbulb className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-semibold">Practical Tools</h3>
                <p className="text-sm text-muted-foreground">Devotionals, guides, and exercises</p>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Grid */}
        <section className="py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-4 gap-8">
              {/* Sidebar - Filters */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <ResourceFilter categories={categories} types={types} onFilterChange={setFilters} />
                </div>
              </div>

              {/* Main Content - Resource Grid */}
              <div className="lg:col-span-3">
                <div className="mb-6 flex items-center justify-between">
                  <p className="text-muted-foreground">
                    Showing {filteredResources.length} of {resources.length} resources
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {filteredResources.map((resource) => (
                    <ResourceCard
                      key={resource.id}
                      title={resource.title}
                      description={resource.description}
                      category={resource.category}
                      type={resource.type}
                      duration={resource.duration}
                      downloadUrl={resource.downloadUrl}
                      externalUrl={resource.externalUrl}
                    />
                  ))}
                </div>

                {filteredResources.length === 0 && (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No resources found</h3>
                    <p className="text-muted-foreground mb-4">Try adjusting your search or filter criteria</p>
                    <Button variant="outline" onClick={() => setFilters({ search: "", categories: [], types: [] })}>
                      Clear Filters
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

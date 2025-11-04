"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, Download } from "lucide-react"

interface StudyGuide {
  title: string
  description: string
  duration: string
  difficulty: "Beginner" | "Intermediate" | "Advanced"
  topics: string[]
  lessons: number
}

const studyGuides: StudyGuide[] = [
  {
    title: "Identity in Christ",
    description:
      "Discover who you are in God's eyes and how your identity is rooted in Christ, not in past experiences or struggles.",
    duration: "4 weeks",
    difficulty: "Beginner",
    topics: ["Identity", "Self-Worth", "God's Love"],
    lessons: 8,
  },
  {
    title: "Freedom from Bondage",
    description:
      "A biblical study on breaking free from spiritual, emotional, and physical bondages through Christ's power.",
    duration: "6 weeks",
    difficulty: "Intermediate",
    topics: ["Freedom", "Deliverance", "Spiritual Warfare"],
    lessons: 12,
  },
  {
    title: "Renewing Your Mind",
    description:
      "Learn how to transform your thinking patterns according to God's Word and develop a Christ-centered mindset.",
    duration: "5 weeks",
    difficulty: "Intermediate",
    topics: ["Mind Renewal", "Thought Life", "Scripture Meditation"],
    lessons: 10,
  },
  {
    title: "Walking in Purity",
    description:
      "Biblical principles for living a life of sexual purity and holiness, with practical steps for daily victory.",
    duration: "8 weeks",
    difficulty: "Advanced",
    topics: ["Purity", "Holiness", "Temptation"],
    lessons: 16,
  },
  {
    title: "Healing from Trauma",
    description: "A gentle, scripture-based approach to finding healing from past wounds and traumatic experiences.",
    duration: "10 weeks",
    difficulty: "Intermediate",
    topics: ["Healing", "Trauma Recovery", "God's Comfort"],
    lessons: 20,
  },
  {
    title: "Building Healthy Relationships",
    description: "Learn to form godly relationships and set healthy boundaries based on biblical principles.",
    duration: "6 weeks",
    difficulty: "Beginner",
    topics: ["Relationships", "Boundaries", "Community"],
    lessons: 12,
  },
]

export function StudyGuides() {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-800"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "Advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {studyGuides.map((guide, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg font-semibold text-primary leading-tight">{guide.title}</CardTitle>
              <Badge className={getDifficultyColor(guide.difficulty)}>{guide.difficulty}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground text-sm leading-relaxed">{guide.description}</p>

            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {guide.duration}
              </div>
              <div className="flex items-center gap-1">
                <BookOpen className="h-4 w-4" />
                {guide.lessons} lessons
              </div>
            </div>

            <div className="flex flex-wrap gap-1">
              {guide.topics.map((topic, topicIndex) => (
                <Badge key={topicIndex} variant="outline" className="text-xs">
                  {topic}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2 pt-2">
              <Button size="sm" className="flex-1">
                <BookOpen className="h-4 w-4 mr-1" />
                Start Study
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

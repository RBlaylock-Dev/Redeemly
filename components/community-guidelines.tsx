import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Heart, Users, Lock, MessageCircle, AlertTriangle } from "lucide-react"

export function CommunityGuidelines() {
  const guidelines = [
    {
      icon: Heart,
      title: "Love and Respect",
      description:
        "Treat all members with Christ-like love, kindness, and respect, regardless of where they are in their journey.",
    },
    {
      icon: Lock,
      title: "Confidentiality",
      description:
        "What is shared in our community stays in our community. Respect others' privacy and personal stories.",
    },
    {
      icon: Shield,
      title: "Safe Space",
      description: "We maintain a judgment-free environment where everyone can share openly and receive support.",
    },
    {
      icon: MessageCircle,
      title: "Constructive Communication",
      description: "Share with grace, listen with compassion, and offer biblical encouragement and support.",
    },
    {
      icon: Users,
      title: "Mutual Support",
      description: "We're here to support one another through prayer, encouragement, and practical help.",
    },
    {
      icon: AlertTriangle,
      title: "Appropriate Content",
      description: "Keep discussions focused on faith, healing, and growth. Avoid inappropriate or triggering content.",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-primary" />
          <span>Community Guidelines</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-4">
          {guidelines.map((guideline, index) => (
            <div key={index} className="flex items-start space-x-3">
              <div className="bg-primary/10 p-2 rounded-lg flex-shrink-0">
                <guideline.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="space-y-1">
                <h4 className="font-medium text-sm">{guideline.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{guideline.description}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

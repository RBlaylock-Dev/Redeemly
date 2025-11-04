import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Quote, Calendar } from "lucide-react"

interface TestimonialCardProps {
  name: string
  story: string
  timeframe: string
  category: "transformation" | "healing" | "community" | "growth"
  featured?: boolean
}

export function TestimonialCard({ name, story, timeframe, category, featured = false }: TestimonialCardProps) {
  const getCategoryColor = () => {
    switch (category) {
      case "transformation":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "healing":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "community":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "growth":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getCategoryLabel = () => {
    switch (category) {
      case "transformation":
        return "Life Transformation"
      case "healing":
        return "Healing Journey"
      case "community":
        return "Community Support"
      case "growth":
        return "Spiritual Growth"
      default:
        return "Testimony"
    }
  }

  return (
    <Card
      className={`h-full ${featured ? "border-primary/50 bg-primary/5" : ""} hover:shadow-lg transition-shadow duration-200`}
    >
      <CardContent className="p-6 space-y-4">
        <div className="flex items-start justify-between">
          <Badge className={`text-xs ${getCategoryColor()}`}>{getCategoryLabel()}</Badge>
          {featured && (
            <Badge variant="default" className="text-xs">
              Featured
            </Badge>
          )}
        </div>

        <div className="relative">
          <Quote className="absolute -top-2 -left-2 h-8 w-8 text-primary/20" />
          <blockquote className="text-muted-foreground leading-relaxed pl-6">{story}</blockquote>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="text-sm">
                {name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium text-sm">{name}</p>
              <div className="flex items-center space-x-1 text-xs text-muted-foreground">
                <Calendar className="h-3 w-3" />
                <span>{timeframe}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

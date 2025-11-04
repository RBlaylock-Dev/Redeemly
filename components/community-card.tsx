import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Users, Clock, MapPin, Lock, Calendar } from "lucide-react"

interface CommunityCardProps {
  title: string
  description: string
  type: "support-group" | "mentorship" | "study-group" | "prayer-group"
  schedule: string
  location: "online" | "in-person" | "hybrid"
  memberCount: number
  isPrivate?: boolean
  facilitator?: string
  nextMeeting?: string
}

export function CommunityCard({
  title,
  description,
  type,
  schedule,
  location,
  memberCount,
  isPrivate = false,
  facilitator,
  nextMeeting,
}: CommunityCardProps) {
  const getTypeColor = () => {
    switch (type) {
      case "support-group":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "mentorship":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "study-group":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "prayer-group":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  const getTypeLabel = () => {
    switch (type) {
      case "support-group":
        return "Support Group"
      case "mentorship":
        return "Mentorship"
      case "study-group":
        return "Bible Study"
      case "prayer-group":
        return "Prayer Group"
      default:
        return "Community"
    }
  }

  const getLocationIcon = () => {
    switch (location) {
      case "online":
        return "🌐"
      case "in-person":
        return "📍"
      case "hybrid":
        return "🔄"
      default:
        return "📍"
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <Badge className={`text-xs ${getTypeColor()}`}>{getTypeLabel()}</Badge>
          {isPrivate && (
            <Badge variant="secondary" className="text-xs">
              <Lock className="h-3 w-3 mr-1" />
              Private
            </Badge>
          )}
        </div>
        <CardTitle className="text-lg leading-tight">{title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4" />
            <span>{schedule}</span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4" />
            <span className="flex items-center space-x-1">
              <span>{getLocationIcon()}</span>
              <span className="capitalize">{location}</span>
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>{memberCount} members</span>
          </div>
          {nextMeeting && (
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span>Next: {nextMeeting}</span>
            </div>
          )}
        </div>

        {facilitator && (
          <div className="flex items-center space-x-3 pt-2 border-t border-border">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">
                {facilitator
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">Facilitated by</p>
              <p className="text-xs text-muted-foreground">{facilitator}</p>
            </div>
          </div>
        )}

        <Button className="w-full">{type === "mentorship" ? "Request Mentor" : "Join Group"}</Button>
      </CardContent>
    </Card>
  )
}

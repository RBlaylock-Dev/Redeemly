import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Download, ExternalLink, Clock } from "lucide-react"

interface ResourceCardProps {
  title: string
  description: string
  category: string
  type: "article" | "study" | "video" | "audio" | "pdf"
  duration?: string
  downloadUrl?: string
  externalUrl?: string
}

export function ResourceCard({
  title,
  description,
  category,
  type,
  duration,
  downloadUrl,
  externalUrl,
}: ResourceCardProps) {
  const getTypeIcon = () => {
    switch (type) {
      case "article":
      case "study":
        return <BookOpen className="h-4 w-4" />
      case "video":
        return <ExternalLink className="h-4 w-4" />
      case "audio":
        return <ExternalLink className="h-4 w-4" />
      case "pdf":
        return <Download className="h-4 w-4" />
      default:
        return <BookOpen className="h-4 w-4" />
    }
  }

  const getTypeColor = () => {
    switch (type) {
      case "article":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "study":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "video":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "audio":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300"
      case "pdf":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card className="h-full hover:shadow-lg transition-shadow duration-200">
      <CardHeader className="space-y-3">
        <div className="flex items-start justify-between">
          <Badge variant="secondary" className="text-xs">
            {category}
          </Badge>
          <Badge className={`text-xs ${getTypeColor()}`}>
            <span className="flex items-center space-x-1">
              {getTypeIcon()}
              <span className="capitalize">{type}</span>
            </span>
          </Badge>
        </div>
        <CardTitle className="text-lg leading-tight">{title}</CardTitle>
        <CardDescription className="text-sm leading-relaxed">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {duration && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{duration}</span>
          </div>
        )}
        <div className="flex space-x-2">
          {downloadUrl && (
            <Button size="sm" variant="default" className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          )}
          {externalUrl && (
            <Button size="sm" variant="outline" className="flex-1 bg-transparent">
              <ExternalLink className="h-4 w-4 mr-2" />
              View
            </Button>
          )}
          {!downloadUrl && !externalUrl && (
            <Button size="sm" variant="default" className="flex-1">
              <BookOpen className="h-4 w-4 mr-2" />
              Read
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

import { requireAdmin } from "@/lib/admin"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Download, Edit, Trash2, Star } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function ResourcesPage() {
  await requireAdmin("content_admin")
  const supabase = await createClient()

  const { data: resources, error } = await supabase
    .from("resources")
    .select(`
      *,
      profiles!resources_created_by_fkey (
        display_name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching resources:", error)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      bible_study: "bg-blue-100 text-blue-800",
      testimony: "bg-green-100 text-green-800",
      guide: "bg-purple-100 text-purple-800",
      book: "bg-orange-100 text-orange-800",
      audio: "bg-pink-100 text-pink-800",
      video: "bg-red-100 text-red-800",
      other: "bg-gray-100 text-gray-800",
    }
    return colors[category as keyof typeof colors] || colors.other
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Resources</h1>
          <p className="text-muted-foreground">Manage downloadable resources and content</p>
        </div>
        <Link href="/admin/resources/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Resource
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {resources?.map((resource) => (
          <Card key={resource.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{resource.title}</CardTitle>
                    {resource.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(resource.category)}>{resource.category.replace("_", " ")}</Badge>
                    {!resource.is_published && <Badge variant="secondary">Draft</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/resources/${resource.id}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="outline" size="sm" className="text-destructive bg-transparent">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {resource.description && <p className="text-muted-foreground">{resource.description}</p>}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    {resource.file_size && <span>Size: {formatFileSize(resource.file_size)}</span>}
                    {resource.file_type && <span>Type: {resource.file_type}</span>}
                    <span>Downloads: {resource.download_count}</span>
                  </div>
                  <div>
                    Created by {resource.profiles?.display_name} on {new Date(resource.created_at).toLocaleDateString()}
                  </div>
                </div>

                {resource.file_url && (
                  <div className="flex justify-end">
                    <Button variant="outline" size="sm" asChild>
                      <a href={resource.file_url} target="_blank" rel="noopener noreferrer">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </a>
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {!resources?.length && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No resources found. Create your first resource to get started.</p>
              <Link href="/admin/resources/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Resource
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

import { requireAdmin } from "@/lib/admin"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, BookOpen, Clock } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function BibleStudiesPage() {
  await requireAdmin("content_admin")
  const supabase = await createClient()

  const { data: bibleStudies, error } = await supabase
    .from("bible_studies")
    .select(`
      *,
      profiles!bible_studies_created_by_fkey (
        display_name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching bible studies:", error)
  }

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      beginner: "bg-green-100 text-green-800",
      intermediate: "bg-yellow-100 text-yellow-800",
      advanced: "bg-red-100 text-red-800",
    }
    return colors[difficulty as keyof typeof colors] || colors.beginner
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Bible Studies</h1>
          <p className="text-muted-foreground">Manage Bible study lessons and series</p>
        </div>
        <Link href="/admin/bible-studies/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Bible Study
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {bibleStudies?.map((study) => (
          <Card key={study.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{study.title}</CardTitle>
                    <BookOpen className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {study.series_name && (
                      <Badge variant="outline">
                        {study.series_name}
                        {study.lesson_number && ` - Lesson ${study.lesson_number}`}
                      </Badge>
                    )}
                    {study.difficulty_level && (
                      <Badge className={getDifficultyColor(study.difficulty_level)}>{study.difficulty_level}</Badge>
                    )}
                    {study.estimated_duration && (
                      <Badge variant="secondary">
                        <Clock className="mr-1 h-3 w-3" />
                        {study.estimated_duration} min
                      </Badge>
                    )}
                    {!study.is_published && <Badge variant="secondary">Draft</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/bible-studies/${study.id}/edit`}>
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
                {study.description && <p className="text-muted-foreground">{study.description}</p>}

                {study.scripture_references && study.scripture_references.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-foreground mb-1">Scripture References:</p>
                    <div className="flex flex-wrap gap-1">
                      {study.scripture_references.map((ref: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {ref}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    Created by {study.profiles?.display_name} on {new Date(study.created_at).toLocaleDateString()}
                  </div>
                  {study.updated_at !== study.created_at && (
                    <div>Updated {new Date(study.updated_at).toLocaleDateString()}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {!bibleStudies?.length && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                No Bible studies found. Create your first Bible study to get started.
              </p>
              <Link href="/admin/bible-studies/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Bible Study
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

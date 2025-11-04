import { requireAdmin } from "@/lib/admin"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, Star, User } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function TestimonialsPage() {
  await requireAdmin("content_admin")
  const supabase = await createClient()

  const { data: testimonials, error } = await supabase
    .from("testimonials")
    .select(`
      *,
      profiles!testimonials_created_by_fkey (
        display_name
      )
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching testimonials:", error)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Testimonials</h1>
          <p className="text-muted-foreground">Manage testimonies and stories of transformation</p>
        </div>
        <Link href="/admin/testimonials/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Testimonial
          </Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {testimonials?.map((testimonial) => (
          <Card key={testimonial.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-lg">{testimonial.title}</CardTitle>
                    {testimonial.is_featured && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  </div>
                  <div className="flex items-center gap-2">
                    {testimonial.is_anonymous ? (
                      <Badge variant="secondary">
                        <User className="mr-1 h-3 w-3" />
                        Anonymous
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        {testimonial.author_name}
                        {testimonial.author_location && ` - ${testimonial.author_location}`}
                      </Badge>
                    )}
                    {!testimonial.is_published && <Badge variant="secondary">Draft</Badge>}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/admin/testimonials/${testimonial.id}/edit`}>
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
                <p className="text-muted-foreground line-clamp-3">{testimonial.content}</p>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div>
                    Created by {testimonial.profiles?.display_name} on{" "}
                    {new Date(testimonial.created_at).toLocaleDateString()}
                  </div>
                  {testimonial.updated_at !== testimonial.created_at && (
                    <div>Updated {new Date(testimonial.updated_at).toLocaleDateString()}</div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {!testimonials?.length && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                No testimonials found. Create your first testimonial to get started.
              </p>
              <Link href="/admin/testimonials/new">
                <Button className="mt-4">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Testimonial
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

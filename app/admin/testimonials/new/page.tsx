import { requireAdmin } from "@/lib/admin"
import { TestimonialForm } from "@/components/admin/testimonial-form"

export const dynamic = "force-dynamic"

export default async function NewTestimonialPage() {
  await requireAdmin("content_admin")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Add New Testimonial</h1>
        <p className="text-muted-foreground">Share a story of transformation and hope</p>
      </div>

      <TestimonialForm />
    </div>
  )
}

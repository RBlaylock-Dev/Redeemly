import { requireAdmin } from "@/lib/admin"
import { createClient } from "@/lib/supabase/server"
import { WebsiteContentEditor } from "@/components/admin/website-content-editor"

export const dynamic = "force-dynamic"

export default async function WebsiteContentPage() {
  await requireAdmin("content_admin")
  const supabase = await createClient()

  const { data: content, error } = await supabase
    .from("website_content")
    .select("*")
    .order("page_section", { ascending: true })

  if (error) {
    console.error("Error fetching website content:", error)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Website Content</h1>
        <p className="text-muted-foreground">Edit website content and page sections</p>
      </div>

      <WebsiteContentEditor content={content || []} />
    </div>
  )
}

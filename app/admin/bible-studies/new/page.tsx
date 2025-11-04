import { requireAdmin } from "@/lib/admin"
import { BibleStudyForm } from "@/components/admin/bible-study-form"

export const dynamic = "force-dynamic"

export default async function NewBibleStudyPage() {
  await requireAdmin("content_admin")

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Create New Bible Study</h1>
        <p className="text-muted-foreground">Create a new Bible study lesson or series</p>
      </div>

      <BibleStudyForm />
    </div>
  )
}

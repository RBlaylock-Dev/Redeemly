import type React from "react"
import { redirect } from "next/navigation"
import { requireAdmin } from "@/lib/admin"
import { Sidebar } from "@/components/admin/sidebar"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  try {
    console.log("[v0] AdminLayout - Checking admin access")
    await requireAdmin()
    console.log("[v0] AdminLayout - Admin access granted")
  } catch (error) {
    console.log("[v0] AdminLayout - Admin access denied:", error)
    redirect("/auth/login?message=Admin access required. Please contact an administrator.")
  }

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto p-6">{children}</div>
      </main>
    </div>
  )
}

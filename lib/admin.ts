import { createClient } from "@/lib/supabase/server"

export type AdminRole = "super_admin" | "content_admin" | "moderator"

export interface AdminUser {
  id: string
  role: AdminRole
  granted_at: string
  user_profile?: {
    display_name: string
    bio: string
  }
}

export async function checkAdminRole(userId?: string): Promise<AdminRole | null> {
  if (!userId) return null

  const supabase = await createClient()

  const { data, error } = await supabase.rpc("check_user_admin_role", {
    user_id: userId,
  })

  console.log("[v0] checkAdminRole - userId:", userId)
  console.log("[v0] checkAdminRole - data:", data)
  console.log("[v0] checkAdminRole - error:", error)

  if (error || !data || data.length === 0) return null

  return data[0].role as AdminRole
}

export async function requireAdmin(requiredRole?: AdminRole): Promise<AdminUser> {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  console.log("[v0] requireAdmin - user:", user?.id)
  console.log("[v0] requireAdmin - authError:", authError)

  if (authError || !user) {
    throw new Error("Authentication required")
  }

  const { data: adminData, error: adminError } = await supabase.rpc("check_user_admin_role", {
    user_id: user.id,
  })

  console.log("[v0] requireAdmin - adminData:", adminData)
  console.log("[v0] requireAdmin - adminError:", adminError)

  if (adminError || !adminData || adminData.length === 0) {
    throw new Error("Admin access required")
  }

  const userRole = adminData[0].role as AdminRole

  // Check if user has required role level
  if (requiredRole) {
    const roleHierarchy = {
      moderator: 1,
      content_admin: 2,
      super_admin: 3,
    }

    const userLevel = roleHierarchy[userRole]
    const requiredLevel = roleHierarchy[requiredRole]

    if (userLevel < requiredLevel) {
      throw new Error("Insufficient permissions")
    }
  }

  return {
    id: user.id,
    role: userRole,
    granted_at: adminData[0].granted_at,
  }
}

export function hasPermission(userRole: AdminRole, requiredRole: AdminRole): boolean {
  const roleHierarchy = {
    moderator: 1,
    content_admin: 2,
    super_admin: 3,
  }

  return roleHierarchy[userRole] >= roleHierarchy[requiredRole]
}

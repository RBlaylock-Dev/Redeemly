"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Menu, X, BookOpen, Users, Phone, Home, Book, User, LogOut } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    // Get initial user
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }
    getUser()

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [supabase.auth])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const publicNavItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/resources", label: "Resources", icon: BookOpen },
    { href: "/bible-study", label: "Bible Study", icon: Book },
    { href: "/testimonials", label: "Testimonials", icon: Users },
    { href: "/contact", label: "Contact", icon: Phone },
  ]

  const authenticatedNavItems = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/community", label: "Community", icon: Users },
    { href: "/messages", label: "Messages", icon: Phone },
    { href: "/resources", label: "Resources", icon: BookOpen },
    { href: "/bible-study", label: "Bible Study", icon: Book },
  ]

  const navItems = user ? authenticatedNavItems : publicNavItems

  if (loading) {
    return (
      <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-24">
            <Link href="/" className="flex items-center">
              <Image src="/redeemly-logo.png" alt="Redeemly" width={400} height={100} className="h-20 w-auto" />
            </Link>
          </div>
        </div>
      </nav>
    )
  }

  return (
    <nav className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-24">
          <Link href={user ? "/dashboard" : "/"} className="flex items-center">
            <Image src="/redeemly-logo.png" alt="Redeemly" width={400} height={100} className="h-20 w-auto" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 flex items-center space-x-1"
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}

            {user ? (
              <div className="flex items-center space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/profile">
                    <User className="h-4 w-4 mr-1" />
                    Profile
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-1" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button asChild variant="outline" size="sm">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild variant="default" size="sm">
                  <Link href="/auth/sign-up">Join Community</Link>
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 border-t border-border">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground block px-3 py-2 text-base font-medium transition-colors duration-200 flex items-center space-x-2"
                  onClick={() => setIsOpen(false)}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="px-3 py-2 space-y-2">
                {user ? (
                  <>
                    <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                      <Link href="/profile">
                        <User className="h-4 w-4 mr-1" />
                        Profile
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm" className="w-full" onClick={handleSignOut}>
                      <LogOut className="h-4 w-4 mr-1" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button asChild variant="outline" size="sm" className="w-full bg-transparent">
                      <Link href="/auth/login">Sign In</Link>
                    </Button>
                    <Button asChild variant="default" size="sm" className="w-full">
                      <Link href="/auth/sign-up">Join Community</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

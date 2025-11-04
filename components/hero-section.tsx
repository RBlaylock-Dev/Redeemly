import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, BookOpen, Users, ArrowRight } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative py-20 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-6xl font-bold text-balance leading-tight">
                <span className="text-primary">Redemption</span> has a community
              </h1>
              <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
                You are not alone. Join a supportive community of believers walking away from LGBT lifestyle toward
                freedom and new life in Jesus Christ.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="text-lg px-8 py-6">
                <Link href="/auth/sign-up">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6 bg-transparent">
                <Link href="/resources">Browse Resources</Link>
              </Button>
            </div>

            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Heart className="h-4 w-4 text-accent" />
                <span>Confidential Support</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-accent" />
                <span>Community Care</span>
              </div>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4 text-accent" />
                <span>Biblical Resources</span>
              </div>
            </div>
          </div>

          {/* Right Column - Feature Cards */}
          <div className="space-y-6">
            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Personal Support</h3>
                  <p className="text-muted-foreground">
                    Connect with trained mentors who understand your journey and can provide biblical guidance and
                    encouragement.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-start space-x-4">
                <div className="bg-accent/10 p-3 rounded-lg">
                  <BookOpen className="h-6 w-6 text-accent" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Biblical Resources</h3>
                  <p className="text-muted-foreground">
                    Access carefully curated studies, testimonies, and practical resources grounded in Scripture and
                    Christian truth.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6 bg-card/50 backdrop-blur border-border/50">
              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Safe Community</h3>
                  <p className="text-muted-foreground">
                    Join a confidential community of believers walking similar paths, sharing hope and supporting one
                    another.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  )
}

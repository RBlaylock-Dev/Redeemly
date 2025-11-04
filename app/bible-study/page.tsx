import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { VerseSearch } from "@/components/verse-search"
import { StudyGuides } from "@/components/study-guides"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Book, Search, BookOpen, Heart, Lightbulb } from "lucide-react"

export default function BibleStudyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary/5 to-background py-16">
          <div className="container mx-auto px-4 text-center">
            <Book className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 text-balance">Bible Study & Research</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
              Discover God's truth through His Word. Search verses, explore study guides, and deepen your understanding
              of Scripture.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <Tabs defaultValue="search" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="search" className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Verse Search
                </TabsTrigger>
                <TabsTrigger value="studies" className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Study Guides
                </TabsTrigger>
                <TabsTrigger value="topics" className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4" />
                  Topics
                </TabsTrigger>
              </TabsList>

              <TabsContent value="search" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">Search Scripture</h2>
                  <p className="text-muted-foreground">
                    Find verses by keyword, topic, or reference to guide your journey
                  </p>
                </div>
                <VerseSearch />
              </TabsContent>

              <TabsContent value="studies" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">Study Guides</h2>
                  <p className="text-muted-foreground">
                    Structured Bible studies designed for transformation and growth
                  </p>
                </div>
                <StudyGuides />
              </TabsContent>

              <TabsContent value="topics" className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-semibold text-foreground mb-2">Study by Topic</h2>
                  <p className="text-muted-foreground">Explore key biblical themes relevant to your journey</p>
                </div>

                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {[
                    {
                      title: "Identity & Worth",
                      description: "Discover who you are in Christ and your true value in God's eyes",
                      verses: 15,
                      icon: Heart,
                    },
                    {
                      title: "Freedom & Deliverance",
                      description: "Biblical truths about breaking free from bondage and finding liberty",
                      verses: 22,
                      icon: Book,
                    },
                    {
                      title: "Renewal & Transformation",
                      description: "Scriptures about being made new and transformed by God's power",
                      verses: 18,
                      icon: Lightbulb,
                    },
                    {
                      title: "Forgiveness & Grace",
                      description: "God's mercy, forgiveness, and unmerited favor toward us",
                      verses: 25,
                      icon: Heart,
                    },
                    {
                      title: "Purity & Holiness",
                      description: "Living a life set apart for God's purposes and glory",
                      verses: 20,
                      icon: Book,
                    },
                    {
                      title: "Hope & Future",
                      description: "God's promises for your future and reasons for hope",
                      verses: 16,
                      icon: Lightbulb,
                    },
                  ].map((topic, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center gap-3">
                          <topic.icon className="h-8 w-8 text-primary" />
                          <div>
                            <CardTitle className="text-lg">{topic.title}</CardTitle>
                            <CardDescription>{topic.verses} verses</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm">{topic.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

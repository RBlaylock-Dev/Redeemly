"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Search, Copy, Heart } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Verse {
  reference: string
  text: string
  topic: string
  version: string
}

const sampleVerses: Verse[] = [
  {
    reference: "2 Corinthians 5:17",
    text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!",
    topic: "New Identity",
    version: "NIV",
  },
  {
    reference: "1 Corinthians 6:9-11",
    text: "Or do you not know that wrongdoers will not inherit the kingdom of God? Do not be deceived: Neither the sexually immoral nor idolaters nor adulterers nor men who have sex with men nor thieves nor the greedy nor drunkards nor slanderers nor swindlers will inherit the kingdom of God. And that is what some of you were. But you were washed, you were sanctified, you were justified in the name of the Lord Jesus Christ and by the Spirit of our God.",
    topic: "Transformation",
    version: "NIV",
  },
  {
    reference: "Romans 12:2",
    text: "Do not conform to the pattern of this world, but be transformed by the renewing of your mind. Then you will be able to test and approve what God's will is—his good, pleasing and perfect will.",
    topic: "Renewal",
    version: "NIV",
  },
  {
    reference: "Isaiah 43:18-19",
    text: "Forget the former things; do not dwell on the past. See, I am doing a new thing! Now it springs up; do you not perceive it? I am making a way in the wilderness and streams in the wasteland.",
    topic: "New Beginnings",
    version: "NIV",
  },
  {
    reference: "Psalm 51:10",
    text: "Create in me a pure heart, O God, and renew a steadfast spirit within me.",
    topic: "Purity",
    version: "NIV",
  },
  {
    reference: "1 John 1:9",
    text: "If we confess our sins, he is faithful and just and will forgive us our sins and purify us from all unrighteousness.",
    topic: "Forgiveness",
    version: "NIV",
  },
]

export function VerseSearch() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedTopic, setSelectedTopic] = useState("all")
  const [filteredVerses, setFilteredVerses] = useState(sampleVerses)
  const { toast } = useToast()

  const topics = [
    "all",
    "New Identity",
    "Transformation",
    "Renewal",
    "New Beginnings",
    "Purity",
    "Forgiveness",
    "Hope",
    "Healing",
    "Recovery",
  ]

  const handleSearch = () => {
    let filtered = sampleVerses

    if (searchTerm) {
      filtered = filtered.filter(
        (verse) =>
          verse.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
          verse.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
          verse.topic.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (selectedTopic !== "all") {
      filtered = filtered.filter((verse) => verse.topic === selectedTopic)
    }

    setFilteredVerses(filtered)
  }

  const copyVerse = (verse: Verse) => {
    navigator.clipboard.writeText(`"${verse.text}" - ${verse.reference} (${verse.version})`)
    toast({
      title: "Verse copied!",
      description: "The verse has been copied to your clipboard.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search verses by keyword, reference, or topic..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full"
          />
        </div>
        <select
          value={selectedTopic}
          onChange={(e) => setSelectedTopic(e.target.value)}
          className="px-3 py-2 border border-input bg-background rounded-md"
        >
          {topics.map((topic) => (
            <option key={topic} value={topic}>
              {topic === "all" ? "All Topics" : topic}
            </option>
          ))}
        </select>
        <Button onClick={handleSearch} className="flex items-center gap-2">
          <Search className="h-4 w-4" />
          Search
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredVerses.map((verse, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-semibold text-primary">{verse.reference}</CardTitle>
                <Badge variant="secondary">{verse.topic}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4 leading-relaxed">"{verse.text}"</p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{verse.version}</span>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyVerse(verse)}
                    className="flex items-center gap-1"
                  >
                    <Copy className="h-4 w-4" />
                    Copy
                  </Button>
                  <Button variant="ghost" size="sm" className="flex items-center gap-1">
                    <Heart className="h-4 w-4" />
                    Save
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredVerses.length === 0 && (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground">No verses found matching your search criteria.</p>
            <p className="text-sm text-muted-foreground mt-2">Try different keywords or select "All Topics".</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

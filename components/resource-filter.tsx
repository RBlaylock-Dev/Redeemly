"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Filter, X } from "lucide-react"

interface ResourceFilterProps {
  categories: string[]
  types: string[]
  onFilterChange: (filters: { search: string; categories: string[]; types: string[] }) => void
}

export function ResourceFilter({ categories, types, onFilterChange }: ResourceFilterProps) {
  const [search, setSearch] = useState("")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  const handleSearchChange = (value: string) => {
    setSearch(value)
    onFilterChange({ search: value, categories: selectedCategories, types: selectedTypes })
  }

  const toggleCategory = (category: string) => {
    const newCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category]
    setSelectedCategories(newCategories)
    onFilterChange({ search, categories: newCategories, types: selectedTypes })
  }

  const toggleType = (type: string) => {
    const newTypes = selectedTypes.includes(type) ? selectedTypes.filter((t) => t !== type) : [...selectedTypes, type]
    setSelectedTypes(newTypes)
    onFilterChange({ search, categories: selectedCategories, types: newTypes })
  }

  const clearFilters = () => {
    setSearch("")
    setSelectedCategories([])
    setSelectedTypes([])
    onFilterChange({ search: "", categories: [], types: [] })
  }

  const hasActiveFilters = search || selectedCategories.length > 0 || selectedTypes.length > 0

  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search resources..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Filters</span>
        </div>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            <X className="h-4 w-4 mr-1" />
            Clear
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Categories</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Badge
              key={category}
              variant={selectedCategories.includes(category) ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary/80 transition-colors"
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Badge>
          ))}
        </div>
      </div>

      {/* Types */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium">Resource Types</h3>
        <div className="flex flex-wrap gap-2">
          {types.map((type) => (
            <Badge
              key={type}
              variant={selectedTypes.includes(type) ? "default" : "secondary"}
              className="cursor-pointer hover:bg-primary/80 transition-colors capitalize"
              onClick={() => toggleType(type)}
            >
              {type}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

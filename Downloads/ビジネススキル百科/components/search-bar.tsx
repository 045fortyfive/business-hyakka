"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchBarProps {
  defaultValue?: string
}

export function SearchBar({ defaultValue = "" }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState(defaultValue)
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!searchQuery.trim()) return

    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="relative">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
          <Search className="h-4 w-4" />
        </div>
        <Input
          type="search"
          placeholder="学びたいスキル、キーワード、講師名など"
          className="pl-9 pr-20 py-2 text-sm rounded-md border"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button
          type="submit"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 rounded-md px-3 py-1 h-7 text-xs font-medium"
          disabled={!searchQuery.trim()}
        >
          検索
        </Button>
      </div>
    </form>
  )
}

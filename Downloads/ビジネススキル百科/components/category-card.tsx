import Link from "next/link"
import { CategoryIcon } from "@/components/category-icons"
import type { Category } from "@/lib/types"

interface CategoryCardProps {
  category: Category
}

export function CategoryCard({ category }: CategoryCardProps) {
  const { name, slug, description } = category

  return (
    <Link
      href={`/categories/${slug}`}
      className="flex flex-col items-center p-4 rounded-lg border hover:border-primary/30 hover:bg-gray-50 transition-all text-center group"
    >
      <div className="mb-3 p-3 rounded-full bg-gray-100 group-hover:bg-primary/10">
        <CategoryIcon category={name} className="h-6 w-6 text-primary" />
      </div>
      <h3 className="font-medium text-sm mb-1">{name}</h3>
      {description && <p className="text-xs text-muted-foreground line-clamp-2">{description}</p>}
    </Link>
  )
}

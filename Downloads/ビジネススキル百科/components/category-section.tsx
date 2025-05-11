import Link from "next/link"
import { CategoryIcon } from "@/components/category-icons"
import type { Category } from "@/lib/types"

interface CategorySectionProps {
  categories: Category[]
}

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link
          key={category.slug}
          href={`/categories/${category.slug}`}
          className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors text-center group"
        >
          <div className="mb-2 p-3 rounded-full bg-gray-100 group-hover:bg-primary/10">
            <CategoryIcon category={category.name} className="h-6 w-6 text-primary" />
          </div>
          <span className="text-sm font-medium">{category.name}</span>
        </Link>
      ))}
      <Link
        href="/categories"
        className="flex flex-col items-center justify-center p-3 rounded-lg hover:bg-gray-50 transition-colors text-center group"
      >
        <div className="mb-2 p-3 rounded-full bg-gray-100 group-hover:bg-primary/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-6 w-6 text-primary"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
        <span className="text-sm font-medium">すべて見る</span>
      </Link>
    </div>
  )
}

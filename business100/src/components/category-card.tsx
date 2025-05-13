import Link from "next/link"
import { CategoryIcon } from "@/components/category-icons"
import { BaseCard, CardContent, CardTitle, CardDescription } from "@/components/ui/base-card"

interface CategoryCardProps {
  id: string
  name: string
  slug: string
  description?: string
  count?: number
}

export function CategoryCard({ id, name, slug, description, count }: CategoryCardProps) {
  return (
    <Link href={`/categories/${slug}`}>
      <BaseCard className="h-full hover:border-blue-200 hover:bg-blue-50/30 transition-colors">
        <CardContent className="flex items-start p-6">
          <div className="mr-4 p-3 bg-blue-100 rounded-full">
            <CategoryIcon category={name} categorySlug={slug} className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <CardTitle className="text-lg">{name}</CardTitle>
            {description && (
              <CardDescription className="mt-1">{description}</CardDescription>
            )}
            {count !== undefined && (
              <p className="text-sm text-blue-600 mt-2">{count}件のコンテンツ</p>
            )}
          </div>
        </CardContent>
      </BaseCard>
    </Link>
  )
}

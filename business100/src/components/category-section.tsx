import { CategoryIcon } from "@/components/category-icons"
import { BaseCard, CardLink, CardContent, CardTitle, CardDescription } from "@/components/ui/base-card"

interface CategorySectionProps {
  categories: {
    sys: {
      id: string;
    };
    fields: {
      name: string;
      slug: string;
      description?: string;
    };
  }[];
}

export function CategorySection({ categories }: CategorySectionProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
      {categories.map((category) => (
        <BaseCard key={category.sys.id} className="text-center">
          <CardLink href={`/categories/${category.fields.slug}`} className="items-center p-4">
            <div className="mb-3 p-3 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors">
              <CategoryIcon category={category.fields.name} className="h-6 w-6 text-blue-600" />
            </div>
            <CardContent className="p-0">
              <CardTitle className="text-sm">{category.fields.name}</CardTitle>
              {category.fields.description && (
                <CardDescription className="text-xs">
                  {category.fields.description}
                </CardDescription>
              )}
            </CardContent>
          </CardLink>
        </BaseCard>
      ))}
      <BaseCard className="text-center">
        <CardLink href="/categories" className="items-center p-4">
          <div className="mb-3 p-3 rounded-full bg-gray-100 group-hover:bg-blue-100 transition-colors">
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
              className="h-6 w-6 text-blue-600"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </div>
          <CardContent className="p-0">
            <CardTitle className="text-sm">すべて見る</CardTitle>
            <CardDescription className="text-xs">全カテゴリを表示</CardDescription>
          </CardContent>
        </CardLink>
      </BaseCard>
    </div>
  )
}

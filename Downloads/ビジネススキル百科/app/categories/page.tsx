import Link from "next/link"
import { getCategories } from "@/lib/contentful"
import { CategoryCard } from "@/components/category-card"
import { CategorySkeleton } from "@/components/category-skeleton"
import { Suspense } from "react"

export const metadata = {
  title: "カテゴリ一覧 | ビジネススキル百科",
  description: "ビジネススキルに関する様々なカテゴリを一覧で表示します。",
}

export default async function CategoriesPage() {
  const categories = await getCategories()

  return (
    <div className="container mx-auto px-4 py-6">
      {/* パンくずリスト */}
      <div className="mb-6">
        <nav className="flex text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            ホーム
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">カテゴリ一覧</span>
        </nav>
      </div>

      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">カテゴリ一覧</h1>
        <p className="text-muted-foreground">
          興味のあるカテゴリを選んで、関連コンテンツを探索しましょう
        </p>
      </div>

      {/* カテゴリ一覧 */}
      <Suspense fallback={<CategorySkeleton count={4} />}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </Suspense>
    </div>
  )
}

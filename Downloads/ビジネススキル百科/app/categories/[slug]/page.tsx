import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getCategoryBySlug, getContentByCategory } from "@/lib/contentful"
import { ContentCard } from "@/components/content-card"
import { ContentSkeleton } from "@/components/content-skeleton"
import { Suspense } from "react"

interface CategoryPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return {
      title: "カテゴリが見つかりません",
      description: "お探しのカテゴリは見つかりませんでした。",
    }
  }

  return {
    title: `${category.name} | ビジネススキル百科`,
    description: category.description || `${category.name}に関するコンテンツ一覧`,
  }
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    notFound()
  }

  const contentItems = await getContentByCategory(category.id)

  return (
    <div className="container mx-auto px-4 py-6">
      {/* パンくずリスト */}
      <div className="mb-6">
        <nav className="flex text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            ホーム
          </Link>
          <span className="mx-2">/</span>
          <Link href="/categories" className="hover:text-primary">
            カテゴリ一覧
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{category.name}</span>
        </nav>
      </div>

      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{category.name}</h1>
        {category.description && (
          <p className="text-muted-foreground">{category.description}</p>
        )}
      </div>

      {/* コンテンツ一覧 */}
      <Suspense fallback={<ContentSkeleton count={6} />}>
        <div className="flex flex-wrap -ml-4 mb-8">
          {contentItems.length > 0 ? (
            contentItems.map((content) => (
              <div key={content.id} className="min-w-0 w-full pl-4 pb-4 sm:w-1/2 lg:w-1/3">
                <ContentCard content={content} />
              </div>
            ))
          ) : (
            <div className="w-full p-8 text-center">
              <p className="text-muted-foreground">このカテゴリにはまだコンテンツがありません。</p>
            </div>
          )}
        </div>
      </Suspense>
    </div>
  )
}

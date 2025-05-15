import Link from "next/link"
import { getAllContent, getCategories } from "@/lib/contentful"
import { ContentCard } from "@/components/content-card"
import { ContentSkeleton } from "@/components/content-skeleton"
import { Suspense } from "react"

export const metadata = {
  title: "コンテンツ一覧 | ビジネススキル百科",
  description: "ビジネススキルに関する様々なコンテンツを一覧で表示します。",
}

export default async function ContentListPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  // 検索パラメータを取得
  const category = typeof searchParams.category === "string" ? searchParams.category : undefined
  const type = typeof searchParams.type === "string" ? searchParams.type : undefined
  const tag = typeof searchParams.tag === "string" ? searchParams.tag : undefined
  const page = typeof searchParams.page === "string" ? parseInt(searchParams.page) : 1
  const limit = 12
  const skip = (page - 1) * limit

  // コンテンツを取得
  const { items: contentItems, total } = await getAllContent({ limit, skip })
  const totalPages = Math.ceil(total / limit)

  // カテゴリを取得
  const categories = await getCategories()

  // フィルタリングのタイトルを生成
  let filterTitle = "すべてのコンテンツ"
  if (category) {
    const categoryObj = categories.find((cat) => cat.slug === category)
    if (categoryObj) {
      filterTitle = `${categoryObj.name}のコンテンツ`
    }
  } else if (type) {
    filterTitle = `${type}コンテンツ`
  } else if (tag) {
    filterTitle = `タグ: ${tag}`
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* パンくずリスト */}
      <div className="mb-6">
        <nav className="flex text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            ホーム
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">コンテンツ一覧</span>
        </nav>
      </div>

      {/* ヘッダー */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{filterTitle}</h1>
        <p className="text-muted-foreground">
          {total}件のコンテンツが見つかりました
        </p>
      </div>

      {/* フィルター */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <Link
            href="/content"
            className={`px-3 py-1 rounded-full text-sm ${
              !category && !type && !tag
                ? "bg-primary text-primary-foreground"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            すべて
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/content?category=${cat.slug}`}
              className={`px-3 py-1 rounded-full text-sm ${
                category === cat.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>
      </div>

      {/* コンテンツ一覧 */}
      <Suspense fallback={<ContentSkeleton count={limit} />}>
        <div className="flex flex-wrap -ml-4 mb-8">
          {contentItems.length > 0 ? (
            contentItems.map((content) => (
              <div key={content.id} className="min-w-0 w-full pl-4 pb-4 sm:w-1/2 lg:w-1/3">
                <ContentCard content={content} />
              </div>
            ))
          ) : (
            <div className="w-full p-8 text-center">
              <p className="text-muted-foreground">コンテンツが見つかりませんでした。</p>
            </div>
          )}
        </div>
      </Suspense>

      {/* ページネーション */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mb-8">
          {page > 1 && (
            <Link
              href={`/content?page=${page - 1}${category ? `&category=${category}` : ""}${
                type ? `&type=${type}` : ""
              }${tag ? `&tag=${tag}` : ""}`}
              className="px-3 py-1 rounded border hover:bg-gray-100"
            >
              前へ
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
            <Link
              key={pageNum}
              href={`/content?page=${pageNum}${category ? `&category=${category}` : ""}${
                type ? `&type=${type}` : ""
              }${tag ? `&tag=${tag}` : ""}`}
              className={`px-3 py-1 rounded ${
                pageNum === page
                  ? "bg-primary text-primary-foreground"
                  : "border hover:bg-gray-100"
              }`}
            >
              {pageNum}
            </Link>
          ))}
          {page < totalPages && (
            <Link
              href={`/content?page=${page + 1}${category ? `&category=${category}` : ""}${
                type ? `&type=${type}` : ""
              }${tag ? `&tag=${tag}` : ""}`}
              className="px-3 py-1 rounded border hover:bg-gray-100"
            >
              次へ
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

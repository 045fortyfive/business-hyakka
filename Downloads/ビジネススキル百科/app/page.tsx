import Link from "next/link"
import { getLatestContent, getCategories, getEnvironmentStatus } from "@/lib/contentful"
import { ContentCard } from "@/components/content-card"
import { ContentSkeleton } from "@/components/content-skeleton"
import { CategorySkeleton } from "@/components/category-skeleton"
import { HeroCarousel } from "@/components/hero-carousel"
import { CategorySection } from "@/components/category-section"
import { SearchBar } from "@/components/search-bar"
import { Video, Music, FileText, File } from "lucide-react"
import { Suspense } from "react"
import { EnvDebug } from "@/components/env-debug"

export default async function Home() {
  // 環境変数の状態を確認
  const envStatus = getEnvironmentStatus()
  console.log("Environment status on homepage:", envStatus)

  // 最初からすべてのデータを取得して、クライアントサイドでの処理を減らす
  const latestContent = await getLatestContent(10)
  console.log("Latest content count:", latestContent.length)

  const categories = await getCategories()
  console.log("Categories count:", categories.length)

  return (
    <div className="mx-auto py-6">
      <div className="container mx-auto px-4">
        {/* デバッグ情報 */}
        {process.env.NODE_ENV !== "production" && <EnvDebug />}

        {/* デバッグリンク */}
        {process.env.NODE_ENV !== "production" && (
          <div className="mb-4 p-2 bg-yellow-50 border border-yellow-200 rounded-md text-sm">
            <p className="flex items-center justify-between">
              <span>環境変数やContentfulの接続に問題がありますか？</span>
              <Link href="/debug" className="ml-2 text-blue-600 underline text-xs font-medium">
                デバッグページを確認する
              </Link>
            </p>
          </div>
        )}

        {/* 検索バー */}
        <div className="my-6 max-w-2xl mx-auto">
          <SearchBar />
        </div>
      </div>

      {/* ヒーローカルーセル */}
      <div className="mb-8 px-4">
        <HeroCarousel items={latestContent} />
      </div>

      <div className="container mx-auto px-4">
        {/* カテゴリセクション */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">カテゴリから探す</h2>
          </div>
          <Suspense fallback={<CategorySkeleton count={6} />}>
            <CategorySection categories={categories} />
          </Suspense>
        </section>

        {/* 新着コンテンツセクション */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">新着コンテンツ</h2>
            <Link href="/content" className="text-xs font-medium text-primary hover:underline flex items-center">
              すべて見る
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1 h-3 w-3"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </Link>
          </div>
          <Suspense fallback={<ContentSkeleton count={6} />}>
            <div className="flex flex-wrap -ml-4">
              {latestContent.map((content) => (
                <div key={content.id} className="min-w-0 w-full pl-4 pb-4 sm:w-1/2 lg:w-1/3">
                  <ContentCard content={content} />
                </div>
              ))}
            </div>
          </Suspense>
        </section>

        {/* コンテンツタイプセクション */}
        <section className="mb-10">
          <div className="mb-4">
            <h2 className="text-lg font-bold">コンテンツタイプから探す</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Link
              href="/content?type=記事"
              className="flex items-center p-4 rounded-lg border hover:border-blue-300 hover:bg-blue-50 transition-all group"
            >
              <div className="mr-3 p-2 rounded-full bg-blue-100 group-hover:bg-blue-200">
                <FileText className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">記事で学ぶ</h3>
                <p className="text-xs text-muted-foreground">詳しく解説した記事</p>
              </div>
            </Link>

            <Link
              href="/content?type=動画"
              className="flex items-center p-4 rounded-lg border hover:border-red-300 hover:bg-red-50 transition-all group"
            >
              <div className="mr-3 p-2 rounded-full bg-red-100 group-hover:bg-red-200">
                <Video className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">動画で学ぶ</h3>
                <p className="text-xs text-muted-foreground">視覚的に理解しやすい動画</p>
              </div>
            </Link>

            <Link
              href="/content?type=音声"
              className="flex items-center p-4 rounded-lg border hover:border-purple-300 hover:bg-purple-50 transition-all group"
            >
              <div className="mr-3 p-2 rounded-full bg-purple-100 group-hover:bg-purple-200">
                <Music className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">音声で学ぶ</h3>
                <p className="text-xs text-muted-foreground">移動中にも学べる音声</p>
              </div>
            </Link>

            <Link
              href="/content?type=その他"
              className="flex items-center p-4 rounded-lg border hover:border-gray-300 hover:bg-gray-50 transition-all group"
            >
              <div className="mr-3 p-2 rounded-full bg-gray-100 group-hover:bg-gray-200">
                <File className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="font-medium text-sm">その他のコンテンツ</h3>
                <p className="text-xs text-muted-foreground">様々な形式のコンテンツ</p>
              </div>
            </Link>
          </div>
        </section>

        {/* 特集コンテンツ */}
        <section className="mb-10">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-bold">特集コンテンツ</h2>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg p-6 text-white">
            <div className="max-w-md">
              <h3 className="text-xl font-bold mb-2">ビジネススキルを効率的に学ぼう</h3>
              <p className="mb-4 text-sm text-white/90">
                若手ビジネスパーソン向けに厳選したコンテンツで、効率的にスキルアップしましょう。
              </p>
              <Link
                href="/content"
                className="inline-flex items-center bg-white text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
              >
                コンテンツを見る
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="ml-1 h-3 w-3"
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

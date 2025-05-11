import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getContentBySlug, getLatestContent } from "@/lib/contentful"
import { ContentType } from "@/lib/types"
import { FileText, Video, Music, File, Calendar, User, Tag, ArrowLeft } from "lucide-react"
import { ContentCard } from "@/components/content-card"
import { renderRichText } from "@/lib/rich-text-renderer"

interface ContentPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ContentPageProps): Promise<Metadata> {
  const { slug } = params
  const content = await getContentBySlug(slug)

  if (!content) {
    return {
      title: "コンテンツが見つかりません",
      description: "お探しのコンテンツは見つかりませんでした。",
    }
  }

  return {
    title: content.title,
    description: content.description,
    openGraph: {
      title: content.title,
      description: content.description,
      images: content.featuredImage ? [content.featuredImage] : [],
    },
  }
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug } = params
  const content = await getContentBySlug(slug)

  if (!content) {
    notFound()
  }

  // コンテンツタイプに基づいたアイコンとラベルを取得
  const getTypeInfo = () => {
    switch (content.type) {
      case ContentType.ARTICLE:
        return {
          icon: <FileText className="h-4 w-4" />,
          label: "記事",
          bgColor: "bg-blue-500",
          textColor: "text-white",
        }
      case ContentType.VIDEO:
        return {
          icon: <Video className="h-4 w-4" />,
          label: "動画",
          bgColor: "bg-red-500",
          textColor: "text-white",
        }
      case ContentType.AUDIO:
        return {
          icon: <Music className="h-4 w-4" />,
          label: "音声",
          bgColor: "bg-purple-500",
          textColor: "text-white",
        }
      case ContentType.OTHER:
        return {
          icon: <File className="h-4 w-4" />,
          label: "その他",
          bgColor: "bg-gray-500",
          textColor: "text-white",
        }
      default:
        return {
          icon: <FileText className="h-4 w-4" />,
          label: "コンテンツ",
          bgColor: "bg-gray-500",
          textColor: "text-white",
        }
    }
  }

  const typeInfo = getTypeInfo()
  const formattedDate = new Date(content.publishDate).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // 関連コンテンツを取得
  const relatedContent = await getLatestContent(3)
  const filteredRelatedContent = relatedContent.filter((item) => item.id !== content.id).slice(0, 3)

  return (
    <div className="container mx-auto px-4 py-6">
      {/* パンくずリスト */}
      <div className="mb-6">
        <nav className="flex text-sm text-muted-foreground">
          <Link href="/" className="hover:text-primary">
            ホーム
          </Link>
          <span className="mx-2">/</span>
          <Link href="/content" className="hover:text-primary">
            コンテンツ一覧
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/content?category=${content.category.slug}`} className="hover:text-primary">
            {content.category.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{content.title}</span>
        </nav>
      </div>

      {/* 戻るボタン */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="mr-1 h-4 w-4" />
          トップページに戻る
        </Link>
      </div>

      {/* コンテンツヘッダー */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div
            className={`inline-flex items-center rounded-md ${typeInfo.bgColor} px-2 py-1`}
          >
            {typeInfo.icon}
            <span className={`ml-1 text-xs font-medium ${typeInfo.textColor}`}>{typeInfo.label}</span>
          </div>
          <span className="text-sm text-muted-foreground">
            {content.category.name}
          </span>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold mb-4">{content.title}</h1>
        <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center">
            <Calendar className="mr-1 h-4 w-4" />
            <span>{formattedDate}</span>
          </div>
          {content.author && (
            <div className="flex items-center">
              <User className="mr-1 h-4 w-4" />
              <span>{content.author.name}</span>
            </div>
          )}
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
        <div className="lg:col-span-2">
          {/* アイキャッチ画像 */}
          {content.featuredImage && (
            <div className="relative aspect-video mb-6 rounded-lg overflow-hidden">
              <Image
                src={content.featuredImage}
                alt={content.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          )}

          {/* 説明文 */}
          <div className="mb-6 text-lg">{content.description}</div>

          {/* 本文 */}
          {content.body && (
            <div className="prose prose-lg max-w-none">
              {renderRichText(content.body)}
            </div>
          )}

          {/* 動画コンテンツ */}
          {content.type === ContentType.VIDEO && content.videoUrl && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">動画コンテンツ</h2>
              <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  ここに動画プレーヤーが表示されます
                  <br />
                  <a href={content.videoUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    動画を視聴する
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* 音声コンテンツ */}
          {content.type === ContentType.AUDIO && content.audioUrl && (
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">音声コンテンツ</h2>
              <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
                <p className="text-center text-muted-foreground">
                  ここに音声プレーヤーが表示されます
                  <br />
                  <a href={content.audioUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                    音声を聴く
                  </a>
                </p>
              </div>
            </div>
          )}
        </div>

        {/* サイドバー */}
        <div>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">このコンテンツについて</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">カテゴリ</h3>
                <Link
                  href={`/content?category=${content.category.slug}`}
                  className="text-primary hover:underline"
                >
                  {content.category.name}
                </Link>
              </div>
              {content.author && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">著者</h3>
                  <div className="flex items-center">
                    {content.author.profilePicture && (
                      <div className="relative h-8 w-8 rounded-full overflow-hidden mr-2">
                        <Image
                          src={content.author.profilePicture}
                          alt={content.author.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <span>{content.author.name}</span>
                  </div>
                </div>
              )}
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">公開日</h3>
                <span>{formattedDate}</span>
              </div>
              {content.tags && content.tags.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground mb-1">タグ</h3>
                  <div className="flex flex-wrap gap-2">
                    {content.tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/content?tag=${tag.slug}`}
                        className="inline-flex items-center text-xs bg-gray-200 hover:bg-gray-300 rounded-full px-2 py-1"
                      >
                        <Tag className="mr-1 h-3 w-3" />
                        {tag.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 関連コンテンツ */}
      {filteredRelatedContent.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-bold mb-4">関連コンテンツ</h2>
          <div className="flex flex-wrap -ml-4">
            {filteredRelatedContent.map((item) => (
              <div key={item.id} className="min-w-0 w-full pl-4 pb-4 sm:w-1/2 lg:w-1/3">
                <ContentCard content={item} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

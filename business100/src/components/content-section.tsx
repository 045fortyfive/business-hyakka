import Link from "next/link"
import ContentCard from "@/components/content-card"
import { getImageProps } from "@/lib/utils"

interface ContentSectionProps {
  title: string
  viewAllLink: string
  viewAllText?: string
  items: any[]
  contentType: "article" | "video" | "audio"
}

export function ContentSection({
  title,
  viewAllLink,
  viewAllText = "すべて見る",
  items,
  contentType,
}: ContentSectionProps) {
  if (items.length === 0) {
    return (
      <section className="mb-16">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{title}</h2>
          <Link href={viewAllLink} className="text-blue-600 hover:underline">
            {viewAllText} &rarr;
          </Link>
        </div>
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600">
            {contentType === "article"
              ? "記事"
              : contentType === "video"
              ? "動画"
              : "音声コンテンツ"}
            がまだ登録されていません。
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="mb-16">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{title}</h2>
        <Link href={viewAllLink} className="text-blue-600 hover:underline">
          {viewAllText} &rarr;
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {items.map((item) => (
          <ContentCard
            key={item.sys.id}
            title={item.fields.title}
            slug={item.fields.slug}
            publishDate={item.sys.createdAt}
            category={{
              name: item.fields.category[0]?.fields?.name || "未分類",
              slug: item.fields.category[0]?.fields?.slug || "uncategorized",
            }}
            thumbnail={
              contentType === "article"
                ? item.fields.featuredImage
                  ? getImageProps(item.fields.featuredImage)
                  : null
                : item.fields.thumbnail
                ? getImageProps(item.fields.thumbnail)
                : null
            }
            contentType={contentType}
            description={item.fields.description}
          />
        ))}
      </div>
    </section>
  )
}

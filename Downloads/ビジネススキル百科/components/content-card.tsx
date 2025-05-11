import Link from "next/link"
import Image from "next/image"
import { FileText, Video, Music, File } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ContentType, type ContentItem } from "@/lib/types"

interface ContentCardProps {
  content: ContentItem
}

export function ContentCard({ content }: ContentCardProps) {
  const { id, title, slug, type, publishDate, category, thumbnail, featuredImage } = content

  const getTypeInfo = () => {
    switch (type) {
      case ContentType.ARTICLE:
        return {
          icon: <FileText className="h-3 w-3" />,
          label: "記事",
          bgColor: "bg-blue-500",
          textColor: "text-white",
        }
      case ContentType.VIDEO:
        return {
          icon: <Video className="h-3 w-3" />,
          label: "動画",
          bgColor: "bg-red-500",
          textColor: "text-white",
        }
      case ContentType.AUDIO:
        return {
          icon: <Music className="h-3 w-3" />,
          label: "音声",
          bgColor: "bg-purple-500",
          textColor: "text-white",
        }
      case ContentType.OTHER:
        return {
          icon: <File className="h-3 w-3" />,
          label: "その他",
          bgColor: "bg-gray-500",
          textColor: "text-white",
        }
      default:
        return {
          icon: <FileText className="h-3 w-3" />,
          label: "コンテンツ",
          bgColor: "bg-gray-500",
          textColor: "text-white",
        }
    }
  }

  const typeInfo = getTypeInfo()
  const formattedDate = new Date(publishDate).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md border bg-white rounded-lg h-full">
      <Link href={`/content/${slug}`} className="flex flex-col h-full">
        <div className="relative h-48 overflow-hidden rounded-t-lg">
          <Image
            src={thumbnail || featuredImage || "/placeholder.svg?height=200&width=400&query=business content"}
            alt={title}
            fill
            className="object-cover transition-transform hover:scale-105"
          />
          <div className={`absolute left-2 top-2 ${typeInfo.bgColor} rounded-md px-2 py-1 flex items-center`}>
            {typeInfo.icon}
            <span className={`ml-1 text-xs font-medium ${typeInfo.textColor}`}>{typeInfo.label}</span>
          </div>
        </div>
        <CardContent className="p-4 flex-grow">
          <h3 className="font-semibold text-base mb-2 line-clamp-2">{title}</h3>
          <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
            {content.description || `${category.name}カテゴリの${typeInfo.label}コンテンツです。`}
          </p>
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs font-medium text-primary">{category.name}</span>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
        </CardContent>
      </Link>
    </Card>
  )
}

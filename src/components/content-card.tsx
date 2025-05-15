import { FileText, Video, Music, File } from "lucide-react"
import { CONTENT_TYPES } from "@/lib/types"
import {
  BaseCard,
  CardImage,
  CardContent,
  CardBadge,
  CardLink,
  CardTitle,
  CardDescription
} from "@/components/ui/base-card"

interface ContentCardProps {
  title: string;
  slug: string;
  publishDate: string;
  category: {
    name: string;
    slug: string;
  };
  thumbnail?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  } | null;
  contentType: 'article' | 'video' | 'audio';
  description?: string;
}

export default function ContentCard({
  title,
  slug,
  publishDate,
  category,
  thumbnail,
  contentType,
  description,
}: ContentCardProps) {
  const getTypeInfo = () => {
    switch (contentType) {
      case 'article':
        return {
          icon: <FileText className="h-3 w-3" />,
          label: "記事",
          bgColor: "bg-blue-500",
          textColor: "text-white",
          gradient: "from-blue-400 via-blue-500 to-indigo-600",
        }
      case 'video':
        return {
          icon: <Video className="h-3 w-3" />,
          label: "動画",
          bgColor: "bg-red-500",
          textColor: "text-white",
          gradient: "from-red-400 via-red-500 to-pink-600",
        }
      case 'audio':
        return {
          icon: <Music className="h-3 w-3" />,
          label: "音声",
          bgColor: "bg-purple-500",
          textColor: "text-white",
          gradient: "from-purple-400 via-purple-500 to-indigo-600",
        }
      default:
        return {
          icon: <File className="h-3 w-3" />,
          label: "コンテンツ",
          bgColor: "bg-gray-500",
          textColor: "text-white",
          gradient: "from-gray-400 via-gray-500 to-gray-600",
        }
    }
  }

  const typeInfo = getTypeInfo()
  const formattedDate = new Date(publishDate).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  })

  // コンテンツタイプに応じたURLパスを生成
  const contentPath = `/${contentType}s/${slug}`;

  return (
    <div className={`p-[2px] rounded-xl bg-gradient-to-br ${typeInfo.gradient} transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] h-full`}>
      <div className="bg-white rounded-lg overflow-hidden h-full flex flex-col">
        <CardLink href={contentPath} className="flex flex-col h-full">
          <div className="flex-shrink-0">
            <CardImage
              src={
                thumbnail?.url ||
                "/placeholder.svg?height=200&width=444&query=business content"
              }
              alt={thumbnail?.alt || title}
              containerClassName="rounded-t-lg"
              priority={false}
            >
              <CardBadge color={typeInfo.bgColor} className="flex items-center">
                {typeInfo.icon}
                <span className={`ml-1 text-xs font-medium ${typeInfo.textColor}`}>{typeInfo.label}</span>
              </CardBadge>
            </CardImage>
          </div>
          <CardContent className="bg-gradient-to-br from-white via-blue-50/20 to-purple-50/30 flex-grow flex flex-col">
            <CardTitle className="text-gray-800">{title}</CardTitle>
            <CardDescription className="text-gray-600 mb-auto">
              {description || `${category.name}カテゴリの${typeInfo.label}コンテンツです。`}
            </CardDescription>
            <div className="flex items-center justify-between mt-3">
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">{category.name}</span>
              <span className="text-xs text-gray-500">{formattedDate}</span>
            </div>
          </CardContent>
        </CardLink>
      </div>
    </div>
  )
}

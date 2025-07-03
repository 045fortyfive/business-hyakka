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
import { generateUnsplashImageUrl, generateGradientCardDesign } from "@/utils/image-utils"

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

  // 画像がない場合の処理
  const shouldUseUnsplash = !thumbnail && Math.random() > 0.5
  const fallbackImageUrl = shouldUseUnsplash
    ? generateUnsplashImageUrl(category.name, 444, 250)
    : null

  const gradientDesign = generateGradientCardDesign(category.name, title, contentType)

  // コンテンツタイプに応じたURLパスを生成
  const contentPath = `/${contentType}s/${slug}`;

  return (
    <div className={`p-[2px] rounded-xl bg-gradient-to-br ${typeInfo.gradient} transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] h-full`}>
      <div className="bg-white rounded-lg overflow-hidden h-full flex flex-col">
        <CardLink href={contentPath} className="flex flex-col h-full">
          <div className="flex-shrink-0">
            {thumbnail?.url || fallbackImageUrl ? (
              <CardImage
                src={thumbnail?.url || fallbackImageUrl || ''}
                alt={thumbnail?.alt || title}
                containerClassName="rounded-t-lg"
                priority={false}
              >
                <CardBadge color={typeInfo.bgColor} className="flex items-center">
                  {typeInfo.icon}
                  <span className={`ml-1 text-xs font-medium ${typeInfo.textColor}`}>{typeInfo.label}</span>
                </CardBadge>
              </CardImage>
            ) : (
              <div className={`relative h-[200px] bg-gradient-to-br ${gradientDesign.gradientClass} rounded-t-lg overflow-hidden`}>
                {/* 背景パターン */}
                <div className="absolute inset-0 opacity-20">
                  <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px'
                  }} />
                </div>

                {/* コンテンツ */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="w-16 h-16 mx-auto mb-4" dangerouslySetInnerHTML={{ __html: gradientDesign.iconSvg }} />
                    <h3 className="text-lg font-semibold mb-2">{category.name}</h3>
                    <p className="text-sm opacity-90">{typeInfo.label}コンテンツ</p>
                  </div>
                </div>

                {/* バッジ */}
                <CardBadge color={typeInfo.bgColor} className="flex items-center absolute top-4 left-4">
                  {typeInfo.icon}
                  <span className={`ml-1 text-xs font-medium ${typeInfo.textColor}`}>{typeInfo.label}</span>
                </CardBadge>
              </div>
            )}

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

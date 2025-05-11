"use client"

import { useRef, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronLeft, ChevronRight, FileText, Video, Music, File } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ContentType, type ContentItem } from "@/lib/types"
import { cn } from "@/lib/utils"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

interface HeroCarouselProps {
  items: ContentItem[]
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      slidesToScroll: 2,
      dragFree: true,
      containScroll: "trimSnaps",
    },
    [Autoplay({ delay: 5000, stopOnInteraction: false })]
  )

  // コンテンツタイプに基づいたアイコンとバッジの色を取得
  const getContentTypeInfo = (type: ContentType) => {
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

  if (items.length === 0) {
    return null
  }

  // 日付のフォーマット関数
  const formatDate = (dateString?: string) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // カードコンポーネント
  const CarouselCard = ({ item }: { item: ContentItem }) => {
    const typeInfo = getContentTypeInfo(item.type)
    const formattedDate = formatDate(item.publishDate)

    return (
      <Card className="overflow-hidden transition-all hover:shadow-md border bg-white rounded-lg h-full">
        <Link href={`/content/${item.slug}`} className="flex flex-col h-full">
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <Image
              src={
                item.featuredImage ||
                item.thumbnail ||
                "/placeholder.svg?height=360&width=640&query=business content"
              }
              alt={item.title}
              fill
              className="object-cover object-center transition-transform hover:scale-105"
            />
            <div className={`absolute left-2 top-2 ${typeInfo.bgColor} rounded-md px-2 py-1 flex items-center`}>
              {typeInfo.icon}
              <span className={`ml-1 text-xs font-medium ${typeInfo.textColor}`}>{typeInfo.label}</span>
            </div>

            {/* 特集バッジ */}
            <div className="absolute right-2 top-2 bg-amber-500 rounded-md px-2 py-1">
              <span className="text-xs font-medium text-white">特集</span>
            </div>
          </div>

          <CardContent className="p-4 flex-grow">
            <h3 className="font-semibold text-base mb-2 line-clamp-2">{item.title}</h3>
            <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
              {item.description || `${item.category.name}カテゴリの${typeInfo.label}コンテンツです。`}
            </p>

            <div className="flex items-center justify-between mt-2">
              <span className="text-xs font-medium text-primary">{item.category.name}</span>
              <span className="text-xs text-muted-foreground">{formattedDate}</span>
            </div>
          </CardContent>
        </Link>
      </Card>
    )
  }

  return (
    <div className="relative mx-auto w-full">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-lg font-bold">おすすめコンテンツ</h2>
      </div>

      <div className="relative" ref={emblaRef}>
        <div className="flex overflow-hidden -ml-4">
          <div className="flex flex-row">
            {items.map((item, index) => (
              <div key={index} className="min-w-0 w-[280px] sm:w-[300px] md:w-[320px] lg:w-[360px] xl:w-[380px] pl-4">
                <CarouselCard item={item} />
              </div>
            ))}
          </div>
        </div>

        {/* ナビゲーションボタン */}
        <Button
          variant="outline"
          size="icon"
          className="absolute left-2 top-24 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-white text-primary hover:bg-white hover:text-primary shadow-md"
          onClick={() => emblaApi?.scrollPrev()}
        >
          <ChevronLeft className="h-4 w-4" />
          <span className="sr-only">前へ</span>
        </Button>

        <Button
          variant="outline"
          size="icon"
          className="absolute right-2 top-24 z-20 h-8 w-8 -translate-y-1/2 rounded-full bg-white text-primary hover:bg-white hover:text-primary shadow-md"
          onClick={() => emblaApi?.scrollNext()}
        >
          <ChevronRight className="h-4 w-4" />
          <span className="sr-only">次へ</span>
        </Button>
      </div>
    </div>
  )
}

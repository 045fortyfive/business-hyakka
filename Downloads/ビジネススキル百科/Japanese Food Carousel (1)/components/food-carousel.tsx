"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Bookmark } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import type { CarouselApi } from "@/components/ui/carousel"

// 食品データ
const foodItems = [
  {
    id: 1,
    title: "クラシック チーズバーガー",
    description:
      "ジューシーなビーフパティ、溶けたチェダーチーズ、新鮮なレタス、トマト、スモーキーなソースが入った、ふわふわのトーストバンズで提供。",
    image: "/delicious-burger.png",
    badge: "人気商品",
    badgeColor: "bg-gray-800",
    isSaved: false,
  },
  {
    id: 2,
    title: "ハニーグレイズド チキン",
    description:
      "カリカリのチキンに甘くて風味豊かな蜂蜜醤油のグレーズをかけ、ジャスミンライスの上にごまとネギを添えて。",
    image: "/honey-glazed-chicken.png",
    badge: "野菜",
    badgeColor: "bg-green-600",
    isSaved: false,
  },
  {
    id: 3,
    title: "スパイシー フライドチキン",
    description:
      "カリッとした黄金色のフライドチキンに辛味を効かせ、タンギーなディップソースを添えて。辛い物好きにぴったり！",
    image: "/spicy-fried-chicken-fries.png",
    badge: "ベストセラー",
    badgeColor: "bg-red-600",
    isSaved: false,
  },
  {
    id: 4,
    title: "野菜たっぷり サラダボウル",
    description: "新鮮な季節の野菜、アボカド、キヌア、ナッツ類を特製ドレッシングで和えた栄養満点のサラダボウル。",
    image: "/placeholder.svg?key=e18wm",
    badge: "ヘルシー",
    badgeColor: "bg-teal-600",
    isSaved: false,
  },
]

export default function FoodCarousel() {
  const [items, setItems] = useState(foodItems)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)

  const toggleSave = (id: number) => {
    setItems(items.map((item) => (item.id === id ? { ...item, isSaved: !item.isSaved } : item)))
  }

  const addToCart = (id: number) => {
    console.log(`商品ID: ${id}がカートに追加されました`)
    // ここに実際のカート追加ロジックを実装
  }

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  // 自動スクロール機能
  useEffect(() => {
    if (!api) return

    // 5秒ごとに次のスライドに移動
    const autoScrollInterval = setInterval(() => {
      api.scrollNext({ animation: "tween", duration: 1000 })
    }, 5000)

    return () => clearInterval(autoScrollInterval)
  }, [api])

  return (
    <div className="w-full">
      <Carousel
        setApi={setApi}
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {items.map((item) => (
            <CarouselItem key={item.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="h-full">
                <Card className="h-full overflow-hidden rounded-xl border-0 shadow-lg">
                  <div className="relative h-64 w-full">
                    <div className="absolute top-3 left-3 z-10">
                      <Badge className={`${item.badgeColor} text-white border-0`}>{item.badge}</Badge>
                    </div>
                    <button
                      onClick={() => toggleSave(item.id)}
                      className="absolute top-3 right-3 z-10 rounded-full bg-white/80 p-1.5 backdrop-blur-sm transition-colors hover:bg-white"
                    >
                      <Bookmark
                        className={`h-5 w-5 ${item.isSaved ? "fill-current text-gray-800" : "text-gray-500"}`}
                      />
                    </button>
                    <Image
                      src={item.image || "/placeholder.svg"}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                    <p className="text-gray-600 text-sm">{item.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      onClick={() => addToCart(item.id)}
                      className="w-full bg-white text-black border border-gray-200 hover:bg-gray-100"
                    >
                      カートに追加
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex justify-center mt-4 gap-2">
          <CarouselPrevious className="relative static" />
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <span>{current}</span>
            <span>/</span>
            <span>{count}</span>
          </div>
          <CarouselNext className="relative static" />
        </div>
      </Carousel>
    </div>
  )
}

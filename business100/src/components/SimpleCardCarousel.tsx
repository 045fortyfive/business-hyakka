'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface SimpleCardSlide {
  id: string
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  linkText: string
  category?: string
}

interface SimpleCardCarouselProps {
  slides: SimpleCardSlide[]
  autoplayInterval?: number
  pauseOnHover?: boolean
}

export function SimpleCardCarousel({
  slides,
  autoplayInterval = 5000,
  pauseOnHover = true
}: SimpleCardCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 自動スライド切り替え
  useEffect(() => {
    if (slides.length <= 1 || isPaused) return

    const startAutoplay = () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
      }

      autoplayTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, autoplayInterval)
    }

    startAutoplay()

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
        autoplayTimerRef.current = null
      }
    }
  }, [slides.length, autoplayInterval, isPaused])

  // ホバー時の一時停止
  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(true)
    }
  }, [pauseOnHover])

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) {
      setIsPaused(false)
    }
  }, [pauseOnHover])

  // 前のスライドに移動
  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [slides.length])

  // 次のスライドに移動
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [slides.length])

  // スライドの相対位置を計算
  const getVisibleSlides = useCallback(() => {
    const visibleSlides = []
    const totalSlides = slides.length

    // 表示するスライドのインデックスを計算
    for (let i = -2; i <= 2; i++) {
      let index = (currentSlide + i + totalSlides) % totalSlides
      visibleSlides.push({
        slide: slides[index],
        position: i,
        isActive: i === 0,
        isAdjacent: Math.abs(i) === 1,
        isEdge: Math.abs(i) === 2
      })
    }

    return visibleSlides
  }, [currentSlide, slides])

  if (slides.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 mb-8">
        <div className="max-w-3xl">
          <h2 className="text-2xl font-bold mb-4">
            コンテンツがありません
          </h2>
          <p className="text-lg mb-4">
            現在、表示するコンテンツがありません。
          </p>
        </div>
      </div>
    )
  }

  const visibleSlides = getVisibleSlides()

  return (
    <div className="mb-12">
      {/* タイトルは親コンポーネントで設定するため削除 */}

      <div
        className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 py-12"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* カードカルーセル */}
        <div className="relative h-[480px] mx-auto">
          <div className="absolute inset-0 flex items-center justify-center">
            {visibleSlides.map(({ slide, position, isActive, isAdjacent, isEdge }) => {
              // 位置に基づいてスタイルを計算
              const translateX = position * 120; // カードの間隔を広げて両端が見切れるように
              const zIndex = 10 - Math.abs(position) * 2;
              const scale = isActive ? 1 : isAdjacent ? 0.85 : 0.7;
              const opacity = isActive ? 1 : isAdjacent ? 0.8 : 0.6;

              return (
                <div
                  key={slide.id}
                  className="absolute w-[320px] transition-all duration-300 ease-in-out"
                  style={{
                    transform: `translateX(${translateX}%) scale(${scale})`,
                    opacity,
                    zIndex,
                  }}
                >
                  <Link
                    href={slide.linkUrl}
                    className={`block ${isActive || isAdjacent ? 'cursor-pointer' : 'pointer-events-none'}`}
                  >
                    {/* カード全体のコンテナ */}
                    <div className={`w-[320px] bg-white rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                      isActive ? 'ring-2 ring-blue-500 shadow-xl' : ''
                    }`}>
                      {/* 画像部分 - 正方形 */}
                      <div className="relative w-full aspect-square">
                        <Image
                          src={
                            !slide.imageUrl ? '/placeholder.svg' :
                            slide.imageUrl.startsWith('/') ? slide.imageUrl :
                            slide.imageUrl.startsWith('http') ? slide.imageUrl :
                            `https:${slide.imageUrl}`
                          }
                          alt={slide.title}
                          fill
                          className="object-cover"
                          sizes="320px"
                          priority={isActive}
                        />

                        {/* カテゴリーバッジ */}
                        {slide.category && (
                          <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-sm text-white text-sm px-3 py-1.5 rounded-full">
                            {slide.category}
                          </div>
                        )}
                      </div>

                      {/* 詳細部分 - 下部に配置 */}
                      <div className="p-4 bg-white">
                        <h3 className="font-semibold text-base md:text-lg line-clamp-2 text-gray-900">
                          {slide.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                          {slide.description}
                        </p>
                        <div className="mt-3 flex justify-between items-center">
                          <span className="text-xs text-gray-500">{slide.category}</span>
                          <span className="text-xs text-blue-600 font-medium">{slide.linkText}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            })}
          </div>
        </div>

        {/* ナビゲーションボタン */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/3 -translate-y-1/2 z-20 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="前のスライド"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/3 -translate-y-1/2 z-20 bg-white hover:bg-gray-100 text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="次のスライド"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* インジケーター - 中央に配置 */}
        {slides.length > 1 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex justify-center space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-blue-500 scale-125'
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`スライド ${index + 1} に移動`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

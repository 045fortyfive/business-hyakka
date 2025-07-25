'use client'

import { useState, useEffect, useRef } from 'react'
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
  autoplayInterval = 3000,
  pauseOnHover = true
}: SimpleCardCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

  // 自動スライド切り替え
  useEffect(() => {
    if (slides.length <= 1) return

    const startAutoplay = () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
      }

      autoplayTimerRef.current = setInterval(() => {
        setCurrentSlide(prev => (prev + 1) % slides.length)
      }, autoplayInterval)
    }

    if (!isPaused) {
      startAutoplay()
    }

    return () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
        autoplayTimerRef.current = null
      }
    }
  }, [slides.length, autoplayInterval, isPaused])

  // ホバー時の一時停止
  const handleMouseEnter = () => {
    if (pauseOnHover) {
      setIsPaused(true)
    }
  }

  const handleMouseLeave = () => {
    if (pauseOnHover) {
      setIsPaused(false)
    }
  }

  // 前のスライドに移動
  const prevSlide = () => {
    setCurrentSlide(prev => (prev - 1 + slides.length) % slides.length)
  }

  // 次のスライドに移動
  const nextSlide = () => {
    setCurrentSlide(prev => (prev + 1) % slides.length)
  }

  // 特定のスライドに移動
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
  }

  // 表示するスライドを計算
  const getVisibleSlides = () => {
    const result = []
    const totalSlides = slides.length

    for (let i = -2; i <= 2; i++) {
      const index = (currentSlide + i + totalSlides) % totalSlides
      result.push({
        slide: slides[index],
        position: i,
        isActive: i === 0,
        isAdjacent: Math.abs(i) === 1,
        isEdge: Math.abs(i) === 2
      })
    }

    return result
  }

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
      <div
        className="relative overflow-hidden rounded-xl py-12"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 背景ぼかし効果 - 白ベースでぼかしを強化 */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 w-full h-full bg-white">
            {slides[currentSlide]?.imageUrl ? (
              <Image
                src={slides[currentSlide].imageUrl}
                alt="Background"
                fill
                className="object-cover scale-125 blur-2xl opacity-50"
                priority
                unoptimized={true}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-blue-200 via-purple-200 to-pink-200 opacity-50" />
            )}
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-gray-100/80 to-white/80 backdrop-blur-sm" />
        </div>

        {/* カードカルーセル */}
        <div className="relative h-[187px] sm:h-[221px] md:h-[272px] mx-auto z-10">
          <div className="absolute inset-0 flex items-center justify-center">
            {visibleSlides.map(({ slide, position, isActive, isAdjacent }) => {
              // 位置に基づいてスタイルを計算
              // スマホ表示時は両端が見切れるように調整
              const isMobile = typeof window !== 'undefined' && window.innerWidth <= 640
              const translateX = position * (isMobile ? 100 : 120)
              const zIndex = 10 - Math.abs(position) * 2
              const scale = isActive ? 1 : isAdjacent ? 0.85 : 0.7
              const opacity = isActive ? 1 : isAdjacent ? 0.8 : 0.6

              return (
                <div
                  key={slide.id}
                  className="absolute w-[170px] h-[170px] sm:w-[204px] sm:h-[204px] md:w-[238px] md:h-[238px] transition-all duration-300 ease-in-out"
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
                    <div className={`w-full h-full p-[2px] bg-gradient-to-br from-blue-400 via-sky-500 to-indigo-600 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                      isActive ? 'scale-105' : ''
                    }`}>
                      <div className="bg-white rounded-lg flex flex-col h-full">
                        {/* 画像部分 */}
                        <div className="relative w-full h-[85px] sm:h-[102px] md:h-[119px]">
                          {slide.imageUrl ? (
                            <Image
                              src={slide.imageUrl}
                              alt={slide.title}
                              fill
                              className="object-cover"
                              sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, 320px"
                              priority={isActive}
                              unoptimized={true}
                            />
                          ) : (
                            // 画像がない場合のグラデーション背景
                            <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center">
                              <div className="text-center text-white p-2">
                                <h4 className="text-xs sm:text-sm font-bold line-clamp-2">{slide.title}</h4>
                              </div>
                            </div>
                          )}

                          {/* カテゴリーバッジ */}
                          {slide.category && (
                            <div className="absolute top-0 right-0 m-1 sm:m-1.5 md:m-2">
                              <span className="inline-block text-[10px] sm:text-xs md:text-sm font-medium px-1.5 sm:px-2 md:px-2.5 py-0.5 rounded-full bg-white/90 text-gray-800">
                                {slide.category}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 詳細部分 */}
                        <div className="flex-1 p-1 sm:p-1.5 md:p-2 bg-gradient-to-br from-blue-800/95 via-sky-800/95 to-indigo-700/95">
                          <h3 className="text-xs sm:text-sm md:text-base font-bold mb-0.5 line-clamp-2 text-white">
                            {slide.title}
                          </h3>
                          <p className="text-[10px] sm:text-xs md:text-sm text-gray-100 mb-0.5 line-clamp-1 sm:line-clamp-2">
                            {slide.description}
                          </p>
                          <div className="mt-auto flex justify-between items-center">
                            <span className="text-[10px] sm:text-xs md:text-sm text-gray-200">{slide.category}</span>
                            <span className="inline-block px-1.5 sm:px-2 md:px-3 py-0.5 text-[10px] sm:text-xs md:text-sm bg-white text-gray-800 rounded-lg">
                              {slide.linkText}
                            </span>
                          </div>
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
              className="absolute left-1 sm:left-2 md:left-4 top-1/2 -translate-y-1/2 z-20 bg-blue-500/90 hover:bg-blue-600 text-white rounded-full p-1.5 sm:p-2 md:p-2.5 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="前のスライド"
            >
              <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-1 sm:right-2 md:right-4 top-1/2 -translate-y-1/2 z-20 bg-blue-500/90 hover:bg-blue-600 text-white rounded-full p-1.5 sm:p-2 md:p-2.5 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="次のスライド"
            >
              <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
            </button>
          </>
        )}

        {/* インジケーター */}
        {slides.length > 1 && (
          <div className="absolute bottom-1 sm:bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 z-20 flex justify-center space-x-1.5 sm:space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-2.5 md:h-2.5 rounded-full transition-all duration-300 ${
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

'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface HeroSlide {
  id: string
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  linkText: string
  category?: string
}

interface HeroCarouselProps {
  slides: HeroSlide[]
  autoplayInterval?: number
  pauseOnHover?: boolean
}

export function HeroCarousel({
  slides,
  autoplayInterval = 5000,
  pauseOnHover = true
}: HeroCarouselProps) {
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

  if (slides.length === 0) {
    return (
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 md:p-12 mb-12">
        <div className="max-w-3xl">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            ビジネススキルを効率的に学び、キャリアを加速させよう
          </h1>
          <p className="text-lg md:text-xl mb-6">
            若手ビジネスパーソンのためのスキルアップ情報サイト。
            記事、動画、音声で、いつでもどこでもビジネススキルを学べます。
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              href="/articles"
              className="bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-colors"
            >
              記事を読む
            </Link>
            <Link
              href="/videos"
              className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-medium transition-colors"
            >
              動画を見る
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="mb-16">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">注目のコンテンツ</h2>
      </div>

      <div
        className="relative overflow-hidden rounded-2xl bg-gray-900"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 背景ブラー効果 */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {slides.length > 0 && (
            <Image
              src={slides[currentSlide].imageUrl}
              alt="Background"
              fill
              className="object-cover scale-125 blur-3xl opacity-30"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50 backdrop-blur-lg" />
        </div>

        {/* カードカルーセル */}
        <div className="relative z-10 py-16 px-4">
          <div className="mx-auto max-w-6xl">
            <div className="flex overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {slides.map((slide, index) => (
                  <div key={slide.id} className="w-full flex-shrink-0 px-4 flex justify-center">
                    <div className="w-full max-w-sm">
                      <Link href={slide.linkUrl} className="block">
                        <div className="bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden shadow-lg border border-white/20 transition-all duration-300 hover:shadow-xl hover:translate-y-[-5px]">
                          {/* 正方形カード */}
                          <div className="aspect-square relative">
                            {/* 上半分：画像 */}
                            <div className="absolute inset-0 h-1/2 overflow-hidden">
                              <div className="relative w-full h-full">
                                <Image
                                  src={slide.imageUrl}
                                  alt={slide.title}
                                  fill
                                  className="object-cover"
                                  priority={index === currentSlide}
                                />
                              </div>
                              {slide.category && (
                                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                                  {slide.category}
                                </div>
                              )}
                              {index === currentSlide && (
                                <div className="absolute top-3 right-3 bg-blue-600/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                  注目
                                </div>
                              )}
                            </div>

                            {/* 下半分：コンテンツ */}
                            <div className="absolute bottom-0 left-0 right-0 h-1/2 p-4 bg-gradient-to-br from-gray-900/90 to-gray-800/90 text-white">
                              <h3 className="font-semibold mb-2 line-clamp-2 text-base sm:text-lg">
                                {slide.title}
                              </h3>
                              <p className="text-sm text-gray-300 mb-3 line-clamp-2">
                                {slide.description}
                              </p>
                              <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
                                <span className="inline-block bg-blue-900/50 border border-blue-500/30 text-blue-200 px-3 py-1 rounded-full text-xs font-medium">
                                  {slide.linkText}
                                </span>
                                {index === currentSlide && (
                                  <span className="text-xs text-gray-400">詳細を見る</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 自動再生インジケーター */}
        {slides.length > 1 && (
          <div className="absolute top-4 right-4 z-30">
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-full p-2 transition-colors"
              aria-label={isPaused ? "再生" : "一時停止"}
            >
              {isPaused ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"></polygon>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="6" y="4" width="4" height="16"></rect>
                  <rect x="14" y="4" width="4" height="16"></rect>
                </svg>
              )}
            </button>
          </div>
        )}

        {/* インジケーターとナビゲーションの統合コントロール */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-0 right-0 z-30 flex justify-between items-center px-6">
            {/* 左矢印 */}
            <button
              onClick={prevSlide}
              className="bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full p-3 transition-colors shadow-lg"
              aria-label="前のスライド"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            {/* 中央インジケーター */}
            <div className="flex justify-center space-x-3">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'bg-white scale-125 shadow-md'
                      : 'bg-white/30 hover:bg-white/60'
                  }`}
                  aria-label={`スライド ${index + 1} に移動`}
                />
              ))}
            </div>

            {/* 右矢印 */}
            <button
              onClick={nextSlide}
              className="bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full p-3 transition-colors shadow-lg"
              aria-label="次のスライド"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

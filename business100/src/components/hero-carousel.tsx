'use client'

import { useState, useEffect, useRef } from 'react'
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
}

export function HeroCarousel({ slides, autoplayInterval = 5000 }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  // 自動スライド切り替え
  useEffect(() => {
    if (slides.length <= 1) return

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, autoplayInterval)

    return () => clearInterval(interval)
  }, [slides.length, autoplayInterval])

  // 前のスライドに移動
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  // 次のスライドに移動
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

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

      <div className="relative overflow-hidden rounded-2xl">
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
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * (100 / slides.length)}%)` }}
          >
            {slides.map((slide, index) => {
              // 現在のスライドかどうかを判定
              const isActive = index === currentSlide;
              // 現在のスライドの前後のスライドかどうかを判定
              const isAdjacent = index === (currentSlide - 1 + slides.length) % slides.length ||
                                index === (currentSlide + 1) % slides.length;

              return (
                <div
                  key={slide.id}
                  className={`w-full md:w-1/2 lg:w-1/3 xl:w-1/4 flex-shrink-0 px-3 transition-all duration-500 ${
                    isActive ? 'scale-110 z-20' : isAdjacent ? 'scale-95 opacity-70' : 'scale-90 opacity-50'
                  }`}
                >
                  <Link href={slide.linkUrl} className="block h-full">
                    <div className={`bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:translate-y-[-5px] h-full flex flex-col border border-white/20 ${
                      isActive ? 'shadow-2xl' : 'shadow-md'
                    }`}>
                      {/* カード画像 */}
                      <div className="relative h-56 overflow-hidden">
                        <Image
                          src={slide.imageUrl}
                          alt={slide.title}
                          fill
                          priority={isActive}
                          className={`object-cover transition-transform duration-500 ${
                            isActive ? 'scale-105' : 'scale-100'
                          }`}
                        />
                        {slide.category && (
                          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-sm text-white text-xs font-medium px-2.5 py-1 rounded-full">
                            {slide.category}
                          </div>
                        )}
                        {isActive && (
                          <div className="absolute top-3 right-3 bg-blue-600/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                            注目
                          </div>
                        )}
                      </div>

                      {/* カードコンテンツ */}
                      <div className="p-5 bg-gradient-to-br from-gray-900/90 to-gray-800/90 text-white flex-grow">
                        <h3 className={`font-semibold mb-2 line-clamp-2 transition-all duration-300 ${
                          isActive ? 'text-xl' : 'text-lg'
                        }`}>{slide.title}</h3>
                        <p className="text-sm text-gray-300 mb-4 line-clamp-2">{slide.description}</p>
                        <div className="mt-auto flex justify-between items-center">
                          <span className="inline-block bg-blue-900/50 border border-blue-500/30 text-blue-200 px-3 py-1 rounded-full text-xs font-medium">
                            {slide.linkText}
                          </span>
                          {isActive && <span className="text-xs text-gray-400">詳細を見る</span>}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>

        {/* ナビゲーションボタン */}
        {slides.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full p-3 transition-colors shadow-lg"
              aria-label="前のスライド"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-30 bg-black/40 hover:bg-black/60 backdrop-blur-sm text-white rounded-full p-3 transition-colors shadow-lg"
              aria-label="次のスライド"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </>
        )}

        {/* インジケーター */}
        {slides.length > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex justify-center space-x-3">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white scale-110 shadow-md'
                    : 'bg-white/30 hover:bg-white/60'
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

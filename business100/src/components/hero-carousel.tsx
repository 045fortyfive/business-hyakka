'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

interface HeroSlide {
  id: string
  title: string
  description: string
  imageUrl: string
  linkUrl: string
  linkText: string
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
    <div className="mb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">注目のコンテンツ</h2>
      </div>

      <div className="relative">
        {/* カードカルーセル */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * (100 / slides.length)}%)` }}
          >
            {slides.map((slide, index) => (
              <div
                key={slide.id}
                className="w-full md:w-1/2 lg:w-1/3 xl:w-1/5 flex-shrink-0 px-2"
              >
                <Link href={slide.linkUrl} className="block h-full">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-5px] h-full flex flex-col">
                    {/* カード画像 */}
                    <div className="relative h-48">
                      <Image
                        src={slide.imageUrl}
                        alt={slide.title}
                        fill
                        priority={index === 0}
                        className="object-cover"
                      />
                      <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-semibold px-2 py-1 rounded-bl-lg">
                        注目
                      </div>
                    </div>

                    {/* カードコンテンツ */}
                    <div className="p-4 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/30 flex-grow">
                      <h3 className="text-lg font-semibold mb-2 line-clamp-2">{slide.title}</h3>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{slide.description}</p>
                      <div className="mt-auto">
                        <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                          {slide.linkText}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

      {/* ナビゲーションボタン */}
      {slides.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-30 bg-white shadow-md hover:bg-gray-100 rounded-r-full p-3 text-gray-700 transition-colors"
            aria-label="前のスライド"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-30 bg-white shadow-md hover:bg-gray-100 rounded-l-full p-3 text-gray-700 transition-colors"
            aria-label="次のスライド"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      {/* インジケーター */}
      {slides.length > 1 && (
        <div className="mt-6 flex justify-center space-x-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                index === currentSlide ? 'bg-blue-600' : 'bg-gray-300'
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

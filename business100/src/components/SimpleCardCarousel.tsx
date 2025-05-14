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

    console.log('Starting autoplay timer...')

    const startAutoplay = () => {
      if (autoplayTimerRef.current) {
        clearInterval(autoplayTimerRef.current)
      }

      autoplayTimerRef.current = setInterval(() => {
        console.log('Auto advancing slide...')
        setCurrentSlide((prev) => {
          const next = (prev + 1) % slides.length
          console.log(`Changing slide from ${prev} to ${next}`)
          return next
        })
      }, autoplayInterval)
    }

    startAutoplay()

    return () => {
      console.log('Cleaning up autoplay timer...')
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
    console.log('Manual prev slide...')
    // 自動再生タイマーをリセット
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current)
      autoplayTimerRef.current = null
    }

    setCurrentSlide((prev) => {
      const next = (prev - 1 + slides.length) % slides.length
      console.log(`Changing slide from ${prev} to ${next} (prev)`)
      return next
    })

    // 一時停止していない場合は自動再生を再開
    if (!isPaused) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, autoplayInterval)
    }
  }, [slides.length, autoplayInterval, isPaused])

  // 次のスライドに移動
  const nextSlide = useCallback(() => {
    console.log('Manual next slide...')
    // 自動再生タイマーをリセット
    if (autoplayTimerRef.current) {
      clearInterval(autoplayTimerRef.current)
      autoplayTimerRef.current = null
    }

    setCurrentSlide((prev) => {
      const next = (prev + 1) % slides.length
      console.log(`Changing slide from ${prev} to ${next} (next)`)
      return next
    })

    // 一時停止していない場合は自動再生を再開
    if (!isPaused) {
      autoplayTimerRef.current = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % slides.length)
      }, autoplayInterval)
    }
  }, [slides.length, autoplayInterval, isPaused])

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
        className="relative overflow-hidden rounded-xl py-12"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 背景ぼかし効果 */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {slides.length > 0 && (
            <Image
              src={slides[currentSlide].imageUrl || '/placeholder.svg'}
              alt="Background"
              fill
              className="object-cover scale-150 blur-3xl opacity-30"
              priority
              unoptimized={true}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-gray-800/80 to-gray-900/90 backdrop-blur-md" />
        </div>
        {/* カードカルーセル */}
        <div className="relative h-[400px] mx-auto z-10">
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
                    {/* カード全体のコンテナ - SquareCardと同様のデザイン */}
                    <div className={`w-[320px] p-[2px] bg-gradient-to-br from-blue-400 via-sky-500 to-indigo-600 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                      isActive ? 'scale-105' : ''
                    }`}>
                      <div className="bg-white rounded-lg flex flex-col h-[320px]">
                        {/* 画像部分 - 16:9比率 */}
                        <div className="relative w-full h-[180px]">
                          <Image
                            src={slide.imageUrl || '/placeholder.svg'}
                            alt={slide.title}
                            fill
                            className="object-cover"
                            sizes="320px"
                            priority={isActive}
                            unoptimized={true}
                          />

                          {/* カテゴリーバッジ */}
                          {slide.category && (
                            <div className="absolute top-0 right-0 m-3">
                              <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                                {slide.category}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* 詳細部分 - 下部に配置 */}
                        <div className="flex-1 p-4 bg-gradient-to-br from-blue-800/95 via-sky-800/95 to-indigo-700/95">
                          <h3 className="text-lg font-bold mb-2 line-clamp-2 text-white">
                            {slide.title}
                          </h3>
                          <p className="text-sm text-gray-100 mb-3 line-clamp-2">
                            {slide.description}
                          </p>
                          <div className="mt-auto flex justify-between items-center">
                            <span className="text-xs text-gray-200">{slide.category}</span>
                            <span className="inline-block px-3 py-1 text-sm bg-white text-gray-800 rounded-lg">
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
              className="absolute left-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
              aria-label="前のスライド"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white text-gray-800 rounded-full p-3 shadow-lg transition-all duration-200 hover:scale-110"
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
                onClick={() => {
                  console.log(`Indicator click: changing to slide ${index}`)
                  // 自動再生タイマーをリセット
                  if (autoplayTimerRef.current) {
                    clearInterval(autoplayTimerRef.current)
                    autoplayTimerRef.current = null
                  }

                  setCurrentSlide(index)

                  // 一時停止していない場合は自動再生を再開
                  if (!isPaused) {
                    autoplayTimerRef.current = setInterval(() => {
                      setCurrentSlide((prev) => (prev + 1) % slides.length)
                    }, autoplayInterval)
                  }
                }}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? 'bg-white scale-125'
                    : 'bg-gray-400/50 hover:bg-gray-300/70'
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

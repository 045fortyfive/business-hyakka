'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { GradientPlaceholder } from '@/utils/gradient-card-design'

interface HeroSlide {
  id: string
  title: string
  description: string
  imageUrl: string | null
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
  const carouselRef = useRef<HTMLDivElement>(null)
  const autoplayTimerRef = useRef<NodeJS.Timeout | null>(null)

  // スライドの総数に基づいて表示位置を計算
  const getSlidePosition = useCallback((index: number) => {
    // 現在のスライドからの相対位置を計算
    const totalSlides = slides.length
    let relativePosition = index - currentSlide

    // 最短経路で移動するための調整
    if (relativePosition > totalSlides / 2) {
      relativePosition -= totalSlides
    } else if (relativePosition < -totalSlides / 2) {
      relativePosition += totalSlides
    }

    return relativePosition
  }, [currentSlide, slides.length])

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
        className="relative overflow-hidden rounded-2xl"
        ref={carouselRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* 背景ブラー効果 - 明るさ調整 */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          {slides.length > 0 && slides[currentSlide].imageUrl && (
            <Image
              src={slides[currentSlide].imageUrl}
              alt="Background"
              fill
              className="object-cover scale-150 blur-sm opacity-40"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-black/50 backdrop-blur-lg" />
        </div>

        {/* 画像カルーセル */}
        <div className="relative z-10 py-12 px-4 pb-28">
          {/* 画像コンテナ - 中央揃えのためのフレックスコンテナ */}
          <div className="flex justify-center items-center">
            {/* 画像ラッパー - 実際のカルーセル部分 */}
            <div className="relative w-full max-w-6xl h-[340px]">
              {/* 画像トラック - スライド移動用 */}
              <div className="flex h-full">
                {slides.map((slide, index) => {
                  // スライドの相対位置を計算
                  const position = getSlidePosition(index);

                  // 現在のスライドかどうかを判定
                  const isActive = position === 0;

                  // 隣接スライドかどうかを判定
                  const isAdjacent = Math.abs(position) === 1;

                  // 表示するかどうかを判定（パフォーマンス向上のため）
                  const isVisible = Math.abs(position) <= 2;

                  // 位置に基づいてスタイルを計算
                  const translateX = position * 100;
                  const zIndex = 20 - Math.abs(position) * 5;
                  const scale = isActive ? 1.1 : isAdjacent ? 0.85 : 0.7;
                  const opacity = isActive ? 1 : isAdjacent ? 0.7 : 0.3;

                  if (!isVisible) return null;

                  return (
                    <div
                      key={slide.id}
                      className="absolute top-1/2 left-1/2 w-full md:w-1/2 lg:w-1/3 xl:w-1/4 px-3 transition-all duration-500"
                      style={{
                        transform: `translate(-50%, -50%) translateX(${translateX}%) scale(${scale})`,
                        opacity,
                        zIndex,
                      }}
                    >
                      <div className={`rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                        isActive ? 'shadow-2xl' : 'shadow-md'
                      }`}>
                        {slide.imageUrl ? (
                          /* 画像ありカード */
                          <div className="relative aspect-square overflow-hidden">
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
                        ) : (
                          /* 画像なしカード - フルサイズグラデーション背景 */
                          <div className="relative aspect-square overflow-hidden">
                            <GradientPlaceholder
                              title={slide.title}
                              categoryName={slide.category || 'デフォルト'}
                              contentType="記事"
                              className="w-full h-full"
                            />
                            {isActive && (
                              <div className="absolute top-3 right-3 bg-blue-600/80 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                                注目
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* 現在のスライドのタイトルと説明文 - Hero全体の下部に配置 */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-black/0 pt-16 pb-8 px-6 z-20">
            <div className="max-w-3xl mx-auto text-center">
              <h3 className="text-2xl font-bold text-white mb-2">
                {slides[currentSlide].title}
              </h3>
              <p className="text-lg text-gray-300 mb-4">
                {slides[currentSlide].description}
              </p>
              <Link
                href={slides[currentSlide].linkUrl}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full font-medium transition-colors"
              >
                {slides[currentSlide].linkText}
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14"></path>
                  <path d="m12 5 7 7-7 7"></path>
                </svg>
              </Link>
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
          <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-30 flex justify-center space-x-3">
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

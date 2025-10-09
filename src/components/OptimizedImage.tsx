'use client'

import { useState } from 'react'
import Image from 'next/image'
import { optimizeContentfulImage, generateResponsiveSrcSet, generateRetinaResponsiveSrcSet } from '@/utils/image-optimization'
import { optimizeForPC, generatePCResponsiveSrcSet, generateRetinaForPC, generateBlurPlaceholder } from '@/utils/contentful-image-optimizer'

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  quality?: number
  sizes?: string
  useRetina?: boolean
  placeholder?: 'blur' | 'empty'
  blurDataURL?: string
}

/**
 * Contentful画像用の最適化されたImageコンポーネント
 * 高品質表示とレスポンシブ対応を自動で行う
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className = '',
  priority = false,
  quality = 75,
  sizes = '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
  useRetina = true,
  placeholder = 'blur',
  blurDataURL
}: OptimizedImageProps) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // 画像エラー時のフォールバック
  if (imageError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">画像を読み込めませんでした</span>
      </div>
    )
  }

  // Contentful画像の最適化（PC向け高品質設定）
  const optimizedSrc = optimizeForPC(src, 'article', {
    width: fill ? undefined : width,
    height: fill ? undefined : height,
    quality,
    format: 'webp'
  })

  // レスポンシブsrcSetの生成（PC向け高解像度対応）
  let srcSet = ''
  if (!fill && width && useRetina) {
    // 高解像度ディスプレイ対応
    srcSet = generateRetinaForPC(src, width, 'article')
  } else if (!fill) {
    // 通常のレスポンシブ対応
    srcSet = generatePCResponsiveSrcSet(src, 'article')
  }

  // ブラーデータURLの生成
  const blurURL = blurDataURL || generateBlurPlaceholder(src)

  return (
    <div className={`relative ${isLoading ? 'animate-pulse bg-gray-200' : ''}`}>
      <Image
        src={optimizedSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        priority={priority}
        quality={quality}
        sizes={fill ? sizes : undefined}
        srcSet={srcSet || undefined}
        placeholder={placeholder}
        blurDataURL={placeholder === 'blur' ? blurURL : undefined}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true)
          setIsLoading(false)
        }}
        style={{
          objectFit: 'cover',
        }}
      />
    </div>
  )
}

/**
 * カード用の最適化された画像コンポーネント
 * 小さいサイズでも高品質を保つ設定
 */
export function OptimizedCardImage({
  src,
  alt,
  className = 'object-cover',
  priority = false
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
}) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // URLの検証
  if (!src || src.trim() === '') {
    console.error('OptimizedCardImage: Empty or invalid src provided')
    return (
      <div className="bg-gray-200 flex items-center justify-center h-full w-full">
        <span className="text-gray-400 text-sm">画像URLが無効です</span>
      </div>
    )
  }

  if (imageError) {
    console.error('OptimizedCardImage: Failed to load image:', src)
    return (
      <div className="bg-gray-200 flex items-center justify-center h-full w-full">
        <span className="text-gray-400 text-sm">画像を読み込めませんでした</span>
      </div>
    )
  }

  // PC向けカード画像最適化
  const optimizedSrc = optimizeForPC(src, 'card')
  const srcSet = generatePCResponsiveSrcSet(src, 'card')
  const blurURL = generateBlurPlaceholder(src)

  return (
    <div className={`relative ${isLoading ? 'animate-pulse bg-gray-200' : ''}`}>
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        priority={priority}
        quality={75}
        sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
        srcSet={srcSet}
        placeholder="blur"
        blurDataURL={blurURL}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true)
          setIsLoading(false)
        }}
        style={{
          objectFit: 'cover',
        }}
      />
    </div>
  )
}

/**
 * ヒーロー画像用の最適化されたコンポーネント
 * 大きいサイズで最高品質を保つ設定
 */
export function OptimizedHeroImage({
  src,
  alt,
  className = 'object-cover',
  priority = true
}: {
  src: string
  alt: string
  className?: string
  priority?: boolean
}) {
  const [imageError, setImageError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  if (imageError) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className="text-gray-400 text-sm">画像を読み込めませんでした</span>
      </div>
    )
  }

  // PC向けヒーロー画像最適化（最高品質）
  const optimizedSrc = optimizeForPC(src, 'hero')
  const srcSet = generatePCResponsiveSrcSet(src, 'hero')
  const blurURL = generateBlurPlaceholder(src)

  return (
    <div className={`relative ${isLoading ? 'animate-pulse bg-gray-200' : ''}`}>
      <Image
        src={optimizedSrc}
        alt={alt}
        fill
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        } ${className}`}
        priority={priority}
        quality={82}
        sizes="100vw"
        srcSet={srcSet}
        placeholder="blur"
        blurDataURL={blurURL}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setImageError(true)
          setIsLoading(false)
        }}
        style={{
          objectFit: 'cover',
        }}
      />
    </div>
  )
}

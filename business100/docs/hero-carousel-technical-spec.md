# Heroカルーセル技術仕様書

このドキュメントは、ビジネススキル百科サイトで使用されているHeroカルーセルの技術仕様と実装詳細を説明します。他のAIエージェントやデベロッパーが同様の機能を再現できるように、コードや設定の詳細を含めています。

## 1. 技術スタック

- **フレームワーク**: Next.js 14.0.4 (App Router)
- **スタイリング**: Tailwind CSS 3.3.0
- **言語**: TypeScript 5.0.4
- **画像最適化**: Next.js Image コンポーネント
- **アイコン**: Lucide React 0.294.0

## 2. コンポーネント構造

Heroカルーセルは `SimpleCardCarousel` コンポーネントとして実装されています。このコンポーネントは以下の機能を提供します：

- 複数のカードを表示するカルーセル
- 自動スライド切り替え機能
- ホバー時の一時停止機能
- 前後のスライドを部分的に表示する3Dカルーセル効果
- レスポンシブデザイン（モバイル、タブレット、デスクトップ）
- 背景のぼかし効果

## 3. コンポーネントのインターフェース

```typescript
interface SimpleCardSlide {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  linkUrl: string;
  linkText: string;
  category?: string;
}

interface SimpleCardCarouselProps {
  slides: SimpleCardSlide[];
  autoplayInterval?: number;
  pauseOnHover?: boolean;
}
```

## 4. 主要コード

### 4.1 コンポーネント全体のコード構造

```tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

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
    // 実装詳細...
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
    // 実装詳細...
  }

  // レンダリング
  return (
    <div className="mb-12">
      {/* カルーセル実装 */}
    </div>
  )
}
```

### 4.2 自動スライド切り替え機能

```tsx
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
```

### 4.3 表示するスライドの計算

```tsx
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
```

### 4.4 カルーセルのレンダリング

```tsx
<div
  className="relative h-[280px] sm:h-[320px] md:h-[400px] mx-auto z-10"
>
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
          className="absolute w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] md:w-[320px] md:h-[320px] transition-all duration-300 ease-in-out"
          style={{
            transform: `translateX(${translateX}%) scale(${scale})`,
            opacity,
            zIndex,
          }}
        >
          {/* カードの内容 */}
        </div>
      )
    })}
  </div>
</div>
```

### 4.5 カードデザイン

```tsx
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
      <div className="relative w-full h-[120px] sm:h-[140px] md:h-[160px]">
        <Image
          src={slide.imageUrl || '/placeholder.svg'}
          alt={slide.title}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 240px, (max-width: 768px) 280px, 320px"
          priority={isActive}
          unoptimized={true}
        />

        {/* カテゴリーバッジ */}
        {slide.category && (
          <div className="absolute top-0 right-0 m-1.5 sm:m-2 md:m-3">
            <span className="inline-block text-xs sm:text-sm font-medium px-2 sm:px-2.5 md:px-3 py-0.5 rounded-full bg-blue-100 text-blue-700">
              {slide.category}
            </span>
          </div>
        )}
      </div>

      {/* 詳細部分 */}
      <div className="flex-1 p-2 sm:p-3 md:p-4 bg-gradient-to-br from-blue-800/95 via-sky-800/95 to-indigo-700/95">
        <h3 className="text-sm sm:text-base md:text-lg font-bold mb-1 sm:mb-2 line-clamp-2 text-white">
          {slide.title}
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-gray-100 mb-1 sm:mb-2 md:mb-3 line-clamp-1 sm:line-clamp-2">
          {slide.description}
        </p>
        <div className="mt-auto flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-200">{slide.category}</span>
          <span className="inline-block px-2 sm:px-3 py-0.5 sm:py-1 text-xs sm:text-sm bg-white text-gray-800 rounded-lg">
            {slide.linkText}
          </span>
        </div>
      </div>
    </div>
  </div>
</Link>
```

### 4.6 背景のぼかし効果

```tsx
{/* 背景ぼかし効果 - 白ベースでぼかしを強化 */}
<div className="absolute inset-0 z-0 overflow-hidden">
  <div className="absolute inset-0 w-full h-full bg-white">
    <Image
      src={slides[currentSlide]?.imageUrl || '/placeholder.svg'}
      alt="Background"
      fill
      className="object-cover scale-125 blur-2xl opacity-50"
      priority
      unoptimized={true}
    />
  </div>
  <div className="absolute inset-0 bg-gradient-to-br from-white/80 via-gray-100/80 to-white/80 backdrop-blur-sm" />
</div>
```

### 4.7 ナビゲーションボタンとインジケーター

```tsx
{/* ナビゲーションボタン */}
{slides.length > 1 && (
  <>
    <button
      onClick={prevSlide}
      className="absolute left-2 sm:left-4 md:left-6 top-1/2 -translate-y-1/2 z-20 bg-blue-500/90 hover:bg-blue-600 text-white rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 hover:scale-110"
      aria-label="前のスライド"
    >
      <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
    </button>
    <button
      onClick={nextSlide}
      className="absolute right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-20 bg-blue-500/90 hover:bg-blue-600 text-white rounded-full p-2 sm:p-3 shadow-lg transition-all duration-200 hover:scale-110"
      aria-label="次のスライド"
    >
      <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6" />
    </button>
  </>
)}

{/* インジケーター */}
{slides.length > 1 && (
  <div className="absolute bottom-4 sm:bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 z-20 flex justify-center space-x-2 sm:space-x-3">
    {slides.map((_, index) => (
      <button
        key={index}
        onClick={() => goToSlide(index)}
        className={`w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full transition-all duration-300 ${
          index === currentSlide
            ? 'bg-blue-500 scale-125'
            : 'bg-gray-300 hover:bg-gray-400'
        }`}
        aria-label={`スライド ${index + 1} に移動`}
      />
    ))}
  </div>
)}
```

## 5. 使用方法

### 5.1 基本的な使用例

```tsx
import { SimpleCardCarousel } from "@/components/SimpleCardCarousel";

// スライドデータの準備
const slides = [
  {
    id: "1",
    title: "ビジネススキルを効率的に学ぶ方法",
    description: "短時間で効果的にビジネススキルを習得するためのテクニックを紹介します。",
    imageUrl: "/images/business-skills.jpg",
    linkUrl: "/articles/business-skills",
    linkText: "記事を読む",
    category: "基本ビジネススキル"
  },
  // 他のスライド...
];

// コンポーネントの使用
export default function HeroSection() {
  return (
    <div className="container mx-auto px-4">
      <SimpleCardCarousel 
        slides={slides}
        autoplayInterval={5000}
        pauseOnHover={true}
      />
    </div>
  );
}
```

### 5.2 Contentfulとの連携例

```tsx
import { getArticles, getVideos, getAudios } from "@/lib/api";
import { SimpleCardCarousel } from "@/components/SimpleCardCarousel";

export default async function Home() {
  // Contentfulからデータを取得
  const articlesData = await getArticles(5);
  
  // ヒーローカルーセル用のスライドを作成
  const heroSlides = articlesData.items.map(article => {
    // 画像URLの取得
    let imageUrl = "/placeholder.svg";
    if (article.fields.featuredImage?.fields?.file) {
      const fileUrl = article.fields.featuredImage.fields.file.url;
      imageUrl = fileUrl.startsWith('//') ? `https:${fileUrl}` : fileUrl;
    }
    
    return {
      id: article.sys.id,
      title: article.fields.title,
      description: article.fields.description || "",
      imageUrl: imageUrl,
      linkUrl: `/articles/${article.fields.slug}`,
      linkText: "記事を読む",
      category: article.fields.category?.[0]?.fields?.name || "ビジネススキル",
    };
  });
  
  return (
    <div className="container mx-auto px-4">
      <SimpleCardCarousel slides={heroSlides} />
    </div>
  );
}
```

## 6. レスポンシブデザインの詳細

カルーセルは以下のブレイクポイントでレスポンシブに対応しています：

- **モバイル** (〜640px)
  - カード幅: 240px
  - カード高さ: 240px
  - 画像高さ: 120px
  - フォントサイズ: 小
  - 両端のカードが見切れる表示

- **タブレット** (641px〜768px)
  - カード幅: 280px
  - カード高さ: 280px
  - 画像高さ: 140px
  - フォントサイズ: 中

- **デスクトップ** (769px〜)
  - カード幅: 320px
  - カード高さ: 320px
  - 画像高さ: 160px
  - フォントサイズ: 大

## 7. パフォーマンス最適化

- Next.js Imageコンポーネントによる画像の最適化
- アクティブなスライドのみpriorityを設定
- 非表示のスライドはpointer-eventsをnoneに設定
- 適切なsizesを設定して画像の読み込みを最適化
- 条件付きレンダリングでスライドが1つ以下の場合はナビゲーションを非表示

## 8. アクセシビリティ対応

- 適切なaria-label属性の設定
- キーボードナビゲーション対応
- 十分なコントラスト比の確保
- スクリーンリーダー対応のマークアップ

## 9. 注意点と制限事項

- サーバーサイドレンダリング時にwindow参照を使用する場合は、`typeof window !== 'undefined'`チェックが必要
- 画像のアスペクト比が一定でない場合、object-coverで対応
- 多数のスライドを表示する場合はパフォーマンスに注意

## 10. カスタマイズ方法

カルーセルは以下の点でカスタマイズ可能です：

- カードのデザイン（グラデーション、角丸、影など）
- 自動再生の間隔
- 表示するスライド数
- トランジションの速度と種類
- 背景のぼかし効果

## 11. 今後の改善点

- キーボードナビゲーションの強化
- スワイプジェスチャー対応
- アニメーションのパフォーマンス最適化
- 無限スクロールモードの追加

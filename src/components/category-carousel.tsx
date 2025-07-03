'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getGradientColorByCategory } from '@/utils/category-colors';
import { GradientPlaceholder } from '@/utils/gradient-card-design';

interface CategoryCarouselProps {
  title: string;
  categoryName: string;
  categorySlug?: string; // スラッグを追加（オプショナル）
  viewAllLink?: string; // オプショナルに変更
  items: any[];
}

export function CategoryCarousel({
  title,
  categoryName,
  categorySlug,
  viewAllLink,
  items,
}: CategoryCarouselProps) {
  // カテゴリースラッグがない場合は、カテゴリー名をスラッグとして使用
  const slug = categorySlug || categoryName;
  // viewAllLinkが指定されていない場合は、カテゴリースラッグを使用してリンクを生成
  const categoryLink = viewAllLink || `/categories/${encodeURIComponent(slug)}`;
  const [scrollPosition, setScrollPosition] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const gradientColor = getGradientColorByCategory(categoryName);

  // スクロール位置に基づいてナビゲーションボタンの表示を制御
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  // スクロール位置の更新とボタン表示の制御
  const updateScrollButtons = () => {
    if (!carouselRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
    setScrollPosition(scrollLeft);
    setShowLeftButton(scrollLeft > 0);
    setShowRightButton(scrollLeft < scrollWidth - clientWidth - 10); // 10pxの余裕を持たせる
  };

  // スクロールイベントのリスナー設定
  useEffect(() => {
    const carousel = carouselRef.current;
    if (carousel) {
      carousel.addEventListener('scroll', updateScrollButtons);
      // 初期状態の更新
      updateScrollButtons();
    }

    return () => {
      if (carousel) {
        carousel.removeEventListener('scroll', updateScrollButtons);
      }
    };
  }, []);

  // 左右のスクロール処理
  const scroll = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;

    const { clientWidth } = carouselRef.current;
    // カードサイズ + 余白分スクロール (160px + 15px)
    let cardWidth = 215; // デフォルトはデスクトップサイズ

    if (typeof window !== 'undefined') {
      if (window.innerWidth <= 640) {
        cardWidth = 175; // モバイル
      } else if (window.innerWidth <= 768) {
        cardWidth = 195; // タブレット
      }
    }

    const scrollAmount = direction === 'left' ? -cardWidth : cardWidth;

    carouselRef.current.scrollBy({
      left: scrollAmount,
      behavior: 'smooth',
    });
  };

  // アイテムがない場合は表示しない
  if (items.length === 0) {
    return null;
  }

  // グラデーションカラーのクラス名を取得
  const getBorderGradientClass = () => {
    switch (gradientColor) {
      case 'media-blue':
        return 'from-blue-400 via-sky-500 to-indigo-600';
      case 'media-purple':
        return 'from-violet-400 via-purple-500 to-indigo-600';
      case 'media-teal':
        return 'from-teal-400 via-cyan-500 to-sky-600';
      case 'tangerine-coral':
        return 'from-orange-300 via-red-400 to-rose-500';
      default:
        return 'from-blue-400 via-sky-500 to-indigo-600';
    }
  };

  return (
    <section className="mb-8 sm:mb-12 md:mb-16">
      <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">{title}</h2>
        <Link href={categoryLink} className="text-sm sm:text-base md:text-lg text-blue-600 hover:underline">
          すべて見る &rarr;
        </Link>
      </div>

      <div className="relative">
        {/* 左スクロールボタン */}
        {showLeftButton && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-[1%] top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1.5 sm:p-2 shadow-md hover:bg-white"
            aria-label="前へ"
          >
            <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
        )}

        {/* カルーセル */}
        <div
          ref={carouselRef}
          className="flex overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory"
          style={{
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            paddingLeft: '15px',
            paddingRight: '80px' // 3つ目のカードが見切れるようにパディングを設定
          }}
        >
          {items.map((item) => {
            // 画像URLの取得
            let imageUrl = null;
            let hasImage = false;
            if (item.fields.featuredImage && item.fields.featuredImage.fields && item.fields.featuredImage.fields.file) {
              const fileUrl = item.fields.featuredImage.fields.file.url;
              imageUrl = fileUrl.startsWith('//') ? `https:${fileUrl}` : fileUrl;
              hasImage = true;
            }

            // コンテンツタイプに応じたURLパスを生成
            const contentType = item.fields.contentType && item.fields.contentType[0];
            let contentPath = '/articles/';
            if (contentType === '動画') {
              contentPath = '/videos/';
            } else if (contentType === '音声') {
              contentPath = '/audios/';
            }

            return (
              <div
                key={item.sys.id}
                className="min-w-[160px] w-[160px] sm:min-w-[180px] sm:w-[180px] md:min-w-[200px] md:w-[200px] snap-start mr-[15px] flex-shrink-0 flex flex-col"
              >
                {/* カード本体 */}
                <div className={`p-[2px] rounded-xl bg-gradient-to-br ${getBorderGradientClass()} h-[160px] sm:h-[180px] md:h-[200px]`}>
                  <div className="bg-white rounded-lg overflow-hidden h-full flex flex-col">
                    <Link href={`${contentPath}${item.fields.slug}`} className="flex flex-col h-full">
                      {hasImage ? (
                        <>
                          {/* 画像部分 - 正方形の上半分 */}
                          <div className="relative w-full" style={{ height: 'calc(50% - 1px)' }}>
                            <Image
                              src={imageUrl!}
                              alt={item.fields.title}
                              fill
                              sizes="(max-width: 640px) 160px, (max-width: 768px) 180px, 200px"
                              className="object-cover"
                            />
                          </div>
                          {/* 詳細部分 - 正方形の下半分 */}
                          <div className="p-2 flex flex-col flex-grow" style={{ height: 'calc(50% - 1px)' }}>
                            <h3 className="font-medium text-gray-900 text-xs sm:text-sm md:text-base leading-snug line-clamp-3">{item.fields.title}</h3>
                          </div>
                        </>
                      ) : (
                        /* フルサイズグラデーション背景 - 画像なしカード */
                        <GradientPlaceholder
                          title={item.fields.title}
                          categoryName={categoryName}
                          contentType={contentType}
                          className="w-full h-full rounded-lg"
                        />
                      )}
                    </Link>
                  </div>
                </div>
                {/* 日付表示 - カードの外側 */}
                <div className="mt-2 flex justify-end">
                  <span className="text-[10px] sm:text-xs font-normal text-gray-600">
                    {new Date(item.sys.createdAt).toLocaleDateString('ja-JP', {year: 'numeric', month: 'short', day: 'numeric'})}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* 右スクロールボタン */}
        {showRightButton && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-[1%] top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full p-1.5 sm:p-2 shadow-md hover:bg-white"
            aria-label="次へ"
          >
            <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" />
          </button>
        )}
      </div>
    </section>
  );
}

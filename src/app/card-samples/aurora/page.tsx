'use client';

import BlurCard from '@/components/card-samples/blur-card';
import GradientOverlayCard from '@/components/card-samples/gradient-overlay-card';
import AuroraBackground from '@/components/card-samples/aurora-background';
import { useState, useEffect } from 'react';

// サンプルデータ
const sampleData = [
  {
    id: 1,
    title: 'ビジネスコミュニケーションの基本',
    description: 'ビジネスシーンでのコミュニケーションの基本を解説します。相手に伝わる話し方、聞き方、メールの書き方など、20代のビジネスパーソンに必要なスキルを網羅的に紹介します。',
    imageUrl: '/images/hero-business.jpg',
    category: 'コミュニケーション',
    date: '2025-04-15',
    href: '/articles/business-communication',
  },
  {
    id: 2,
    title: 'プレゼンテーションスキル向上講座',
    description: '説得力のあるプレゼンテーションを行うためのスキルを解説します。資料作成のコツから話し方、質疑応答の対応まで、プレゼンテーションの全てのフェーズについて詳しく説明します。',
    imageUrl: '/images/hero-video.jpg',
    category: 'プレゼンテーション',
    date: '2025-04-20',
    href: '/videos/presentation-skills',
  },
  {
    id: 3,
    title: 'リーダーシップの基礎知識',
    description: 'チームを率いるリーダーに必要な基礎知識とスキルを解説します。メンバーのモチベーション管理、目標設定、フィードバックの方法など、若手リーダーが直面する課題と解決策を紹介します。',
    imageUrl: '/images/hero-audio.jpg',
    category: 'リーダーシップ',
    date: '2025-04-25',
    href: '/audios/leadership-basics',
  },
  {
    id: 4,
    title: 'ビジネス英語の効果的な学習法',
    description: '忙しいビジネスパーソンのためのビジネス英語学習法を紹介します。短時間で効率的に英語力を向上させるテクニックや、実践的なビジネスシーンでの英語表現を解説します。',
    imageUrl: '/images/hero-business.jpg',
    category: '英語',
    date: '2025-05-01',
    href: '/articles/business-english',
  },
  {
    id: 5,
    title: 'データ分析の基礎と活用法',
    description: 'ビジネスにおけるデータ分析の基礎と活用法について解説します。データの収集方法、分析ツールの使い方、分析結果の解釈と活用方法など、データドリブンな意思決定のためのスキルを紹介します。',
    imageUrl: '/images/hero-video.jpg',
    category: 'データ分析',
    date: '2025-05-05',
    href: '/videos/data-analysis',
  },
  {
    id: 6,
    title: 'ストレスマネジメント入門',
    description: 'ビジネスパーソンのためのストレスマネジメント方法を紹介します。ストレスの原因と影響、効果的なリラクゼーション技法、メンタルヘルスの維持方法など、健康的に働くためのヒントを解説します。',
    imageUrl: '/images/hero-audio.jpg',
    category: 'メンタルヘルス',
    date: '2025-05-10',
    href: '/audios/stress-management',
  },
];

export default function AuroraCardSamplesPage() {
  const [contentfulItems, setContentfulItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Contentfulからデータを取得する関数
    const fetchContentfulData = async () => {
      try {
        const response = await fetch('/api/contentful/content?limit=12');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        setContentfulItems(data);
      } catch (error) {
        console.error('Error fetching Contentful data:', error);
        // エラー時はサンプルデータを使用
        setContentfulItems(sampleData);
      } finally {
        setLoading(false);
      }
    };

    fetchContentfulData();
  }, []);

  // ローディング中はサンプルデータを表示
  const displayItems = loading || contentfulItems.length === 0 ? sampleData : contentfulItems;

  return (
    <div className="relative min-h-screen bg-black text-white">
      {/* オーロラ背景 */}
      <AuroraBackground speed={0.9} blend={0.72} />

      <div className="container mx-auto py-12 px-4 relative z-10">
        <h1 className="text-3xl font-bold text-center mb-12">オーロラ背景とぼかし効果のカードデザイン</h1>

        {/* グレーぼかし背景のカード */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">グレーぼかし背景のカード</h2>
          <p className="text-gray-300 mb-8">
            タイトルと説明部分にグレーのぼかし背景を適用したカードデザイン。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            <div>
              <h3 className="text-center mb-4 text-gray-300">弱いぼかし</h3>
              <BlurCard
                title={displayItems[0].title || displayItems[0].fields?.title || 'タイトルなし'}
                description={displayItems[0].description || displayItems[0].fields?.description || '説明なし'}
                imageUrl={displayItems[0].imageUrl || (displayItems[0].fields?.thumbnail?.fields?.file?.url ? `https:${displayItems[0].fields.thumbnail.fields.file.url}` : '/images/hero-business.jpg')}
                category={displayItems[0].category || displayItems[0].fields?.category?.fields?.name || 'カテゴリなし'}
                date={displayItems[0].date || new Date(displayItems[0].sys?.createdAt || Date.now()).toLocaleDateString('ja-JP')}
                href={displayItems[0].href || `/articles/${displayItems[0].fields?.slug || 'sample'}`}
                variant="extra-rounded"
                shadow="xl"
                border="gradient"
                gradientColor="blue-purple"
                blurStrength="light"
                textColor="light"
              />
            </div>

            <div>
              <h3 className="text-center mb-4 text-gray-300">中くらいぼかし</h3>
              <BlurCard
                title={displayItems[1].title || displayItems[1].fields?.title || 'タイトルなし'}
                description={displayItems[1].description || displayItems[1].fields?.description || '説明なし'}
                imageUrl={displayItems[1].imageUrl || (displayItems[1].fields?.thumbnail?.fields?.file?.url ? `https:${displayItems[1].fields.thumbnail.fields.file.url}` : '/images/hero-video.jpg')}
                category={displayItems[1].category || displayItems[1].fields?.category?.fields?.name || 'カテゴリなし'}
                date={displayItems[1].date || new Date(displayItems[1].sys?.createdAt || Date.now()).toLocaleDateString('ja-JP')}
                href={displayItems[1].href || `/articles/${displayItems[1].fields?.slug || 'sample'}`}
                variant="extra-rounded"
                shadow="xl"
                border="gradient"
                gradientColor="green-blue"
                blurStrength="medium"
                textColor="light"
              />
            </div>

            <div>
              <h3 className="text-center mb-4 text-gray-300">強いぼかし</h3>
              <BlurCard
                title={displayItems[2].title || displayItems[2].fields?.title || 'タイトルなし'}
                description={displayItems[2].description || displayItems[2].fields?.description || '説明なし'}
                imageUrl={displayItems[2].imageUrl || (displayItems[2].fields?.thumbnail?.fields?.file?.url ? `https:${displayItems[2].fields.thumbnail.fields.file.url}` : '/images/hero-audio.jpg')}
                category={displayItems[2].category || displayItems[2].fields?.category?.fields?.name || 'カテゴリなし'}
                date={displayItems[2].date || new Date(displayItems[2].sys?.createdAt || Date.now()).toLocaleDateString('ja-JP')}
                href={displayItems[2].href || `/articles/${displayItems[2].fields?.slug || 'sample'}`}
                variant="extra-rounded"
                shadow="xl"
                border="gradient"
                gradientColor="orange-red"
                blurStrength="strong"
                textColor="light"
              />
            </div>
          </div>
        </section>

        {/* 画像オーバーレイのカード */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">画像オーバーレイのカード</h2>
          <p className="text-gray-300 mb-8">
            画像全体に表示し、下部にグラデーションオーバーレイを適用したカードデザイン。
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            <div>
              <h3 className="text-center mb-4 text-gray-300">弱いオーバーレイ</h3>
              <GradientOverlayCard
                title={displayItems[3].title || displayItems[3].fields?.title || 'タイトルなし'}
                description={displayItems[3].description || displayItems[3].fields?.description || '説明なし'}
                imageUrl={displayItems[3].imageUrl || (displayItems[3].fields?.thumbnail?.fields?.file?.url ? `https:${displayItems[3].fields.thumbnail.fields.file.url}` : '/images/hero-business.jpg')}
                category={displayItems[3].category || displayItems[3].fields?.category?.fields?.name || 'カテゴリなし'}
                date={displayItems[3].date || new Date(displayItems[3].sys?.createdAt || Date.now()).toLocaleDateString('ja-JP')}
                href={displayItems[3].href || `/articles/${displayItems[3].fields?.slug || 'sample'}`}
                variant="extra-rounded"
                shadow="xl"
                border="gradient"
                gradientColor="pink-purple"
                overlayStrength="light"
              />
            </div>

            <div>
              <h3 className="text-center mb-4 text-gray-300">中くらいオーバーレイ</h3>
              <GradientOverlayCard
                title={displayItems[4].title || displayItems[4].fields?.title || 'タイトルなし'}
                description={displayItems[4].description || displayItems[4].fields?.description || '説明なし'}
                imageUrl={displayItems[4].imageUrl || (displayItems[4].fields?.thumbnail?.fields?.file?.url ? `https:${displayItems[4].fields.thumbnail.fields.file.url}` : '/images/hero-video.jpg')}
                category={displayItems[4].category || displayItems[4].fields?.category?.fields?.name || 'カテゴリなし'}
                date={displayItems[4].date || new Date(displayItems[4].sys?.createdAt || Date.now()).toLocaleDateString('ja-JP')}
                href={displayItems[4].href || `/articles/${displayItems[4].fields?.slug || 'sample'}`}
                variant="extra-rounded"
                shadow="xl"
                border="gradient"
                gradientColor="yellow-orange"
                overlayStrength="medium"
              />
            </div>

            <div>
              <h3 className="text-center mb-4 text-gray-300">強いオーバーレイ</h3>
              <GradientOverlayCard
                title={displayItems[5].title || displayItems[5].fields?.title || 'タイトルなし'}
                description={displayItems[5].description || displayItems[5].fields?.description || '説明なし'}
                imageUrl={displayItems[5].imageUrl || (displayItems[5].fields?.thumbnail?.fields?.file?.url ? `https:${displayItems[5].fields.thumbnail.fields.file.url}` : '/images/hero-audio.jpg')}
                category={displayItems[5].category || displayItems[5].fields?.category?.fields?.name || 'カテゴリなし'}
                date={displayItems[5].date || new Date(displayItems[5].sys?.createdAt || Date.now()).toLocaleDateString('ja-JP')}
                href={displayItems[5].href || `/articles/${displayItems[5].fields?.slug || 'sample'}`}
                variant="extra-rounded"
                shadow="xl"
                border="gradient"
                gradientColor="blue-purple"
                overlayStrength="strong"
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

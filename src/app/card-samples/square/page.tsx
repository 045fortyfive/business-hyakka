'use client';

import SquareCard from '@/components/card-samples/square-card';
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
    title: 'データ分析の基本と活用法',
    description: 'ビジネスにおけるデータ分析の基本と活用法について解説します。基本的な統計知識からデータの可視化、意思決定への活用方法まで、実践的なスキルを身につけましょう。',
    imageUrl: '/images/hero-business.jpg',
    category: 'データ分析',
    date: '2025-05-01',
    href: '/articles/data-analysis',
  },
  {
    id: 5,
    title: '効果的な時間管理術',
    description: '仕事の生産性を高めるための時間管理術を紹介します。タスクの優先順位付け、集中力の維持、会議の効率化など、忙しいビジネスパーソンのための実践的なテクニックを学びましょう。',
    imageUrl: '/images/hero-video.jpg',
    category: '生産性向上',
    date: '2025-05-05',
    href: '/videos/time-management',
  },
];

export default function SquareCardSamplesPage() {
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

  // グラデーションカラーの配列
  const gradientColors = [
    'blue-purple',
    'green-blue',
    'orange-red',
    'pink-purple',
    'yellow-orange'
  ] as const;

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-12">正方形カードデザインサンプル (444 x 444)</h1>
      
      {/* 青紫グラデーションボーダー */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">青紫グラデーションボーダー</h2>
        <p className="text-gray-600 mb-8">
          青から紫へのグラデーションボーダーを持つ正方形カードデザイン。画像は16:9比率（444 x 250）。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {displayItems.slice(0, 3).map((item: any, index: number) => (
            <SquareCard
              key={item.id || item.sys?.id || index}
              title={item.title || item.fields?.title || 'タイトルなし'}
              description={item.description || item.fields?.description || '説明なし'}
              imageUrl={item.imageUrl || (item.fields?.thumbnail?.fields?.file?.url ? `https:${item.fields.thumbnail.fields.file.url}` : '/images/hero-business.jpg')}
              category={item.category || item.fields?.category?.fields?.name || 'カテゴリなし'}
              date={item.date || new Date(item.sys?.createdAt || Date.now()).toLocaleDateString('ja-JP')}
              href={item.href || `/articles/${item.fields?.slug || 'sample'}`}
              variant="rounded"
              shadow="md"
              border="gradient"
              gradientColor="blue-purple"
            />
          ))}
        </div>
      </section>
      
      {/* 緑青グラデーションボーダー */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">緑青グラデーションボーダー</h2>
        <p className="text-gray-600 mb-8">
          緑から青へのグラデーションボーダーを持つ正方形カードデザイン。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {displayItems.slice(0, 3).map((item: any, index: number) => (
            <SquareCard
              key={item.id || item.sys?.id || index}
              title={item.title || item.fields?.title || 'タイトルなし'}
              description={item.description || item.fields?.description || '説明なし'}
              imageUrl={item.imageUrl || (item.fields?.thumbnail?.fields?.file?.url ? `https:${item.fields.thumbnail.fields.file.url}` : '/images/hero-business.jpg')}
              category={item.category || item.fields?.category?.fields?.name || 'カテゴリなし'}
              date={item.date || new Date(item.sys?.createdAt || Date.now()).toLocaleDateString('ja-JP')}
              href={item.href || `/articles/${item.fields?.slug || 'sample'}`}
              variant="rounded"
              shadow="md"
              border="gradient"
              gradientColor="green-blue"
            />
          ))}
        </div>
      </section>
      
      {/* オレンジ赤グラデーションボーダー */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">オレンジ赤グラデーションボーダー</h2>
        <p className="text-gray-600 mb-8">
          オレンジから赤へのグラデーションボーダーを持つ正方形カードデザイン。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {displayItems.slice(0, 3).map((item: any, index: number) => (
            <SquareCard
              key={item.id || item.sys?.id || index}
              title={item.title || item.fields?.title || 'タイトルなし'}
              description={item.description || item.fields?.description || '説明なし'}
              imageUrl={item.imageUrl || (item.fields?.thumbnail?.fields?.file?.url ? `https:${item.fields.thumbnail.fields.file.url}` : '/images/hero-business.jpg')}
              category={item.category || item.fields?.category?.fields?.name || 'カテゴリなし'}
              date={item.date || new Date(item.sys?.createdAt || Date.now()).toLocaleDateString('ja-JP')}
              href={item.href || `/articles/${item.fields?.slug || 'sample'}`}
              variant="rounded"
              shadow="md"
              border="gradient"
              gradientColor="orange-red"
            />
          ))}
        </div>
      </section>
      
      {/* ピンク紫グラデーションボーダー */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">ピンク紫グラデーションボーダー</h2>
        <p className="text-gray-600 mb-8">
          ピンクから紫へのグラデーションボーダーを持つ正方形カードデザイン。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {displayItems.slice(0, 3).map((item: any, index: number) => (
            <SquareCard
              key={item.id || item.sys?.id || index}
              title={item.title || item.fields?.title || 'タイトルなし'}
              description={item.description || item.fields?.description || '説明なし'}
              imageUrl={item.imageUrl || (item.fields?.thumbnail?.fields?.file?.url ? `https:${item.fields.thumbnail.fields.file.url}` : '/images/hero-business.jpg')}
              category={item.category || item.fields?.category?.fields?.name || 'カテゴリなし'}
              date={item.date || new Date(item.sys?.createdAt || Date.now()).toLocaleDateString('ja-JP')}
              href={item.href || `/articles/${item.fields?.slug || 'sample'}`}
              variant="rounded"
              shadow="md"
              border="gradient"
              gradientColor="pink-purple"
            />
          ))}
        </div>
      </section>
      
      {/* 黄色オレンジグラデーションボーダー */}
      <section>
        <h2 className="text-2xl font-bold mb-6">黄色オレンジグラデーションボーダー</h2>
        <p className="text-gray-600 mb-8">
          黄色からオレンジへのグラデーションボーダーを持つ正方形カードデザイン。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {displayItems.slice(0, 3).map((item: any, index: number) => (
            <SquareCard
              key={item.id || item.sys?.id || index}
              title={item.title || item.fields?.title || 'タイトルなし'}
              description={item.description || item.fields?.description || '説明なし'}
              imageUrl={item.imageUrl || (item.fields?.thumbnail?.fields?.file?.url ? `https:${item.fields.thumbnail.fields.file.url}` : '/images/hero-business.jpg')}
              category={item.category || item.fields?.category?.fields?.name || 'カテゴリなし'}
              date={item.date || new Date(item.sys?.createdAt || Date.now()).toLocaleDateString('ja-JP')}
              href={item.href || `/articles/${item.fields?.slug || 'sample'}`}
              variant="rounded"
              shadow="md"
              border="gradient"
              gradientColor="yellow-orange"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

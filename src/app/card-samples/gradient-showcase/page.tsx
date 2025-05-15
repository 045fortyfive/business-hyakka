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
  {
    id: 6,
    title: 'ビジネス英語の基礎',
    description: 'グローバルビジネスで必要な英語スキルを解説します。メール、会議、プレゼンテーションなど、様々なシーンで使える表現とコミュニケーション方法を学びましょう。',
    imageUrl: '/images/hero-audio.jpg',
    category: '語学',
    date: '2025-05-10',
    href: '/audios/business-english',
  },
  {
    id: 7,
    title: 'マーケティング戦略の立て方',
    description: '効果的なマーケティング戦略の立て方を解説します。市場分析、ターゲット設定、プロモーション計画など、マーケティングの基本要素を体系的に学びましょう。',
    imageUrl: '/images/hero-business.jpg',
    category: 'マーケティング',
    date: '2025-05-15',
    href: '/articles/marketing-strategy',
  },
  {
    id: 8,
    title: 'ネゴシエーションスキル向上講座',
    description: 'ビジネスにおける交渉力を高めるための講座です。Win-Winの関係構築、効果的な提案方法、反対意見への対応など、実践的な交渉テクニックを学びましょう。',
    imageUrl: '/images/hero-video.jpg',
    category: '交渉術',
    date: '2025-05-20',
    href: '/videos/negotiation-skills',
  },
];

// グラデーションカラーの配列
const gradientColors = [
  // 基本カラー
  { value: 'blue-purple', label: '青紫グラデーション', group: 'basic' },
  { value: 'green-blue', label: '緑青グラデーション', group: 'basic' },
  { value: 'orange-red', label: 'オレンジ赤グラデーション', group: 'basic' },
  { value: 'pink-purple', label: 'ピンク紫グラデーション', group: 'basic' },
  { value: 'yellow-orange', label: '黄色オレンジグラデーション', group: 'basic' },
  { value: 'blue-teal', label: '青ティールグラデーション', group: 'basic' },
  { value: 'purple-pink', label: '紫ピンクグラデーション', group: 'basic' },
  { value: 'red-purple', label: '赤紫グラデーション', group: 'basic' },

  // 爽やかなカラー
  { value: 'fresh-orange', label: '爽やかオレンジ', group: 'fresh' },
  { value: 'coral-orange', label: 'コーラルオレンジ', group: 'fresh' },
  { value: 'fresh-green', label: '爽やかグリーン', group: 'fresh' },
  { value: 'mint-green', label: 'ミントグリーン', group: 'fresh' },
  { value: 'sunny-yellow', label: 'サニーイエロー', group: 'fresh' },
  { value: 'sky-blue', label: 'スカイブルー', group: 'fresh' },

  // 改良オレンジ系
  { value: 'sunset-orange', label: 'サンセットオレンジ', group: 'improved-orange' },
  { value: 'peach-orange', label: 'ピーチオレンジ', group: 'improved-orange' },
  { value: 'amber-gold', label: 'アンバーゴールド', group: 'improved-orange' },
  { value: 'tangerine-coral', label: 'タンジェリンコーラル', group: 'improved-orange' },

  // Canvaスタイル
  { value: 'canva-purple', label: 'Canva パープル', group: 'canva' },
  { value: 'canva-blue', label: 'Canva ブルー', group: 'canva' },
  { value: 'canva-teal', label: 'Canva ティール', group: 'canva' },
  { value: 'canva-green', label: 'Canva グリーン', group: 'canva' },
  { value: 'canva-yellow', label: 'Canva イエロー', group: 'canva' },
  { value: 'canva-orange', label: 'Canva オレンジ', group: 'canva' },
  { value: 'canva-red', label: 'Canva レッド', group: 'canva' },
  { value: 'canva-pink', label: 'Canva ピンク', group: 'canva' },

  // モダンメディア
  { value: 'media-blue', label: 'メディア ブルー', group: 'media' },
  { value: 'media-purple', label: 'メディア パープル', group: 'media' },
  { value: 'media-teal', label: 'メディア ティール', group: 'media' },
  { value: 'media-green', label: 'メディア グリーン', group: 'media' },
  { value: 'media-orange', label: 'メディア オレンジ', group: 'media' },
  { value: 'media-red', label: 'メディア レッド', group: 'media' },
] as const;

export default function GradientShowcasePage() {
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

  // カラーをグループ別に分類
  const basicColors = gradientColors.filter(color => color.group === 'basic');
  const freshColors = gradientColors.filter(color => color.group === 'fresh');
  const improvedOrangeColors = gradientColors.filter(color => color.group === 'improved-orange');
  const canvaColors = gradientColors.filter(color => color.group === 'canva');
  const mediaColors = gradientColors.filter(color => color.group === 'media');

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-12">グラデーションカラーショーケース</h1>

      {/* 改良オレンジ系セクション */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-gray-200">改良オレンジ系</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {improvedOrangeColors.map((color, index) => (
            <div key={color.value} className="flex flex-col items-center">
              <h3 className="text-center mb-4 text-gray-700 font-medium">{color.label}</h3>
              <SquareCard
                title={displayItems[index % displayItems.length].title || 'タイトルなし'}
                description={displayItems[index % displayItems.length].description || '説明なし'}
                imageUrl={displayItems[index % displayItems.length].imageUrl || '/images/hero-business.jpg'}
                category={displayItems[index % displayItems.length].category || 'カテゴリなし'}
                date={displayItems[index % displayItems.length].date || new Date().toLocaleDateString('ja-JP')}
                href={displayItems[index % displayItems.length].href || '/sample'}
                variant="rounded"
                shadow="md"
                border="gradient"
                gradientColor={color.value as any}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Canvaスタイルセクション */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-gray-200">Canvaスタイル</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {canvaColors.map((color, index) => (
            <div key={color.value} className="flex flex-col items-center">
              <h3 className="text-center mb-4 text-gray-700 font-medium">{color.label}</h3>
              <SquareCard
                title={displayItems[(index + 2) % displayItems.length].title || 'タイトルなし'}
                description={displayItems[(index + 2) % displayItems.length].description || '説明なし'}
                imageUrl={displayItems[(index + 2) % displayItems.length].imageUrl || '/images/hero-business.jpg'}
                category={displayItems[(index + 2) % displayItems.length].category || 'カテゴリなし'}
                date={displayItems[(index + 2) % displayItems.length].date || new Date().toLocaleDateString('ja-JP')}
                href={displayItems[(index + 2) % displayItems.length].href || '/sample'}
                variant="rounded"
                shadow="md"
                border="gradient"
                gradientColor={color.value as any}
              />
            </div>
          ))}
        </div>
      </div>

      {/* モダンメディアセクション */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-gray-200">モダンメディア</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {mediaColors.map((color, index) => (
            <div key={color.value} className="flex flex-col items-center">
              <h3 className="text-center mb-4 text-gray-700 font-medium">{color.label}</h3>
              <SquareCard
                title={displayItems[(index + 4) % displayItems.length].title || 'タイトルなし'}
                description={displayItems[(index + 4) % displayItems.length].description || '説明なし'}
                imageUrl={displayItems[(index + 4) % displayItems.length].imageUrl || '/images/hero-business.jpg'}
                category={displayItems[(index + 4) % displayItems.length].category || 'カテゴリなし'}
                date={displayItems[(index + 4) % displayItems.length].date || new Date().toLocaleDateString('ja-JP')}
                href={displayItems[(index + 4) % displayItems.length].href || '/sample'}
                variant="rounded"
                shadow="md"
                border="gradient"
                gradientColor={color.value as any}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 爽やかなカラーセクション */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-gray-200">爽やかなカラー</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {freshColors.map((color, index) => (
            <div key={color.value} className="flex flex-col items-center">
              <h3 className="text-center mb-4 text-gray-700 font-medium">{color.label}</h3>
              <SquareCard
                title={displayItems[(index + 3) % displayItems.length].title || 'タイトルなし'}
                description={displayItems[(index + 3) % displayItems.length].description || '説明なし'}
                imageUrl={displayItems[(index + 3) % displayItems.length].imageUrl || '/images/hero-business.jpg'}
                category={displayItems[(index + 3) % displayItems.length].category || 'カテゴリなし'}
                date={displayItems[(index + 3) % displayItems.length].date || new Date().toLocaleDateString('ja-JP')}
                href={displayItems[(index + 3) % displayItems.length].href || '/sample'}
                variant="rounded"
                shadow="md"
                border="gradient"
                gradientColor={color.value as any}
              />
            </div>
          ))}
        </div>
      </div>

      {/* 基本カラーセクション */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-gray-200">基本カラー</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {basicColors.map((color, index) => (
            <div key={color.value} className="flex flex-col items-center">
              <h3 className="text-center mb-4 text-gray-700 font-medium">{color.label}</h3>
              <SquareCard
                title={displayItems[index % displayItems.length].title || 'タイトルなし'}
                description={displayItems[index % displayItems.length].description || '説明なし'}
                imageUrl={displayItems[index % displayItems.length].imageUrl || '/images/hero-business.jpg'}
                category={displayItems[index % displayItems.length].category || 'カテゴリなし'}
                date={displayItems[index % displayItems.length].date || new Date().toLocaleDateString('ja-JP')}
                href={displayItems[index % displayItems.length].href || '/sample'}
                variant="rounded"
                shadow="md"
                border="gradient"
                gradientColor={color.value as any}
              />
            </div>
          ))}
        </div>
      </div>

      {/* オレンジ系比較セクション */}
      <div className="mb-20">
        <h2 className="text-2xl font-bold mb-8 pb-2 border-b border-gray-200">オレンジ系比較</h2>

        {/* 改良オレンジ系 */}
        <h3 className="text-xl font-semibold mb-6 mt-12">改良オレンジ系</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
          {['sunset-orange', 'peach-orange', 'amber-gold', 'tangerine-coral'].map((colorValue) => {
            const color = gradientColors.find(c => c.value === colorValue);
            return (
              <div key={colorValue} className="flex flex-col items-center">
                <h3 className="text-center mb-4 text-gray-700 font-medium">{color?.label}</h3>
                <SquareCard
                  title="改良オレンジ系"
                  description="オレンジベースのカラーを改良したグラデーションです。様々な色調のオレンジを使用しています。"
                  imageUrl="/images/hero-business.jpg"
                  category="デザイン"
                  date={new Date().toLocaleDateString('ja-JP')}
                  href="/sample"
                  variant="rounded"
                  shadow="md"
                  border="gradient"
                  gradientColor={colorValue as any}
                />
              </div>
            );
          })}
        </div>

        {/* Canvaスタイルのオレンジ系 */}
        <h3 className="text-xl font-semibold mb-6 mt-12">Canvaスタイルのオレンジ系</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {['canva-yellow', 'canva-orange', 'canva-red'].map((colorValue) => {
            const color = gradientColors.find(c => c.value === colorValue);
            return (
              <div key={colorValue} className="flex flex-col items-center">
                <h3 className="text-center mb-4 text-gray-700 font-medium">{color?.label}</h3>
                <SquareCard
                  title="Canvaスタイルのオレンジ系"
                  description="Canvaのデザインを参考にした暖色系のグラデーションです。鮮やかで目を引くデザインです。"
                  imageUrl="/images/hero-business.jpg"
                  category="デザイン"
                  date={new Date().toLocaleDateString('ja-JP')}
                  href="/sample"
                  variant="rounded"
                  shadow="md"
                  border="gradient"
                  gradientColor={colorValue as any}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

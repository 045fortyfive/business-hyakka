'use client';

import SquareCard from '@/components/card-samples/square-card';
import { useState, useEffect } from 'react';
import { categoryDescriptions } from '@/utils/category-colors';

// カテゴリーの配列
const categories = [
  '基本ビジネススキル',
  '思考法',
  'マネジメントスキル',
  '業務改善',
];

// サンプルデータ
const sampleData = [
  {
    id: 1,
    title: 'ビジネスコミュニケーションの基本',
    description: 'ビジネスシーンでのコミュニケーションの基本を解説します。相手に伝わる話し方、聞き方、メールの書き方など、20代のビジネスパーソンに必要なスキルを網羅的に紹介します。',
    imageUrl: '/images/hero-business.jpg',
    category: '思考法',
    date: '2025-04-15',
    href: '/articles/business-communication',
  },
  {
    id: 2,
    title: 'プレゼンテーションスキル向上講座',
    description: '説得力のあるプレゼンテーションを行うためのスキルを解説します。資料作成のコツから話し方、質疑応答の対応まで、プレゼンテーションの全てのフェーズについて詳しく説明します。',
    imageUrl: '/images/hero-video.jpg',
    category: '思考法',
    date: '2025-04-20',
    href: '/videos/presentation-skills',
  },
  {
    id: 3,
    title: 'リーダーシップの基礎知識',
    description: 'チームを率いるリーダーに必要な基礎知識とスキルを解説します。メンバーのモチベーション管理、目標設定、フィードバックの方法など、若手リーダーが直面する課題と解決策を紹介します。',
    imageUrl: '/images/hero-audio.jpg',
    category: 'マネジメントスキル',
    date: '2025-04-25',
    href: '/audios/leadership-basics',
  },
  {
    id: 4,
    title: 'データ分析の基本と活用法',
    description: 'ビジネスにおけるデータ分析の基本と活用法について解説します。基本的な統計知識からデータの可視化、意思決定への活用方法まで、実践的なスキルを身につけましょう。',
    imageUrl: '/images/hero-business.jpg',
    category: '業務改善',
    date: '2025-05-01',
    href: '/articles/data-analysis',
  },
  {
    id: 5,
    title: '効果的な時間管理術',
    description: '仕事の生産性を高めるための時間管理術を紹介します。タスクの優先順位付け、集中力の維持、会議の効率化など、忙しいビジネスパーソンのための実践的なテクニックを学びましょう。',
    imageUrl: '/images/hero-video.jpg',
    category: '基本ビジネススキル',
    date: '2025-05-05',
    href: '/videos/time-management',
  },
  {
    id: 6,
    title: 'ビジネス英語の基礎',
    description: 'グローバルビジネスで必要な英語スキルを解説します。メール、会議、プレゼンテーションなど、様々なシーンで使える表現とコミュニケーション方法を学びましょう。',
    imageUrl: '/images/hero-audio.jpg',
    category: '基本ビジネススキル',
    date: '2025-05-10',
    href: '/audios/business-english',
  },
  {
    id: 7,
    title: 'マーケティング戦略の立て方',
    description: '効果的なマーケティング戦略の立て方を解説します。市場分析、ターゲット設定、プロモーション計画など、マーケティングの基本要素を体系的に学びましょう。',
    imageUrl: '/images/hero-business.jpg',
    category: '業務改善',
    date: '2025-05-15',
    href: '/articles/marketing-strategy',
  },
  {
    id: 8,
    title: 'ネゴシエーションスキル向上講座',
    description: 'ビジネスにおける交渉力を高めるための講座です。Win-Winの関係構築、効果的な提案方法、反対意見への対応など、実践的な交渉テクニックを学びましょう。',
    imageUrl: '/images/hero-video.jpg',
    category: 'コミュニケーションスキル',
    date: '2025-05-20',
    href: '/videos/negotiation-skills',
  },
];

export default function CategoryColorsPage() {
  const [contentfulItems, setContentfulItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Contentfulからデータを取得する関数
    const fetchContentfulData = async () => {
      try {
        // カテゴリー情報を含めて取得
        const response = await fetch('/api/contentful/content?limit=12&includeCategories=true');
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const data = await response.json();

        // レスポンスの構造を確認
        if (data.items && Array.isArray(data.items)) {
          // カテゴリー情報を含む新しいレスポンス形式
          console.log('Contentfulデータ構造（アイテム）:', JSON.stringify(data.items[0], null, 2));
          console.log('Contentfulカテゴリー:', data.categories ? data.categories.length : 'なし');

          if (data.categories && data.categories.length > 0) {
            console.log('カテゴリーサンプル:', JSON.stringify(data.categories[0], null, 2));

            // すべてのカテゴリー名をログに出力
            const categoryNames = data.categories.map((cat: any) => {
              if (cat.fields && cat.fields.name) {
                return cat.fields.name;
              }
              return 'Unknown';
            });
            console.log('すべてのカテゴリー名:', categoryNames);

            // コンテンツアイテムのカテゴリー参照をログに出力
            if (data.items.length > 0) {
              data.items.forEach((item: any, index: number) => {
                if (index < 3) { // 最初の3つだけログに出力
                  console.log(`アイテム ${index + 1} のカテゴリー:`,
                    item.fields && item.fields.category ?
                    JSON.stringify(item.fields.category, null, 2) : 'なし');
                }
              });
            }
          }

          setContentfulItems(data.items);
        } else {
          // 従来の形式
          console.log('Contentfulデータ構造:', JSON.stringify(data[0], null, 2));

          // 最初の数アイテムのカテゴリー情報をログに出力
          if (Array.isArray(data) && data.length > 0) {
            data.slice(0, 3).forEach((item: any, index: number) => {
              console.log(`アイテム ${index + 1} のカテゴリー:`,
                item.fields && item.fields.category ?
                JSON.stringify(item.fields.category, null, 2) : 'なし');
            });
          }

          setContentfulItems(data);
        }
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

  // Contentfulデータの構造に合わせてカテゴリーを取得
  const getItemCategory = (item: any): string => {
    // デバッグ用
    // console.log('カテゴリー取得対象アイテム:', JSON.stringify(item, null, 2));

    // Contentfulのデータ構造
    if (item.sys && item.fields) {
      // カテゴリーフィールドの存在確認
      if (item.fields.category) {
        // カテゴリーがオブジェクトの場合（Contentfulの参照フィールド）
        if (typeof item.fields.category === 'object') {
          // カテゴリーがリンクの場合
          if (item.fields.category.sys && item.fields.category.sys.type === 'Link') {
            // カテゴリーがリンクだが、展開されていない場合
            console.log('未展開のカテゴリーリンク:', item.fields.category);
            return '';
          }

          // カテゴリーが展開されている場合
          if (item.fields.category.fields && item.fields.category.fields.name) {
            console.log('展開されたカテゴリー名:', item.fields.category.fields.name);
            return item.fields.category.fields.name;
          }

          // カテゴリーが配列の場合（複数カテゴリー）
          if (Array.isArray(item.fields.category)) {
            if (item.fields.category.length > 0) {
              const firstCategory = item.fields.category[0];
              if (firstCategory.fields && firstCategory.fields.name) {
                console.log('配列内の最初のカテゴリー名:', firstCategory.fields.name);
                return firstCategory.fields.name;
              }
            }
            console.log('空のカテゴリー配列');
            return '';
          }
        }

        // カテゴリーが文字列の場合
        if (typeof item.fields.category === 'string') {
          console.log('文字列カテゴリー:', item.fields.category);
          return item.fields.category;
        }
      }
    }

    // サンプルデータの構造
    if (item.category) {
      console.log('サンプルデータのカテゴリー:', item.category);
      return item.category;
    }

    console.log('カテゴリーなし');
    return '';
  };

  // カテゴリー別にアイテムをグループ化
  const itemsByCategory = categories.reduce((acc, category) => {
    acc[category] = displayItems.filter(item => getItemCategory(item) === category);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-12">カテゴリー別カラー表示</h1>

      {categories.map((category) => (
        <div key={category} className="mb-20">
          <h2 className="text-2xl font-bold mb-4 pb-2 border-b border-gray-200">{category}</h2>
          <p className="mb-8 text-gray-600">{categoryDescriptions[category]}</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
            {itemsByCategory[category].length > 0 ? (
              itemsByCategory[category].map((item) => (
                <SquareCard
                  key={item.id || item.sys?.id}
                  title={item.fields?.title || item.title || 'タイトルなし'}
                  description={item.fields?.description || item.description || '説明なし'}
                  imageUrl={
                    (item.fields?.featuredImage?.fields?.file?.url && `https:${item.fields.featuredImage.fields.file.url}`) ||
                    item.imageUrl ||
                    '/images/hero-business.jpg'
                  }
                  category={getItemCategory(item)}
                  date={
                    (item.sys?.createdAt && new Date(item.sys.createdAt).toLocaleDateString('ja-JP')) ||
                    item.date ||
                    new Date().toLocaleDateString('ja-JP')
                  }
                  href={
                    (item.fields?.slug && `/articles/${item.fields.slug}`) ||
                    item.href ||
                    '/sample'
                  }
                  variant="rounded"
                  shadow="md"
                  border="gradient"
                  useAutomaticColor={true} // カテゴリーに基づいて自動的にカラーを選択
                />
              ))
            ) : (
              <div className="col-span-full text-center py-8 text-gray-500">
                このカテゴリーのコンテンツはまだありません。
              </div>
            )}
          </div>
        </div>
      ))}

      <div className="mt-20 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">カテゴリーとカラーのマッピング</h2>
        <ul className="space-y-2">
          <li><span className="inline-block w-4 h-4 bg-gradient-to-br from-blue-400 via-sky-500 to-indigo-600 mr-2 rounded-full"></span> 基本ビジネススキル: メディアブルー</li>
          <li><span className="inline-block w-4 h-4 bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600 mr-2 rounded-full"></span> 思考法: メディアパープル</li>
          <li><span className="inline-block w-4 h-4 bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-600 mr-2 rounded-full"></span> マネジメントスキル: メディアティール</li>
          <li><span className="inline-block w-4 h-4 bg-gradient-to-br from-orange-300 via-red-400 to-rose-500 mr-2 rounded-full"></span> 業務改善: タンジェリンコーラル</li>
        </ul>
      </div>
    </div>
  );
}

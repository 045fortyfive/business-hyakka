import GoldenRatioCard from '@/components/card-samples/golden-ratio-card';
import TallCard from '@/components/card-samples/tall-card';

// サンプルデータ
const sampleData = [
  {
    id: 1,
    title: 'ビジネスコミュニケーションの基本',
    description: 'ビジネスシーンでのコミュニケーションの基本を解説します。相手に伝わる話し方、聞き方、メールの書き方など、20代のビジネスパーソンに必要なスキルを網羅的に紹介します。実践的なテクニックと具体的な例を交えながら、効果的なコミュニケーション方法を学びましょう。',
    imageUrl: '/images/hero-business.jpg',
    category: 'コミュニケーション',
    date: '2025-04-15',
    href: '/articles/business-communication',
  },
  {
    id: 2,
    title: 'プレゼンテーションスキル向上講座',
    description: '説得力のあるプレゼンテーションを行うためのスキルを解説します。資料作成のコツから話し方、質疑応答の対応まで、プレゼンテーションの全てのフェーズについて詳しく説明します。実際のビジネスシーンで役立つテクニックを身につけましょう。',
    imageUrl: '/images/hero-video.jpg',
    category: 'プレゼンテーション',
    date: '2025-04-20',
    href: '/videos/presentation-skills',
  },
  {
    id: 3,
    title: 'リーダーシップの基礎知識',
    description: 'チームを率いるリーダーに必要な基礎知識とスキルを解説します。メンバーのモチベーション管理、目標設定、フィードバックの方法など、若手リーダーが直面する課題と解決策を紹介します。実践的なリーダーシップを身につけるためのヒントが満載です。',
    imageUrl: '/images/hero-audio.jpg',
    category: 'リーダーシップ',
    date: '2025-04-25',
    href: '/audios/leadership-basics',
  },
];

export default function CardSamplesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-12">カードデザインサンプル</h1>

      {/* ゴールデン比カード */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">デザイン1: ゴールデン比カード (1:1.618)</h2>
        <p className="text-gray-600 mb-8">
          ゴールデン比（1:1.618）を活用した美しいプロポーションのカードデザイン。
          サムネイル画像の下に十分なスペースがあり、コンテンツを余裕を持って配置可能です。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {sampleData.map((item) => (
            <GoldenRatioCard
              key={item.id}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
              category={item.category}
              date={item.date}
              href={item.href}
            />
          ))}
        </div>
      </section>

      {/* 2:3比率の細長カード */}
      <section>
        <h2 className="text-2xl font-bold mb-6">デザイン2: 2:3比率の細長カード</h2>
        <p className="text-gray-600 mb-8">
          2:3比率の縦長でエレガントなデザイン。コンテンツを階層的に整理しやすく、
          視覚的に洗練された印象を与えます。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {sampleData.map((item) => (
            <TallCard
              key={item.id}
              title={item.title}
              description={item.description}
              imageUrl={item.imageUrl}
              category={item.category}
              date={item.date}
              href={item.href}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

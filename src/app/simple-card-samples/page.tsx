import { SimpleCardCarousel } from '@/components/SimpleCardCarousel'

// サンプルデータ
const sampleSlides = [
  {
    id: '1',
    title: 'ビジネスコミュニケーション入門',
    description: '効果的なビジネスコミュニケーションの基本を学びましょう。',
    imageUrl: 'https://images.unsplash.com/photo-1551434678-e076c223a692?q=80&w=2070&auto=format&fit=crop',
    linkUrl: '/articles/business-communication',
    linkText: '記事を読む',
    category: 'コミュニケーション'
  },
  {
    id: '2',
    title: 'プロジェクト管理の基礎',
    description: 'プロジェクト管理の基本的な手法とツールについて解説します。',
    imageUrl: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=2070&auto=format&fit=crop',
    linkUrl: '/articles/project-management',
    linkText: '記事を読む',
    category: 'マネジメント'
  },
  {
    id: '3',
    title: 'ビジネス戦略の立て方',
    description: '効果的なビジネス戦略を立てるための考え方とフレームワーク。',
    imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2070&auto=format&fit=crop',
    linkUrl: '/articles/business-strategy',
    linkText: '記事を読む',
    category: '戦略'
  },
  {
    id: '4',
    title: 'リーダーシップスキル向上講座',
    description: 'チームを効果的に導くためのリーダーシップスキルを身につけましょう。',
    imageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?q=80&w=2070&auto=format&fit=crop',
    linkUrl: '/articles/leadership',
    linkText: '記事を読む',
    category: 'リーダーシップ'
  },
  {
    id: '5',
    title: 'ビジネスプレゼンテーション術',
    description: '説得力のあるプレゼンテーションを行うためのテクニックを紹介します。',
    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=2074&auto=format&fit=crop',
    linkUrl: '/articles/presentation',
    linkText: '記事を読む',
    category: 'プレゼンテーション'
  },
  {
    id: '6',
    title: '効率的な時間管理法',
    description: '仕事の生産性を高めるための時間管理テクニックを学びましょう。',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070&auto=format&fit=crop',
    linkUrl: '/articles/time-management',
    linkText: '記事を読む',
    category: '生産性'
  },
  {
    id: '7',
    title: 'ビジネスネゴシエーション入門',
    description: 'ビジネスにおける交渉術の基本と応用テクニックを解説します。',
    imageUrl: 'https://images.unsplash.com/photo-1573497491765-dccce02b29df?q=80&w=2070&auto=format&fit=crop',
    linkUrl: '/articles/negotiation',
    linkText: '記事を読む',
    category: '交渉'
  }
]

export default function SimpleCardSamplesPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">シンプルカードサンプル</h1>

      <SimpleCardCarousel slides={sampleSlides} autoplayInterval={3000} />

      <div className="mt-12 p-6 bg-gray-100 rounded-lg">
        <h2 className="text-xl font-bold mb-4">このページについて</h2>
        <p>
          このページは、シンプルなカードカルーセルのサンプル実装です。
          バグが少なく、安定した動作を目指して設計されています。
        </p>
        <ul className="list-disc ml-6 mt-4">
          <li>5つのカードが同時に表示されます</li>
          <li>中央のカードが強調表示されます</li>
          <li>両端のカードは少し見切れて表示されます</li>
          <li>カードは正方形のデザインです</li>
          <li>自動再生機能付きです</li>
        </ul>
      </div>
    </div>
  )
}

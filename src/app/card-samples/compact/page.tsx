import CompactCard from '@/components/card-samples/compact-card';

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
];

export default function CompactCardSamplesPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-12">コンパクトカードデザインサンプル (1:1.6)</h1>

      {/* 角丸のバリエーション */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">角丸のバリエーション</h2>
        <p className="text-gray-600 mb-8">
          異なる角丸の設定を持つカードデザイン。シャープなエッジから大きく丸みを帯びたデザインまで。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          <div>
            <h3 className="text-center mb-4">シャープ</h3>
            <CompactCard
              title={sampleData[0].title}
              description={sampleData[0].description}
              imageUrl={sampleData[0].imageUrl}
              category={sampleData[0].category}
              date={sampleData[0].date}
              href={sampleData[0].href}
              variant="sharp"
              shadow="md"
              border="thin"
            />
          </div>

          <div>
            <h3 className="text-center mb-4">デフォルト</h3>
            <CompactCard
              title={sampleData[0].title}
              description={sampleData[0].description}
              imageUrl={sampleData[0].imageUrl}
              category={sampleData[0].category}
              date={sampleData[0].date}
              href={sampleData[0].href}
              variant="default"
              shadow="md"
              border="thin"
            />
          </div>

          <div>
            <h3 className="text-center mb-4">丸み</h3>
            <CompactCard
              title={sampleData[0].title}
              description={sampleData[0].description}
              imageUrl={sampleData[0].imageUrl}
              category={sampleData[0].category}
              date={sampleData[0].date}
              href={sampleData[0].href}
              variant="rounded"
              shadow="md"
              border="thin"
            />
          </div>

          <div>
            <h3 className="text-center mb-4">大きな丸み</h3>
            <CompactCard
              title={sampleData[0].title}
              description={sampleData[0].description}
              imageUrl={sampleData[0].imageUrl}
              category={sampleData[0].category}
              date={sampleData[0].date}
              href={sampleData[0].href}
              variant="extra-rounded"
              shadow="md"
              border="thin"
            />
          </div>
        </div>
      </section>

      {/* シャドウのバリエーション */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">シャドウのバリエーション</h2>
        <p className="text-gray-600 mb-8">
          異なるシャドウの強さを持つカードデザイン。シャドウなしから大きなシャドウまで。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          <div>
            <h3 className="text-center mb-4">シャドウなし</h3>
            <CompactCard
              title={sampleData[1].title}
              description={sampleData[1].description}
              imageUrl={sampleData[1].imageUrl}
              category={sampleData[1].category}
              date={sampleData[1].date}
              href={sampleData[1].href}
              variant="rounded"
              shadow="none"
              border="thin"
            />
          </div>

          <div>
            <h3 className="text-center mb-4">小さいシャドウ</h3>
            <CompactCard
              title={sampleData[1].title}
              description={sampleData[1].description}
              imageUrl={sampleData[1].imageUrl}
              category={sampleData[1].category}
              date={sampleData[1].date}
              href={sampleData[1].href}
              variant="rounded"
              shadow="sm"
              border="thin"
            />
          </div>

          <div>
            <h3 className="text-center mb-4">中くらいシャドウ</h3>
            <CompactCard
              title={sampleData[1].title}
              description={sampleData[1].description}
              imageUrl={sampleData[1].imageUrl}
              category={sampleData[1].category}
              date={sampleData[1].date}
              href={sampleData[1].href}
              variant="rounded"
              shadow="md"
              border="thin"
            />
          </div>

          <div>
            <h3 className="text-center mb-4">大きいシャドウ</h3>
            <CompactCard
              title={sampleData[1].title}
              description={sampleData[1].description}
              imageUrl={sampleData[1].imageUrl}
              category={sampleData[1].category}
              date={sampleData[1].date}
              href={sampleData[1].href}
              variant="rounded"
              shadow="xl"
              border="thin"
            />
          </div>
        </div>
      </section>

      {/* ボーダーのバリエーション */}
      <section>
        <h2 className="text-2xl font-bold mb-6">ボーダーのバリエーション</h2>
        <p className="text-gray-600 mb-8">
          異なるボーダースタイルを持つカードデザイン。ボーダーなしからグラデーションボーダーまで。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          <div>
            <h3 className="text-center mb-4">ボーダーなし</h3>
            <CompactCard
              title={sampleData[2].title}
              description={sampleData[2].description}
              imageUrl={sampleData[2].imageUrl}
              category={sampleData[2].category}
              date={sampleData[2].date}
              href={sampleData[2].href}
              variant="rounded"
              shadow="md"
              border="none"
            />
          </div>

          <div>
            <h3 className="text-center mb-4">細いボーダー</h3>
            <CompactCard
              title={sampleData[2].title}
              description={sampleData[2].description}
              imageUrl={sampleData[2].imageUrl}
              category={sampleData[2].category}
              date={sampleData[2].date}
              href={sampleData[2].href}
              variant="rounded"
              shadow="md"
              border="thin"
            />
          </div>

          <div>
            <h3 className="text-center mb-4">太いボーダー</h3>
            <CompactCard
              title={sampleData[2].title}
              description={sampleData[2].description}
              imageUrl={sampleData[2].imageUrl}
              category={sampleData[2].category}
              date={sampleData[2].date}
              href={sampleData[2].href}
              variant="rounded"
              shadow="md"
              border="medium"
            />
          </div>

          <div>
            <h3 className="text-center mb-4">グラデーションボーダー</h3>
            <CompactCard
              title={sampleData[2].title}
              description={sampleData[2].description}
              imageUrl={sampleData[2].imageUrl}
              category={sampleData[2].category}
              date={sampleData[2].date}
              href={sampleData[2].href}
              variant="rounded"
              shadow="md"
              border="gradient"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

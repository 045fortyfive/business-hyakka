import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'skillpediaとは？ | ビジネススキル百科',
  description: 'skillpediaは、現代のビジネスパーソンが必要とするスキルを体系的に学べるプラットフォームです。記事、動画、音声コンテンツを通じて、実践的なビジネススキルを身につけることができます。',
  openGraph: {
    title: 'skillpediaとは？ | ビジネススキル百科',
    description: 'skillpediaは、現代のビジネスパーソンが必要とするスキルを体系的に学べるプラットフォームです。',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      <div className="max-w-4xl mx-auto">
        {/* パンくずリスト */}
        <div className="flex items-center text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-blue-600">
            ホーム
          </Link>
          <span className="mx-2">&gt;</span>
          <span className="text-gray-700">skillpediaとは？</span>
        </div>

        {/* ヘッダー */}
        <header className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-teal-600 bg-clip-text text-transparent">
            skillpediaとは？
          </h1>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            現代のビジネスパーソンが必要とするスキルを<br className="hidden md:block" />
            体系的に学べるプラットフォーム
          </p>
        </header>

        {/* メインコンテンツ */}
        <div className="space-y-12">
          {/* ミッション */}
          <section className="bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
              私たちのミッション
            </h2>
            <div className="prose prose-lg max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                skillpediaは、急速に変化するビジネス環境において、個人と組織の成長を支援することを使命としています。
                AIやデジタル技術の進歩により、従来のスキルセットだけでは対応できない新しい課題が次々と生まれています。
              </p>
              <p className="text-gray-700 leading-relaxed">
                私たちは、最新のビジネストレンドと実践的なスキルを組み合わせた学習コンテンツを提供し、
                すべてのビジネスパーソンが自信を持って未来に向かえるよう支援します。
              </p>
            </div>
          </section>

          {/* 特徴 */}
          <section>
            <h2 className="text-2xl md:text-3xl font-bold mb-8 text-center text-gray-900">
              skillpediaの特徴
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {/* 特徴1 */}
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">豊富な記事コンテンツ</h3>
                <p className="text-gray-600 leading-relaxed">
                  実践的なビジネススキルから最新のトレンドまで、幅広いトピックを詳しく解説した記事を提供しています。
                </p>
              </div>

              {/* 特徴2 */}
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">動画で学ぶ</h3>
                <p className="text-gray-600 leading-relaxed">
                  視覚的に理解しやすい動画コンテンツで、複雑なビジネス概念も分かりやすく学習できます。
                </p>
              </div>

              {/* 特徴3 */}
              <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-3 text-gray-900">音声コンテンツ</h3>
                <p className="text-gray-600 leading-relaxed">
                  通勤時間や移動中にも学習できる音声コンテンツで、効率的にスキルアップを図れます。
                </p>
              </div>
            </div>
          </section>

          {/* 対象者 */}
          <section className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center text-gray-900">
              こんな方におすすめ
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">新入社員・若手ビジネスパーソン</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">管理職・リーダーを目指す方</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">転職・キャリアチェンジを考えている方</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">起業家・フリーランス</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">継続的な学習を重視する方</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">最新のビジネストレンドを知りたい方</p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="text-center bg-white rounded-lg shadow-sm p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-gray-900">
              今すぐ学習を始めましょう
            </h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              skillpediaで、あなたのビジネススキルを次のレベルへ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/articles"
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                記事を読む
              </Link>
              <Link
                href="/videos"
                className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                動画を見る
              </Link>
              <Link
                href="/audios"
                className="bg-gradient-to-r from-teal-600 to-teal-700 text-white px-6 py-3 rounded-lg font-medium hover:from-teal-700 hover:to-teal-800 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                音声を聞く
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* サイト情報 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">ビジネススキル百科</h3>
            <p className="text-gray-300">
              若手ビジネスパーソンのためのスキルアップ情報サイト。
              記事、動画、音声でビジネススキルを学べます。
            </p>
          </div>

          {/* クイックリンク */}
          <div>
            <h3 className="text-xl font-semibold mb-4">クイックリンク</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  ホーム
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-300 hover:text-white">
                  記事一覧
                </Link>
              </li>
              <li>
                <Link href="/videos" className="text-gray-300 hover:text-white">
                  動画一覧
                </Link>
              </li>
              <li>
                <Link href="/audios" className="text-gray-300 hover:text-white">
                  音声一覧
                </Link>
              </li>
              <li>
                <Link href="/categories" className="text-gray-300 hover:text-white">
                  カテゴリ一覧
                </Link>
              </li>
            </ul>
          </div>

          {/* カテゴリ */}
          <div>
            <h3 className="text-xl font-semibold mb-4">主要カテゴリ</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/categories/basic-business-skills"
                  className="text-gray-300 hover:text-white"
                >
                  基本ビジネススキル
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/communication"
                  className="text-gray-300 hover:text-white"
                >
                  コミュニケーション
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/management"
                  className="text-gray-300 hover:text-white"
                >
                  マネジメント
                </Link>
              </li>
              <li>
                <Link
                  href="/categories/business-improvement"
                  className="text-gray-300 hover:text-white"
                >
                  業務改善
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* コピーライト */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
          <p>© {currentYear} ビジネススキル百科. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

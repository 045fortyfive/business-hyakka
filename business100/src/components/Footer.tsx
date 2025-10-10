import Link from 'next/link';
import { getCategories } from '@/lib/api';
import { filterVisibleCategories } from '@/config/categories';

export default async function Footer() {
  const currentYear = new Date().getFullYear();

  let orderedCategories: any[] = [];

  try {
    // Contentfulからカテゴリーデータを取得
    const categoriesData = await getCategories();
    const visibleCategories = filterVisibleCategories(categoriesData.items);

    // 指定された順序でカテゴリーを並び替え（実際のContentfulのカテゴリー名に合わせる）
    const categoryOrder = ['基礎ビジネススキル', '思考法', '業務改善'];
    orderedCategories = categoryOrder
      .map(name => visibleCategories.find(cat => cat.fields.name === name))
      .filter(Boolean) as typeof visibleCategories;
  } catch (error) {
    console.error('Error fetching categories for footer:', error);
    // エラー時はフォールバック（空の配列）
    orderedCategories = [];
  }

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

          {/* カテゴリ - Contentfulから動的に取得 */}
          <div>
            <h3 className="text-xl font-semibold mb-4">主要カテゴリ</h3>
            <ul className="space-y-2">
              {orderedCategories.length > 0 ? (
                orderedCategories.map((category) => (
                  <li key={category.sys.id}>
                    <Link
                      href={`/categories/${category.fields.slug}`}
                      className="text-gray-300 hover:text-white"
                    >
                      {category.fields.name}
                    </Link>
                  </li>
                ))
              ) : (
                // フォールバック表示
                <>
                  <li>
                    <Link href="/categories" className="text-gray-300 hover:text-white">
                      カテゴリ一覧
                    </Link>
                  </li>
                </>
              )}
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

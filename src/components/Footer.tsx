import Link from 'next/link';
import { getCategories } from '@/lib/api';
import { filterVisibleCategories } from '@/config/categories';

export default async function Footer() {
  const currentYear = new Date().getFullYear();

  // Contentfulからカテゴリを取得し、表示可能なものだけをフィルタリング
  let categories: Array<{ name: string; slug: string }> = [];
  try {
    const categoriesData = await getCategories();
    const visibleCategories = filterVisibleCategories(categoriesData.items);

    // Contentfulから取得した正しいslugを使用
    categories = visibleCategories.map((category) => ({
      name: category.fields.name as string,
      slug: category.fields.slug as string,
    }));
  } catch (error) {
    console.error('Footer: カテゴリ取得エラー', error);
    // エラー時はフォールバック（types.tsで定義されたマッピングを使用）
    categories = [
      { name: '基礎ビジネススキル', slug: 'basic-business-skill' },
      { name: '思考法', slug: 'sikouhou' },
      { name: '業務改善', slug: 'Business-improvement' },
    ];
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
                <Link href="/categories" className="text-gray-300 hover:text-white">
                  カテゴリ一覧
                </Link>
              </li>
            </ul>
          </div>

          {/* カテゴリ（Contentfulから動的取得） */}
          <div>
            <h3 className="text-xl font-semibold mb-4">主要カテゴリ</h3>
            <ul className="space-y-2">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link
                    href={`/categories/${category.slug}`}
                    className="text-gray-300 hover:text-white"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
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

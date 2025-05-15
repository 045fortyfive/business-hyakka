import { Metadata } from "next";
import Link from "next/link";
import { getCategories } from "@/lib/api";

// メタデータ
export const metadata: Metadata = {
  title: "カテゴリ一覧 | ビジネススキル百科",
  description: "ビジネススキル百科のコンテンツカテゴリ一覧です。基本ビジネススキル、コミュニケーション、マネジメント、業務改善など、様々なカテゴリから学びたいスキルを探せます。",
};

// 1時間ごとに再検証
export const revalidate = 3600;

export default async function CategoriesPage() {
  // カテゴリ一覧を取得
  const categoriesData = await getCategories();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">カテゴリ一覧</h1>
      
      {categoriesData.items.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {categoriesData.items.map((category) => (
            <Link
              key={category.sys.id}
              href={`/categories/${category.fields.slug}`}
              className="bg-white shadow-md hover:shadow-lg rounded-lg p-6 transition-shadow duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">{category.fields.name}</h2>
              {category.fields.description && (
                <p className="text-gray-600 text-sm">
                  {category.fields.description}
                </p>
              )}
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-gray-100 p-8 rounded-lg text-center">
          <p className="text-gray-600">カテゴリが見つかりませんでした。</p>
        </div>
      )}
    </div>
  );
}

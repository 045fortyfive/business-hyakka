'use client';

import Link from 'next/link';
import { getGradientColorByCategory } from '@/utils/category-colors';
import { CategoryIcon } from './category-icons';

interface CategoryTagsProps {
  categories: {
    sys: {
      id: string;
    };
    fields: {
      name: string;
      slug: string;
      description?: string;
    };
  }[];
}

export function CategoryTags({ categories }: CategoryTagsProps) {
  // カテゴリーがない場合は表示しない
  if (categories.length === 0) {
    return null;
  }

  // グラデーションカラーのクラス名を取得
  const getGradientClass = (categoryName: string) => {
    const gradientColor = getGradientColorByCategory(categoryName);
    
    switch (gradientColor) {
      case 'media-blue':
        return 'from-blue-400 via-sky-500 to-indigo-600';
      case 'media-purple':
        return 'from-violet-400 via-purple-500 to-indigo-600';
      case 'media-teal':
        return 'from-teal-400 via-cyan-500 to-sky-600';
      case 'tangerine-coral':
        return 'from-orange-300 via-red-400 to-rose-500';
      default:
        return 'from-blue-400 via-sky-500 to-indigo-600';
    }
  };

  return (
    <section className="mb-16">
      <h2 className="text-2xl font-bold mb-6">カテゴリーから探す</h2>
      <div className="flex flex-wrap gap-4">
        {categories.map((category) => (
          <Link
            key={category.sys.id}
            href={`/categories/${category.fields.slug}`}
            className="group"
          >
            <div className={`p-[2px] rounded-full bg-gradient-to-br ${getGradientClass(category.fields.name)}`}>
              <div className="flex items-center bg-white rounded-full px-4 py-2 transition-colors group-hover:bg-gray-50">
                <div className="mr-2">
                  <CategoryIcon category={category.fields.name} className="h-5 w-5" />
                </div>
                <span className="font-medium text-gray-800">{category.fields.name}</span>
              </div>
            </div>
          </Link>
        ))}
        <Link href="/categories" className="group">
          <div className="p-[2px] rounded-full bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600">
            <div className="flex items-center bg-white rounded-full px-4 py-2 transition-colors group-hover:bg-gray-50">
              <span className="font-medium text-gray-800">すべて見る</span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}

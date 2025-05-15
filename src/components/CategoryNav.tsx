import Link from 'next/link';
import { CategoryFields } from '@/lib/types';

interface CategoryNavProps {
  categories: {
    fields: CategoryFields;
    sys: {
      id: string;
    };
  }[];
  currentCategorySlug?: string;
}

export default function CategoryNav({ categories, currentCategorySlug }: CategoryNavProps) {
  return (
    <nav className="bg-white shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4">カテゴリ</h2>
      <ul className="space-y-2">
        {categories.map((category) => {
          const isActive = category.fields.slug === currentCategorySlug;
          return (
            <li key={category.sys.id}>
              <Link
                href={`/categories/${category.fields.slug}`}
                className={`block px-3 py-2 rounded-md transition-colors duration-200 ${
                  isActive
                    ? 'bg-blue-100 text-blue-700 font-medium'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {category.fields.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

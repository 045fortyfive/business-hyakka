import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';

// コンテンツカードのプロパティ型定義
interface ContentCardProps {
  title: string;
  slug: string;
  publishDate: string;
  category: {
    name: string;
    slug: string;
  };
  thumbnail?: {
    url: string;
    width: number;
    height: number;
    alt: string;
  };
  contentType: 'article' | 'video' | 'audio';
  description?: string;
}

export default function ContentCard({
  title,
  slug,
  publishDate,
  category,
  thumbnail,
  contentType,
  description,
}: ContentCardProps) {
  // コンテンツタイプに応じたURLパスを生成
  const contentPath = `/${contentType}s/${slug}`;
  const categoryPath = `/categories/${category.slug}`;

  // コンテンツタイプに応じたアイコンを表示
  const contentTypeIcon = () => {
    switch (contentType) {
      case 'article':
        return (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            />
          </svg>
        );
      case 'video':
        return (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            />
          </svg>
        );
      case 'audio':
        return (
          <svg
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <Link href={contentPath}>
        <div className="relative h-36 sm:h-40 md:h-48 w-full">
          {thumbnail ? (
            <Image
              src={thumbnail.url}
              alt={thumbnail.alt || title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover"
              priority={false}
            />
          ) : (
            <div className="bg-gray-200 h-full w-full flex items-center justify-center">
              <span className="text-gray-400 text-3xl sm:text-4xl">{contentTypeIcon()}</span>
            </div>
          )}
          <div className="absolute top-0 right-0 bg-blue-600 text-white px-1.5 py-0.5 sm:px-2 sm:py-1 text-xs font-semibold rounded-bl-lg flex items-center space-x-1">
            <span>{contentTypeIcon()}</span>
            <span>{contentType === 'article' ? '記事' : contentType === 'video' ? '動画' : '音声'}</span>
          </div>
        </div>
      </Link>

      <div className="p-2 sm:p-3 md:p-4">
        <div className="flex items-center text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
          <time dateTime={publishDate}>{formatDate(publishDate)}</time>
          <span className="mx-1 sm:mx-2">•</span>
          <Link href={categoryPath} className="hover:text-blue-600">
            {category.name}
          </Link>
        </div>

        <Link href={contentPath}>
          <h3 className="text-base sm:text-lg md:text-xl font-semibold mb-1 sm:mb-2 hover:text-blue-600 transition-colors duration-200 line-clamp-2">
            {title}
          </h3>
        </Link>

        {description && (
          <p className="text-gray-600 text-xs sm:text-sm line-clamp-2">{description}</p>
        )}

        <Link
          href={contentPath}
          className="inline-block mt-2 sm:mt-3 text-sm sm:text-base text-blue-600 hover:text-blue-800 font-medium"
        >
          続きを読む &rarr;
        </Link>
      </div>
    </div>
  );
}

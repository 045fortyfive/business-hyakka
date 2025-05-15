import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface GoldenRatioCardProps {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
  href: string;
  className?: string;
}

export default function GoldenRatioCard({
  title,
  description,
  imageUrl,
  category,
  date,
  href,
  className,
}: GoldenRatioCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[444px] h-[718px] flex flex-col rounded-xl overflow-hidden border border-gray-200 shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]",
        className
      )}
    >
      <div className="relative w-full h-[200px]">
        <Image
          src={imageUrl}
          alt={title}
          fill
          className="object-cover"
          sizes="444px"
        />
      </div>

      <div className="flex-1 flex flex-col p-6 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/30">
        <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>

        <p className="text-gray-600 mb-6 flex-grow">
          {description}
        </p>

        <div className="mt-auto">
          <Link
            href={href}
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            詳細を見る
          </Link>
        </div>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <span className="text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
          {category}
        </span>
        <span className="text-sm text-gray-500">{date}</span>
      </div>
    </div>
  );
}

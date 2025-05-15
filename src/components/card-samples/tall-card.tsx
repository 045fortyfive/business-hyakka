import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface TallCardProps {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
  href: string;
  className?: string;
}

export default function TallCard({
  title,
  description,
  imageUrl,
  category,
  date,
  href,
  className,
}: TallCardProps) {
  return (
    <div
      className={cn(
        "w-full max-w-[444px] h-[666px] flex flex-col rounded-2xl overflow-hidden border border-gray-200 shadow-md transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]",
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

      <div className="p-6 border-b border-gray-100">
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        <span className="inline-block mt-2 text-sm font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
          {category}
        </span>
      </div>

      <div className="flex-1 p-6 bg-gradient-to-br from-white via-blue-50/20 to-purple-50/30">
        <p className="text-gray-600">
          {description}
        </p>
      </div>

      <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <span className="text-sm text-gray-500">{date}</span>
        <Link
          href={href}
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          詳細を見る
        </Link>
      </div>
    </div>
  );
}

import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BlurCardProps {
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  date: string;
  href: string;
  className?: string;
  variant?: 'default' | 'rounded' | 'extra-rounded' | 'sharp';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  border?: 'none' | 'thin' | 'medium' | 'gradient';
  gradientColor?: 'blue-purple' | 'green-blue' | 'orange-red' | 'pink-purple' | 'yellow-orange';
  blurStrength?: 'light' | 'medium' | 'strong';
  textColor?: 'light' | 'medium' | 'dark';
}

export default function BlurCard({
  title,
  description,
  imageUrl,
  category,
  date,
  href,
  className,
  variant = 'extra-rounded',
  shadow = 'xl',
  border = 'gradient',
  gradientColor = 'blue-purple',
  blurStrength = 'medium',
  textColor = 'light',
}: BlurCardProps) {
  // 縦横比率を調整（幅444px × 高さ500px）
  // 画像は444x200のままで、残りのスペース（約300px）にタイトルと説明文を配置

  // バリアントに基づいた角丸の設定
  const roundedClasses = {
    default: 'rounded-lg',
    rounded: 'rounded-xl',
    'extra-rounded': 'rounded-3xl',
    sharp: 'rounded-none',
  };

  // シャドウの設定
  const shadowClasses = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
  };

  // ボーダーの設定
  const borderClasses = {
    none: 'border-0',
    thin: 'border border-gray-200',
    medium: 'border-2 border-gray-200',
    gradient: '',
  };

  // グラデーションカラーの設定
  const gradientClasses = {
    'blue-purple': 'p-[2px] bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500',
    'green-blue': 'p-[2px] bg-gradient-to-br from-green-400 via-teal-500 to-blue-500',
    'orange-red': 'p-[2px] bg-gradient-to-br from-yellow-400 via-orange-500 to-red-500',
    'pink-purple': 'p-[2px] bg-gradient-to-br from-pink-400 via-fuchsia-500 to-purple-500',
    'yellow-orange': 'p-[2px] bg-gradient-to-br from-yellow-300 via-amber-500 to-orange-600',
  };

  // ぼかしの強さの設定
  const blurClasses = {
    light: 'backdrop-blur-sm bg-gray-800/60',
    medium: 'backdrop-blur-md bg-gray-800/70',
    strong: 'backdrop-blur-lg bg-gray-800/80',
  };

  // テキストカラーの設定
  const textColorClasses = {
    light: 'text-gray-100',
    medium: 'text-gray-300',
    dark: 'text-gray-400',
  };

  // 内部コンテンツのボーダー設定
  const innerBorderClasses = border === 'gradient'
    ? 'bg-black ' + roundedClasses[variant]
    : '';

  return (
    <div
      className={cn(
        "w-full max-w-[444px] overflow-hidden transition-all duration-300 hover:translate-y-[-5px]",
        roundedClasses[variant],
        shadowClasses[shadow],
        border === 'gradient' ? gradientClasses[gradientColor] : borderClasses[border],
        className
      )}
    >
      <div className={cn("flex flex-col h-[500px]", innerBorderClasses)}>
        <div className="relative w-full h-[200px]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="444px"
          />
          <div className="absolute bottom-0 left-0 p-2">
            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
              {category}
            </span>
          </div>
        </div>

        <div className="flex-1 p-6 bg-black relative">
          {/* ぼかし効果のあるテキストエリア */}
          <div className={cn(
            "absolute inset-0 p-6",
            blurClasses[blurStrength]
          )}>
            <div className="h-full flex flex-col">
              <h3 className={cn("text-xl font-bold mb-3 line-clamp-2", textColorClasses[textColor])}>
                {title}
              </h3>

              <p className={cn("mb-4 line-clamp-3", textColorClasses[textColor])}>
                {description}
              </p>

              <div className="mt-auto flex justify-between items-center">
                <span className={cn("text-sm", textColorClasses[textColor])}>{date}</span>
                <Link
                  href={href}
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  詳細
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

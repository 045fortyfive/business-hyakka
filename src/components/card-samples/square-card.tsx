import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { getGradientColorByCategory } from '@/utils/category-colors';

interface SquareCardProps {
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
  gradientColor?:
    // 基本カラー
    'blue-purple' | 'green-blue' | 'orange-red' | 'pink-purple' | 'yellow-orange' | 'blue-teal' | 'purple-pink' | 'red-purple' |
    // 爽やかなカラー
    'fresh-orange' | 'fresh-green' | 'sunny-yellow' | 'coral-orange' | 'mint-green' | 'sky-blue' |
    // 改良オレンジ系
    'sunset-orange' | 'peach-orange' | 'amber-gold' | 'tangerine-coral' |
    // Canvaスタイル
    'canva-purple' | 'canva-blue' | 'canva-teal' | 'canva-green' | 'canva-yellow' | 'canva-orange' | 'canva-red' | 'canva-pink' |
    // モダンメディア
    'media-blue' | 'media-purple' | 'media-teal' | 'media-green' | 'media-orange' | 'media-red';
  useAutomaticColor?: boolean; // カテゴリーに基づいて自動的にカラーを選択するかどうか
}

export default function SquareCard({
  title,
  description,
  imageUrl,
  category,
  date,
  href,
  className,
  variant = 'rounded',
  shadow = 'md',
  border = 'gradient',
  gradientColor = 'blue-purple',
  useAutomaticColor = false,
}: SquareCardProps) {

  // カテゴリーに基づいて自動的にカラーを選択
  const finalGradientColor = useAutomaticColor
    ? getGradientColorByCategory(category)
    : gradientColor;
  // 正方形カード（幅444px × 高さ444px）
  // 画像は16:9比率（444x250）

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
    // 基本カラー
    'blue-purple': 'p-[2px] bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-700',
    'green-blue': 'p-[2px] bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-700',
    'orange-red': 'p-[2px] bg-gradient-to-br from-amber-500 via-orange-600 to-red-700',
    'pink-purple': 'p-[2px] bg-gradient-to-br from-rose-500 via-pink-600 to-fuchsia-700',
    'yellow-orange': 'p-[2px] bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-700',
    'blue-teal': 'p-[2px] bg-gradient-to-br from-blue-500 via-sky-600 to-teal-700',
    'purple-pink': 'p-[2px] bg-gradient-to-br from-purple-500 via-fuchsia-600 to-pink-700',
    'red-purple': 'p-[2px] bg-gradient-to-br from-red-500 via-rose-600 to-purple-700',

    // 爽やかなオレンジ系
    'fresh-orange': 'p-[2px] bg-gradient-to-br from-orange-300 via-amber-400 to-orange-500',
    'coral-orange': 'p-[2px] bg-gradient-to-br from-red-300 via-orange-400 to-amber-500',

    // 爽やかなグリーン系
    'fresh-green': 'p-[2px] bg-gradient-to-br from-green-300 via-emerald-400 to-teal-500',
    'mint-green': 'p-[2px] bg-gradient-to-br from-teal-300 via-emerald-400 to-green-500',

    // 明るい黄色-オレンジ系
    'sunny-yellow': 'p-[2px] bg-gradient-to-br from-yellow-300 via-amber-300 to-orange-400',

    // 爽やかなブルー系
    'sky-blue': 'p-[2px] bg-gradient-to-br from-sky-300 via-blue-400 to-indigo-500',

    // 改良オレンジ系
    'sunset-orange': 'p-[2px] bg-gradient-to-br from-yellow-400 via-orange-500 to-rose-500',
    'peach-orange': 'p-[2px] bg-gradient-to-br from-orange-200 via-orange-300 to-red-400',
    'amber-gold': 'p-[2px] bg-gradient-to-br from-yellow-200 via-amber-400 to-orange-500',
    'tangerine-coral': 'p-[2px] bg-gradient-to-br from-orange-300 via-red-400 to-rose-500',

    // Canvaスタイル
    'canva-purple': 'p-[2px] bg-gradient-to-br from-indigo-400 via-purple-500 to-fuchsia-600',
    'canva-blue': 'p-[2px] bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600',
    'canva-teal': 'p-[2px] bg-gradient-to-br from-cyan-400 via-teal-500 to-emerald-600',
    'canva-green': 'p-[2px] bg-gradient-to-br from-lime-400 via-green-500 to-emerald-600',
    'canva-yellow': 'p-[2px] bg-gradient-to-br from-yellow-300 via-amber-400 to-orange-500',
    'canva-orange': 'p-[2px] bg-gradient-to-br from-orange-300 via-orange-500 to-red-600',
    'canva-red': 'p-[2px] bg-gradient-to-br from-rose-400 via-red-500 to-rose-600',
    'canva-pink': 'p-[2px] bg-gradient-to-br from-pink-300 via-rose-400 to-fuchsia-500',

    // モダンメディア
    'media-blue': 'p-[2px] bg-gradient-to-br from-blue-400 via-sky-500 to-indigo-600',
    'media-purple': 'p-[2px] bg-gradient-to-br from-violet-400 via-purple-500 to-indigo-600',
    'media-teal': 'p-[2px] bg-gradient-to-br from-teal-400 via-cyan-500 to-sky-600',
    'media-green': 'p-[2px] bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600',
    'media-orange': 'p-[2px] bg-gradient-to-br from-amber-400 via-orange-500 to-red-600',
    'media-red': 'p-[2px] bg-gradient-to-br from-red-400 via-rose-500 to-pink-600',
  };

  // 内部コンテンツのボーダー設定
  const innerBorderClasses = border === 'gradient'
    ? 'bg-white ' + roundedClasses[variant]
    : '';

  // グラデーション背景の色を取得
  const getGradientBgClass = (color: string) => {
    switch (color) {
      // 基本カラー（濃い色調）
      case 'blue-purple':
        return 'from-blue-900/95 via-indigo-900/95 to-purple-900/95';
      case 'green-blue':
        return 'from-emerald-900/95 via-teal-900/95 to-cyan-900/95';
      case 'orange-red':
        return 'from-amber-900/95 via-orange-900/95 to-red-900/95';
      case 'pink-purple':
        return 'from-rose-900/95 via-pink-900/95 to-fuchsia-900/95';
      case 'yellow-orange':
        return 'from-yellow-900/95 via-amber-900/95 to-orange-900/95';
      case 'blue-teal':
        return 'from-blue-900/95 via-sky-900/95 to-teal-900/95';
      case 'purple-pink':
        return 'from-purple-900/95 via-fuchsia-900/95 to-pink-900/95';
      case 'red-purple':
        return 'from-red-900/95 via-rose-900/95 to-purple-900/95';

      // 爽やかなオレンジ系（やや明るい色調）
      case 'fresh-orange':
        return 'from-orange-800/95 via-amber-800/95 to-orange-700/95';
      case 'coral-orange':
        return 'from-red-800/95 via-orange-800/95 to-amber-700/95';

      // 爽やかなグリーン系（やや明るい色調）
      case 'fresh-green':
        return 'from-green-800/95 via-emerald-800/95 to-teal-700/95';
      case 'mint-green':
        return 'from-teal-800/95 via-emerald-800/95 to-green-700/95';

      // 明るい黄色-オレンジ系（やや明るい色調）
      case 'sunny-yellow':
        return 'from-amber-700/95 via-amber-800/95 to-orange-700/95';

      // 爽やかなブルー系（やや明るい色調）
      case 'sky-blue':
        return 'from-sky-800/95 via-blue-800/95 to-indigo-700/95';

      // 改良オレンジ系
      case 'sunset-orange':
        return 'from-yellow-800/95 via-orange-800/95 to-rose-800/95';
      case 'peach-orange':
        return 'from-orange-700/95 via-orange-800/95 to-red-700/95';
      case 'amber-gold':
        return 'from-yellow-700/95 via-amber-800/95 to-orange-700/95';
      case 'tangerine-coral':
        return 'from-orange-700/95 via-red-800/95 to-rose-700/95';

      // Canvaスタイル（やや明るい色調）
      case 'canva-purple':
        return 'from-indigo-800/95 via-purple-800/95 to-fuchsia-700/95';
      case 'canva-blue':
        return 'from-sky-800/95 via-blue-800/95 to-indigo-700/95';
      case 'canva-teal':
        return 'from-cyan-800/95 via-teal-800/95 to-emerald-700/95';
      case 'canva-green':
        return 'from-lime-800/95 via-green-800/95 to-emerald-700/95';
      case 'canva-yellow':
        return 'from-yellow-700/95 via-amber-800/95 to-orange-700/95';
      case 'canva-orange':
        return 'from-orange-700/95 via-orange-800/95 to-red-700/95';
      case 'canva-red':
        return 'from-rose-800/95 via-red-800/95 to-rose-700/95';
      case 'canva-pink':
        return 'from-pink-800/95 via-rose-800/95 to-fuchsia-700/95';

      // モダンメディア（やや明るい色調）
      case 'media-blue':
        return 'from-blue-800/95 via-sky-800/95 to-indigo-700/95';
      case 'media-purple':
        return 'from-violet-800/95 via-purple-800/95 to-indigo-700/95';
      case 'media-teal':
        return 'from-teal-800/95 via-cyan-800/95 to-sky-700/95';
      case 'media-green':
        return 'from-emerald-800/95 via-green-800/95 to-teal-700/95';
      case 'media-orange':
        return 'from-amber-800/95 via-orange-800/95 to-red-700/95';
      case 'media-red':
        return 'from-red-800/95 via-rose-800/95 to-pink-700/95';

      default:
        return 'from-blue-900/95 via-indigo-900/95 to-purple-900/95';
    }
  };

  return (
    <div
      className={cn(
        "w-full max-w-[444px] overflow-hidden transition-all duration-300 hover:translate-y-[-5px]",
        roundedClasses[variant],
        shadowClasses[shadow],
        border === 'gradient' ? gradientClasses[finalGradientColor] : borderClasses[border],
        className
      )}
    >
      <div className={cn("flex flex-col h-[444px]", innerBorderClasses)}>
        <div className="relative w-full h-[250px]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="444px"
          />
          <div className="absolute top-0 right-0 m-3">
            <span className="inline-block text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-700">
              {category}
            </span>
          </div>
        </div>

        <div className={`flex-1 p-4 bg-gradient-to-br ${getGradientBgClass(finalGradientColor)}`}>
          <h3 className="text-lg font-bold mb-2 line-clamp-2 text-white">
            {title}
          </h3>

          <p className="text-sm text-gray-100 mb-3 line-clamp-2">
            {description}
          </p>

          <div className="mt-auto flex justify-between items-center">
            <span className="text-xs text-gray-200">{date}</span>
            <Link
              href={href}
              className="inline-block px-3 py-1 text-sm bg-white text-gray-800 rounded-lg hover:bg-gray-100 transition-colors"
            >
              詳細
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { CONTENT_TYPES } from '@/lib/types';

// コンテンツタイプの表示設定
export const CONTENT_TYPE_CONFIG = {
  article: {
    label: '記事',
    bgColor: 'bg-blue-100',
    textColor: 'text-blue-800',
    borderColor: 'border-blue-200',
    icon: '📄',
    emoji: '📖'
  },
  video: {
    label: '動画',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
    borderColor: 'border-green-200',
    icon: '🎥',
    emoji: '📹'
  },
  audio: {
    label: '音声',
    bgColor: 'bg-purple-100',
    textColor: 'text-purple-800',
    borderColor: 'border-purple-200',
    icon: '🎧',
    emoji: '🎵'
  }
} as const;

export type ContentDisplayType = keyof typeof CONTENT_TYPE_CONFIG;

// コンテンツタイプを判定する関数
export function getContentDisplayType(contentTypes: string[]): ContentDisplayType {
  if (contentTypes.includes(CONTENT_TYPES.VIDEO)) return 'video';
  if (contentTypes.includes(CONTENT_TYPES.AUDIO)) return 'audio';
  return 'article'; // デフォルトは記事
}

// コンテンツタイプの設定を取得する関数
export function getContentTypeConfig(displayType: ContentDisplayType) {
  return CONTENT_TYPE_CONFIG[displayType];
}

// コンテンツタイプインジケーターのクラス名を生成する関数
export function getContentTypeIndicatorClasses(
  displayType: ContentDisplayType,
  size: 'xs' | 'sm' | 'md' | 'lg' = 'sm',
  className = ''
): string {
  const config = getContentTypeConfig(displayType);

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  return `inline-flex items-center gap-1 rounded-full font-medium ${config.bgColor} ${config.textColor} ${sizeClasses[size]} ${className}`.trim();
}

// コンテンツタイプバッジのクラス名を生成する関数（より詳細なスタイル）
export function getContentTypeBadgeClasses(
  displayType: ContentDisplayType,
  variant: 'filled' | 'outlined' | 'subtle' = 'filled',
  size: 'xs' | 'sm' | 'md' = 'sm',
  className = ''
): string {
  const config = getContentTypeConfig(displayType);

  const sizeClasses = {
    xs: 'px-1.5 py-0.5 text-xs',
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm'
  };

  const variantClasses = {
    filled: `${config.bgColor} ${config.textColor}`,
    outlined: `bg-white ${config.textColor} border ${config.borderColor}`,
    subtle: `bg-gray-50 ${config.textColor}`
  };

  return `inline-flex items-center gap-1 rounded-full font-medium ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();
}

// 複数のコンテンツタイプの情報を取得する関数
export function getMultiContentTypeInfo(
  contentTypes: string[],
  maxShow = 3
): {
  displayTypes: ContentDisplayType[];
  visibleTypes: ContentDisplayType[];
  remainingCount: number;
} {
  const displayTypes: ContentDisplayType[] = [];

  if (contentTypes.includes(CONTENT_TYPES.ARTICLE)) displayTypes.push('article');
  if (contentTypes.includes(CONTENT_TYPES.VIDEO)) displayTypes.push('video');
  if (contentTypes.includes(CONTENT_TYPES.AUDIO)) displayTypes.push('audio');

  const visibleTypes = displayTypes.slice(0, maxShow);
  const remainingCount = Math.max(0, displayTypes.length - maxShow);

  return {
    displayTypes,
    visibleTypes,
    remainingCount
  };
}

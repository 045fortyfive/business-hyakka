import React from 'react';
import { 
  getContentTypeConfig, 
  getContentTypeIndicatorClasses, 
  getContentTypeBadgeClasses,
  getMultiContentTypeInfo,
  type ContentDisplayType 
} from '@/utils/content-type-utils';

// コンテンツタイプインジケーターコンポーネント
export function ContentTypeIndicator({ 
  displayType, 
  size = 'sm',
  showIcon = true,
  className = ''
}: {
  displayType: ContentDisplayType;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}) {
  const config = getContentTypeConfig(displayType);
  const classes = getContentTypeIndicatorClasses(displayType, size, className);

  return (
    <span className={classes}>
      {showIcon && <span>{config.icon}</span>}
      {config.label}
    </span>
  );
}

// コンテンツタイプバッジコンポーネント（より詳細なスタイル）
export function ContentTypeBadge({ 
  displayType, 
  variant = 'filled',
  size = 'sm',
  className = ''
}: {
  displayType: ContentDisplayType;
  variant?: 'filled' | 'outlined' | 'subtle';
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}) {
  const config = getContentTypeConfig(displayType);
  const classes = getContentTypeBadgeClasses(displayType, variant, size, className);

  return (
    <span className={classes}>
      <span>{config.icon}</span>
      {config.label}
    </span>
  );
}

// 複数のコンテンツタイプを表示するコンポーネント
export function MultiContentTypeIndicator({ 
  contentTypes,
  maxShow = 3,
  size = 'sm',
  className = ''
}: {
  contentTypes: string[];
  maxShow?: number;
  size?: 'xs' | 'sm' | 'md';
  className?: string;
}) {
  const { visibleTypes, remainingCount } = getMultiContentTypeInfo(contentTypes, maxShow);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {visibleTypes.map((type) => (
        <ContentTypeIndicator 
          key={type}
          displayType={type} 
          size={size}
          showIcon={true}
        />
      ))}
      {remainingCount > 0 && (
        <span className="text-xs text-gray-500">
          +{remainingCount}
        </span>
      )}
    </div>
  );
}

// シンプルなコンテンツタイプアイコンコンポーネント
export function ContentTypeIcon({ 
  displayType,
  className = 'w-4 h-4'
}: {
  displayType: ContentDisplayType;
  className?: string;
}) {
  const config = getContentTypeConfig(displayType);

  return (
    <span className={className} title={config.label}>
      {config.icon}
    </span>
  );
}

// コンテンツタイプラベルコンポーネント
export function ContentTypeLabel({ 
  displayType,
  showIcon = false,
  className = ''
}: {
  displayType: ContentDisplayType;
  showIcon?: boolean;
  className?: string;
}) {
  const config = getContentTypeConfig(displayType);

  return (
    <span className={`inline-flex items-center gap-1 ${className}`}>
      {showIcon && <span>{config.icon}</span>}
      {config.label}
    </span>
  );
}

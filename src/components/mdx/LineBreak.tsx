/**
 * 改行用のカスタムコンポーネント
 * 改善版：より信頼性の高い改行レンダリングとアクセシビリティ対応
 */

import React from 'react';

/**
 * シンプルな改行コンポーネント
 * HTMLの<br>タグをReactコンポーネントとして提供
 */
export function Br() {
  return <br />;
}

/**
 * 複数行の改行コンポーネント
 * より柔軟な改行制御を提供
 */
interface LineBreakProps {
  count?: number;
  height?: string;
  className?: string;
}

export function LineBreak({ count = 1, height, className }: LineBreakProps) {
  // カスタム高さが指定されている場合
  if (height) {
    return (
      <div 
        style={{ height }} 
        className={`block ${className || ''}`}
        role="presentation"
        aria-hidden="true"
      />
    );
  }
  
  // 複数のbrタグを生成
  return (
    <>
      {Array.from({ length: Math.max(1, count) }, (_, i) => (
        <br key={`br-${i}`} />
      ))}
    </>
  );
}

/**
 * スペーサーコンポーネント（より明示的な空白）
 * 改善版：レスポンシブデザインとアクセシビリティ対応
 */
interface SpacerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  height?: string;
  className?: string;
  responsive?: boolean; // レスポンシブ対応フラグ
}

export function Spacer({ 
  size = 'md', 
  height, 
  className = '', 
  responsive = false 
}: SpacerProps) {
  // カスタム高さが指定されている場合
  if (height) {
    return (
      <div 
        style={{ height }} 
        className={`block ${className}`}
        role="presentation"
        aria-hidden="true"
      />
    );
  }

  // サイズクラスのマッピング（レスポンシブ対応）
  const getSizeClasses = () => {
    const baseSizes = {
      xs: 'h-1',    // 4px
      sm: 'h-2',    // 8px
      md: 'h-4',    // 16px
      lg: 'h-8',    // 32px
      xl: 'h-16',   // 64px
      '2xl': 'h-24' // 96px
    };
    
    if (!responsive) {
      return baseSizes[size];
    }
    
    // レスポンシブデザイン：モバイルでは小さく、デスクトップでは大きく
    const responsiveSizes = {
      xs: 'h-0.5 sm:h-1',
      sm: 'h-1 sm:h-2', 
      md: 'h-2 sm:h-4',
      lg: 'h-4 sm:h-8',
      xl: 'h-8 sm:h-16',
      '2xl': 'h-12 sm:h-24'
    };
    
    return responsiveSizes[size];
  };

  return (
    <div 
      className={`block ${getSizeClasses()} ${className}`}
      role="presentation"
      aria-hidden="true"
    />
  );
}

/**
 * 段落区切りコンポーネント
 * 改善版：段落間の標準的な空白を提供
 */
interface ParagraphBreakProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ParagraphBreak({ size = 'md', className = '' }: ParagraphBreakProps) {
  const sizeClasses = {
    sm: 'h-4',  // 16px - コンパクトな段落区切り
    md: 'h-6',  // 24px - 標準的な段落区切り
    lg: 'h-8'   // 32px - 大きな段落区切り
  };
  
  return (
    <div 
      className={`block ${sizeClasses[size]} ${className}`}
      role="presentation"
      aria-hidden="true"
    />
  );
}

// デフォルトエクスポート（下位互換性を保つ）
export default Br;

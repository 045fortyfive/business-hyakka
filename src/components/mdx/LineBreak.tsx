/**
 * 改行用のカスタムコンポーネント
 */

import React from 'react';

/**
 * シンプルな改行コンポーネント
 */
export function Br() {
  return <br />;
}

/**
 * 複数行の改行コンポーネント
 */
interface LineBreakProps {
  count?: number;
  height?: string;
}

export function LineBreak({ count = 1, height }: LineBreakProps) {
  if (height) {
    return <div style={{ height }} />;
  }
  
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <br key={i} />
      ))}
    </>
  );
}

/**
 * スペーサーコンポーネント（より明示的な空白）
 */
interface SpacerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  height?: string;
  className?: string;
}

export function Spacer({ size = 'md', height, className = '' }: SpacerProps) {
  if (height) {
    return <div style={{ height }} className={className} />;
  }

  const sizeClasses = {
    sm: 'h-2',   // 8px
    md: 'h-4',   // 16px
    lg: 'h-8',   // 32px
    xl: 'h-16',  // 64px
  };

  return <div className={`${sizeClasses[size]} ${className}`} />;
}

/**
 * 段落区切りコンポーネント
 */
export function ParagraphBreak() {
  return <div className="h-6" />; // 24px の空白
}

export default Br;

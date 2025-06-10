import React from 'react';
import { generateHeadingId as generateId } from '@/utils/heading-id';

// 見出しテキストからIDを生成する関数
function generateHeadingId(children: React.ReactNode): string {
  const text = React.Children.toArray(children)
    .filter((child): child is string => typeof child === 'string')
    .join('');
    
  return generateId(text);
}

interface HeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: React.ReactNode;
  className?: string;
}

export function Heading({ level, children, className = '' }: HeadingProps) {
  const id = generateHeadingId(children);
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  
  // レベルに応じたデフォルトスタイル
  const baseStyles = {
    1: 'text-3xl md:text-4xl font-bold mt-8 mb-6',
    2: 'text-2xl md:text-3xl font-bold mt-8 mb-4',
    3: 'text-xl md:text-2xl font-semibold mt-6 mb-3',
    4: 'text-lg md:text-xl font-semibold mt-5 mb-3',
    5: 'text-base md:text-lg font-semibold mt-4 mb-2',
    6: 'text-sm md:text-base font-semibold mt-3 mb-2'
  };

  return (
    <Tag 
      id={id} 
      className={`${baseStyles[level]} ${className} scroll-mt-20`}
    >
      {children}
    </Tag>
  );
}

// 各レベルのHeadingコンポーネントを個別にエクスポート
export const H1 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Heading level={1} className={className}>{children}</Heading>
);

export const H2 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Heading level={2} className={className}>{children}</Heading>
);

export const H3 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Heading level={3} className={className}>{children}</Heading>
);

export const H4 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Heading level={4} className={className}>{children}</Heading>
);

export const H5 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Heading level={5} className={className}>{children}</Heading>
);

export const H6 = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  <Heading level={6} className={className}>{children}</Heading>
);

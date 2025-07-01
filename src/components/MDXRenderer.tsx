"use client";

import React, { useEffect, useState } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks'; // remark-breaksプラグインを有効化
import { generateHeadingId } from '@/utils/heading-utils';
import { enhanceLineBreaks } from '@/utils/linebreak-utils';

// MDXコンポーネント
import CodeBlock from './mdx/CodeBlock';
import Callout from './mdx/Callout';
import Figure from './mdx/Figure';
import Table from './mdx/Table';
import CustomImage from './mdx/CustomImage';
import MediaRenderer from './mdx/MediaRenderer';
import { Br, LineBreak, Spacer, ParagraphBreak } from './mdx/LineBreak';

// カスタムrehype-slugプラグイン
function customRehypeSlug() {
  return (tree: any) => {
    const existingIds: string[] = [];
    let index = 0;
    
    function visit(node: any) {
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName)) {
        const headingText = extractTextFromNode(node);
        if (headingText && !node.properties.id) {
          const id = generateHeadingId(headingText, index++, existingIds);
          existingIds.push(id);
          node.properties = node.properties || {};
          node.properties.id = id;
        }
      }
      
      if (node.children) {
        node.children.forEach(visit);
      }
    }
    
    visit(tree);
  };
}

// ノードからテキストを抽出するヘルパー関数
function extractTextFromNode(node: any): string {
  if (node.type === 'text') {
    return node.value || '';
  }
  
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(extractTextFromNode).join('');
  }
  
  return '';
}

// カスタムスタイリングコンポーネント
const CustomIns = ({ children, ...props }: any) => {
  // 安全性チェック
  if (children === null || children === undefined) {
    return null;
  }

  return (
    <ins className="underline decoration-2 decoration-blue-500 bg-blue-50 px-1 rounded" {...props}>
      {children}
    </ins>
  );
};

const RedText = ({ children, ...props }: any) => {
  // 安全性チェック
  if (children === null || children === undefined) {
    return null;
  }

  return (
    <span className="text-red-600 font-medium" {...props}>
      {children}
    </span>
  );
};

const YellowHighlight = ({ children, ...props }: any) => {
  // 安全性チェック
  if (children === null || children === undefined) {
    return null;
  }

  return (
    <mark className="bg-yellow-200 px-1 rounded" {...props}>
      {children}
    </mark>
  );
};

// MDXで使用するコンポーネント
const components = {
  CodeBlock,
  Callout,
  Figure,
  Table,
  CustomImage,
  MediaRenderer,
  // 改行関連コンポーネント
  Br,
  LineBreak,
  Spacer,
  ParagraphBreak,
  // テーブル関連のコンポーネント
  table: (props: any) => <Table {...props} />,
  // 画像・メディアコンポーネント
  img: (props: any) => <MediaRenderer {...props} />,
  Image: (props: any) => <MediaRenderer {...props} />,
  // カスタムスタイリングコンポーネント
  ins: CustomIns,
  RedText,
  YellowHighlight,
  // その他のカスタムコンポーネント
};

interface MDXRendererProps {
  content: string;
}

export default function MDXRenderer({ content }: MDXRendererProps) {
  const [mdxSource, setMdxSource] = useState<MDXRemoteSerializeResult | null>(null);

  useEffect(() => {
    const prepareMDX = async () => {
      if (!content) return;

      try {
        // 改行処理を適用（remark-breaksと協調）
        const processedContent = enhanceLineBreaks(content);

        // remarkプラグインの設定（remark-breaksを有効化）
        const remarkPlugins = [
          remarkGfm,
          remarkBreaks // remark-breaksプラグインを追加
        ];

        const mdxSource = await serialize(processedContent, {
          mdxOptions: {
            remarkPlugins,
            rehypePlugins: [customRehypeSlug, rehypeHighlight],
          },
        });

        setMdxSource(mdxSource);
      } catch (error) {
        console.error('MDXコンパイルエラー:', error);
        // エラーが発生した場合は、フォールバック処理
        const fallbackMdxSource = await serialize(content, {
          mdxOptions: {
            remarkPlugins: [remarkGfm], // 最低限のプラグインで再試行
            rehypePlugins: [customRehypeSlug, rehypeHighlight],
          },
        });
        setMdxSource(fallbackMdxSource);
      }
    };

    prepareMDX();
  }, [content]);

  if (!mdxSource) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="prose prose-lg max-w-none">
      <style jsx>{`
        .prose br {
          display: block;
          margin-bottom: 0.5rem;
        }
        .prose p {
          margin-top: 1rem;
          margin-bottom: 1.5rem;
          line-height: 1.8;
        }
        .prose ins {
          text-decoration: underline;
          text-decoration-color: #3b82f6;
          text-decoration-thickness: 2px;
          background-color: #eff6ff;
          padding: 0 0.25rem;
          border-radius: 0.25rem;
        }
        .prose mark {
          background-color: #fef08a;
          padding: 0 0.25rem;
          border-radius: 0.25rem;
        }
        .prose .text-red-600 {
          color: #dc2626;
          font-weight: 500;
        }
      `}</style>
      <MDXRemote {...mdxSource} components={components} />
    </div>
  );
}

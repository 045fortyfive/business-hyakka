"use client";

import React, { useEffect, useState } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import { generateHeadingId } from '@/utils/heading-utils';

// MDXコンポーネント
import CodeBlock from './mdx/CodeBlock';
import Callout from './mdx/Callout';
import Figure from './mdx/Figure';
import Table from './mdx/Table';
import CustomImage from './mdx/CustomImage';

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

// MDXで使用するコンポーネント
const components = {
  CodeBlock,
  Callout,
  Figure,
  Table,
  CustomImage,
  // テーブル関連のコンポーネント
  table: Table,
  // 画像コンポーネント
  img: CustomImage,
  Image: CustomImage,
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

      const mdxSource = await serialize(content, {
        mdxOptions: {
          remarkPlugins: [remarkGfm],
          rehypePlugins: [customRehypeSlug, rehypeHighlight],
        },
      });

      setMdxSource(mdxSource);
    };

    prepareMDX();
  }, [content]);

  if (!mdxSource) {
    return <div>Loading...</div>;
  }

  return (
    <div className="prose prose-lg max-w-none">
      <MDXRemote {...mdxSource} components={components} />
    </div>
  );
}

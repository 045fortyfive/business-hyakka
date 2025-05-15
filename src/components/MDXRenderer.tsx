"use client";

import React, { useEffect, useState } from 'react';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { serialize } from 'next-mdx-remote/serialize';
import rehypeHighlight from 'rehype-highlight';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';

// MDXコンポーネント
import CodeBlock from './mdx/CodeBlock';
import Callout from './mdx/Callout';
import Figure from './mdx/Figure';
import Table from './mdx/Table';

// MDXで使用するコンポーネント
const components = {
  CodeBlock,
  Callout,
  Figure,
  Table,
  // テーブル関連のコンポーネント
  table: Table,
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
          rehypePlugins: [rehypeSlug, rehypeHighlight],
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

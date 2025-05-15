# MDX実装ガイド

このガイドでは、ビジネススキル百科にMDXを導入するための手順を説明します。MDXを使用することで、マークダウンの簡潔さとReactコンポーネントの柔軟性を組み合わせた記事を作成できます。

## 目次

1. [MDXとは](#mdxとは)
2. [必要なパッケージのインストール](#必要なパッケージのインストール)
3. [基本的なMDXコンポーネントの作成](#基本的なmdxコンポーネントの作成)
4. [Contentfulとの統合](#contentfulとの統合)
5. [MDXレンダリングコンポーネントの実装](#mdxレンダリングコンポーネントの実装)
6. [記事ページの更新](#記事ページの更新)
7. [カスタムコンポーネントの追加](#カスタムコンポーネントの追加)
8. [スタイリングの適用](#スタイリングの適用)
9. [テストと最適化](#テストと最適化)

## MDXとは

MDX（Markdown for the component era）は、マークダウンとJSXを組み合わせたフォーマットです。マークダウンの簡潔さとReactコンポーネントの柔軟性を兼ね備えています。

MDXを使用すると、以下のようなことが可能になります：

- マークダウン内でReactコンポーネントを使用する
- 動的なコンテンツを含める
- 複雑なレイアウトやインタラクティブな要素を追加する

## 必要なパッケージのインストール

まず、必要なパッケージをインストールします：

```bash
npm install next-mdx-remote gray-matter rehype-highlight rehype-slug remark-gfm
```

各パッケージの役割：

- `next-mdx-remote`: Next.jsでMDXをレンダリングするためのライブラリ
- `gray-matter`: フロントマターを解析するためのライブラリ
- `rehype-highlight`: コードのシンタックスハイライトを適用するプラグイン
- `rehype-slug`: 見出しに自動的にIDを付与するプラグイン
- `remark-gfm`: GitHub Flavored Markdownをサポートするプラグイン

## 基本的なMDXコンポーネントの作成

まず、基本的なMDXコンポーネントを作成します。これらのコンポーネントは、MDX内で使用されます。

### 1. CodeBlockコンポーネント

```tsx
// src/components/mdx/CodeBlock.tsx
import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
  language: string;
  children: string;
}

export default function CodeBlock({ language, children }: CodeBlockProps) {
  return (
    <div className="my-6">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        className="rounded-lg overflow-hidden"
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}
```

### 2. Calloutコンポーネント

```tsx
// src/components/mdx/Callout.tsx
import React from 'react';

interface CalloutProps {
  type: 'info' | 'warning' | 'tip' | 'note';
  children: React.ReactNode;
}

export default function Callout({ type, children }: CalloutProps) {
  const styles = {
    info: 'bg-blue-50 border-blue-500 text-blue-800',
    warning: 'bg-yellow-50 border-yellow-500 text-yellow-800',
    tip: 'bg-green-50 border-green-500 text-green-800',
    note: 'bg-gray-50 border-gray-500 text-gray-800',
  };

  const icons = {
    info: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 102 0V7zm-1-5a1 1 0 100 2 1 1 0 000-2z"
          clipRule="evenodd"
        />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
          clipRule="evenodd"
        />
      </svg>
    ),
    tip: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
    note: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path
          fillRule="evenodd"
          d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1.581.814L10 13.197l-4.419 2.617A1 1 0 014 15V4zm2-1a1 1 0 00-1 1v10.566l3.419-2.021a1 1 0 011.162 0L13 14.566V4a1 1 0 00-1-1H6z"
          clipRule="evenodd"
        />
      </svg>
    ),
  };

  return (
    <div
      className={`p-4 my-6 border-l-4 rounded-r-lg flex items-start ${styles[type]}`}
    >
      <div className="flex items-center">
        {icons[type]}
      </div>
      <div>{children}</div>
    </div>
  );
}
```

### 3. Figureコンポーネント

```tsx
// src/components/mdx/Figure.tsx
import React from 'react';
import Image from 'next/image';

interface FigureProps {
  src: string;
  alt: string;
  caption?: string;
  width?: number;
  height?: number;
}

export default function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 630,
}: FigureProps) {
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-lg shadow-md">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full"
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-gray-500 mt-3">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
```

### 4. Tableコンポーネント

```tsx
// src/components/mdx/Table.tsx
import React from 'react';

interface TableProps {
  children: React.ReactNode;
}

export default function Table({ children }: TableProps) {
  return (
    <div className="my-6 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg">
        {children}
      </table>
    </div>
  );
}
```

## Contentfulとの統合

Contentfulでロングテキストフィールドを使用してMDXコンテンツを保存します。

### 1. Contentfulのコンテンツモデルを更新

Contentfulのコンテンツモデル（Content）に以下のフィールドを追加または更新します：

- `mdxContent`: ロングテキストフィールド（Markdown）- MDXコンテンツを保存

### 2. MDX取得用のAPIクライアントを更新

```typescript
// src/lib/contentful.ts

// 既存のコードに追加
export async function getArticleBySlug(slug: string) {
  const entries = await client.getEntries({
    content_type: 'content',
    'fields.slug': slug,
    include: 2,
  });

  if (!entries.items.length) {
    return null;
  }

  const article = entries.items[0];
  
  // MDXコンテンツを取得（存在する場合）
  const mdxContent = article.fields.mdxContent || '';
  
  return {
    ...article,
    fields: {
      ...article.fields,
      mdxContent,
    },
  };
}
```

## MDXレンダリングコンポーネントの実装

MDXをレンダリングするためのコンポーネントを作成します。

```tsx
// src/components/MDXRenderer.tsx
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
```

## 記事ページの更新

記事ページを更新して、MDXレンダリングを追加します。

```tsx
// src/app/articles/[slug]/page.tsx

// 既存のimportに追加
import MDXRenderer from '@/components/MDXRenderer';

// getArticleData関数内で
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  // ...既存のコード
}

export default async function ArticlePage({ params }: Props) {
  const article = await getArticleBySlug(params.slug);
  
  // ...既存のコード
  
  // MDXコンテンツがある場合はMDXRendererを使用、なければRichTextRendererを使用
  const hasMDXContent = article.fields.mdxContent && article.fields.mdxContent.trim().length > 0;
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* ...既存のコード（ヘッダー部分など） */}
      
      {/* 2カラムレイアウト */}
      <div className="flex flex-col md:flex-row gap-8">
        {/* メインコンテンツ - 左カラム */}
        <div className="md:w-3/4">
          <article className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            {/* 記事本文 */}
            {hasMDXContent ? (
              <MDXRenderer content={article.fields.mdxContent} />
            ) : (
              <div className="prose prose-base md:prose-lg max-w-none">
                <RichTextRenderer
                  content={body}
                  assets={linkedAssets}
                  entries={linkedEntries}
                />
              </div>
            )}
            
            {/* ...既存のコード（埋め込み動画、音声、タグなど） */}
          </article>
        </div>
        
        {/* サイドバー - 右カラム（PCのみ表示） */}
        <div className="hidden md:block md:w-1/4">
          {hasMDXContent ? (
            <TableOfContentsFromMDX content={article.fields.mdxContent} />
          ) : (
            <TableOfContents content={body} />
          )}
        </div>
      </div>
    </div>
  );
}
```

## カスタムコンポーネントの追加

必要に応じて、追加のカスタムコンポーネントを作成します。

### TableOfContentsFromMDXコンポーネント

```tsx
// src/components/TableOfContentsFromMDX.tsx
import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
  children: TocItem[];
}

interface TableOfContentsFromMDXProps {
  content: string;
}

export default function TableOfContentsFromMDX({ content }: TableOfContentsFromMDXProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  useEffect(() => {
    // MDXから見出しを抽出
    const headingRegex = /^(#{1,6})\s+(.+)$/gm;
    const headings: { level: number; text: string; id: string }[] = [];
    
    let match;
    while ((match = headingRegex.exec(content)) !== null) {
      const level = match[1].length;
      const text = match[2].trim();
      const id = text
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-');
      
      headings.push({ level, text, id });
    }
    
    // 階層構造を構築
    const tocItems: TocItem[] = [];
    const stack: TocItem[] = [];
    
    headings.forEach((heading) => {
      const item: TocItem = {
        id: heading.id,
        text: heading.text,
        level: heading.level,
        children: [],
      };
      
      if (stack.length === 0) {
        tocItems.push(item);
        stack.push(item);
        return;
      }
      
      while (
        stack.length > 0 &&
        stack[stack.length - 1].level >= heading.level
      ) {
        stack.pop();
      }
      
      if (stack.length === 0) {
        tocItems.push(item);
      } else {
        stack[stack.length - 1].children.push(item);
      }
      
      stack.push(item);
    });
    
    setToc(tocItems);
  }, [content]);

  // 以下は既存のTableOfContentsコンポーネントと同様の実装
  // ...

  return (
    <div className="sticky top-4">
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">目次</h2>
        <nav className="toc">{/* renderTocItems関数を使用 */}</nav>
      </div>
    </div>
  );
}
```

## スタイリングの適用

TailwindCSSの設定を更新して、MDXコンテンツのスタイリングを改善します。

```js
// tailwind.config.js
module.exports = {
  // ...既存の設定
  theme: {
    extend: {
      // ...既存の拡張
      typography: {
        DEFAULT: {
          css: {
            h1: {
              fontWeight: '700',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '0.5rem',
              marginTop: '2rem',
            },
            h2: {
              fontWeight: '700',
              borderBottom: '1px solid #e5e7eb',
              paddingBottom: '0.25rem',
              marginTop: '1.75rem',
            },
            h3: {
              fontWeight: '600',
              marginTop: '1.5rem',
            },
            // その他のスタイル
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    // ...その他のプラグイン
  ],
};
```

## テストと最適化

MDX実装をテストし、必要に応じて最適化します。

1. テスト記事の作成
2. パフォーマンスの確認
3. アクセシビリティの確認
4. モバイル表示の確認
5. SEO対策の確認

## まとめ

このガイドに従って実装することで、ビジネススキル百科にMDXを導入し、より柔軟で表現力豊かな記事を作成できるようになります。MDXを使用することで、マークダウンの簡潔さとReactコンポーネントの柔軟性を組み合わせた記事を効率的に作成・管理できます。

import { Metadata } from 'next';
import { getMdxBySlug } from '@/utils/mdx-utils';
import MDXRenderer from '@/components/MDXRenderer';
import Link from 'next/link';
import TableOfContents from '@/components/TableOfContents';
import { extractTocFromMdx } from '@/utils/toc-generator';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = params;
  const { frontMatter, content } = getMdxBySlug(slug);
  
  // タイトルを抽出（最初の見出しを使用）
  const titleMatch = content.match(/^# (.+)$/m);
  const title = titleMatch ? titleMatch[1] : slug;
  
  return {
    title: `${title} | ビジネススキル百科`,
    description: frontMatter.description || `${title}に関する記事`,
  };
}

export default function MdxArticlePage({ params }: Props) {
  const { slug } = params;
  const { content } = getMdxBySlug(slug);
  
  // 記事の内容からTOCを生成
  const toc = extractTocFromMdx(content);
  
  // カテゴリーに応じたグラデーションクラスを設定
  const gradientClass = 'from-blue-400 via-sky-500 to-indigo-600';
  
  return (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl">
      {/* パンくずリスト - モバイルとPC共通 */}
      <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
        <Link href="/" className="hover:text-blue-600">
          ホーム
        </Link>
        <span className="mx-2">&gt;</span>
        <Link href="/articles" className="hover:text-blue-600">
          記事一覧
        </Link>
      </div>

      {/* モバイル用目次（折りたたみ可能） */}
      <div className="md:hidden mb-6">
        <details className="bg-white rounded-lg shadow-sm p-4">
          <summary className="text-lg font-bold cursor-pointer">目次</summary>
          <div className="mt-3">
            <TableOfContents content={toc} />
          </div>
        </details>
      </div>

      {/* 2カラムレイアウト */}
      <div className="flex flex-col md:flex-row gap-6 md:gap-8">
        {/* メインコンテンツ - 左カラム */}
        <div className="md:w-3/4">
          <article className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            {/* 記事本文 */}
            <div className="prose prose-base md:prose-lg max-w-none">
              <MDXRenderer content={content} />
            </div>
          </article>
        </div>

        {/* サイドバー - 右カラム（PCのみ表示） */}
        <div className="hidden md:block md:w-1/4">
          <TableOfContents content={toc} />
        </div>
      </div>
    </div>
  );
}

// 静的ページ生成のためのパスを取得
export async function generateStaticParams() {
  // 実際の実装では、getAllMdxSlugs()を使用してすべてのスラッグを取得
  // ここでは簡略化のため、手動で設定
  return [
    { slug: 'ai-skills' },
  ];
}

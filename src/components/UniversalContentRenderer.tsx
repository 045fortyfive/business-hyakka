import React from 'react';
import Link from 'next/link';
import EnhancedTableOfContents from '@/components/EnhancedTableOfContents';
import RelatedContents from '@/components/RelatedContents';
import DownloadSection from '@/components/DownloadSection';
import ContentfulRichText from '@/components/ContentfulRichText';
import CustomImage from '@/components/mdx/CustomImage';
import VideoPlayer from '@/components/VideoPlayer';
import AudioPlayer from '@/components/AudioPlayer';
import { PreviewWrapper, PreviewMeta } from '@/components/preview';
import { extractTocFromMdx } from '@/utils/toc-generator';

interface UniversalContentRendererProps {
  slug: string;
  frontMatter: {
    title: string;
    description?: string;
    category?: string;
    tags?: string[];
    author?: string;
    publishDate?: string;
    videoUrl?: string;
    audioUrl?: string;
    featuredImage?: {
      url: string;
      title?: string;
      width?: number;
      height?: number;
    };
  };
  content?: string;
  mdxContent?: React.ReactElement | null;
  relatedContents?: any[];
  downloadableFiles?: Array<{url: string, title: string, filename: string}>;
  contentType?: string;
  // Preview関連のプロパティを追加
  contentfulEntryId?: string;
  lastModified?: string;
  version?: number;
}

// エラー境界コンポーネント
interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  sectionName?: string;
}

function SafeSection({ children, fallback, sectionName }: ErrorBoundaryProps) {
  try {
    return <>{children}</>;
  } catch (error) {
    console.error(`Error in ${sectionName}:`, error);
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-700">
          {sectionName && `${sectionName}の`}表示中にエラーが発生しました。
        </p>
        {fallback}
      </div>
    );
  }
}

export default function UniversalContentRenderer({
  slug,
  frontMatter,
  content,
  mdxContent,
  relatedContents = [],
  downloadableFiles = [],
  contentType = 'article',
  contentfulEntryId,
  lastModified,
  version
}: UniversalContentRendererProps) {
  // 目次の生成（MDXコンテンツがある場合）
  const toc = content ? extractTocFromMdx(content) : [];

  // カテゴリーに応じたグラデーションクラス
  const gradientClass = 'from-blue-400 via-sky-500 to-indigo-600';

  const mainContent = (
    <div className="container mx-auto px-4 py-6 md:py-8 max-w-7xl flex justify-center">
      <div className="w-full max-w-[800px]">
        
        {/* パンくずリスト */}
        <SafeSection sectionName="パンくずリスト">
          <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">
              ホーム
            </Link>
            <span className="mx-2">&gt;</span>
            <Link 
              href={`/${contentType === 'article' ? 'articles' : contentType === 'video' ? 'videos' : 'audios'}`} 
              className="hover:text-blue-600"
            >
              {contentType === 'article' ? '記事一覧' : contentType === 'video' ? '動画一覧' : '音声一覧'}
            </Link>
            <span className="mx-2">&gt;</span>
            <span className="text-gray-700">{frontMatter.title}</span>
          </div>
        </SafeSection>

        {/* アイキャッチ画像 */}
        {frontMatter.featuredImage && (
          <SafeSection sectionName="アイキャッチ画像">
            <div className="mb-6">
              <CustomImage
                src={frontMatter.featuredImage.url}
                alt={frontMatter.featuredImage.title || frontMatter.title}
                title={frontMatter.featuredImage.title}
                width={800}
                height={450}
                fill={false}
                priority={true}
                responsive={true}
                className="w-full aspect-video object-cover"
                quality={85}
              />
            </div>
          </SafeSection>
        )}

        {/* 記事ヘッダー */}
        <SafeSection sectionName="ヘッダー">
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-3">
              {frontMatter.title}
            </h1>
            {frontMatter.description && (
              <p className="text-base md:text-lg text-gray-600 mb-3">
                {frontMatter.description}
              </p>
            )}
            <div className="flex flex-wrap items-center text-sm text-gray-600">
              {frontMatter.category && (
                <span className={`px-3 py-1 rounded-full text-white bg-gradient-to-r ${gradientClass} mr-3 mb-2`}>
                  {frontMatter.category}
                </span>
              )}
              {frontMatter.publishDate && (
                <span className="mr-4 mb-2">
                  公開日: {new Date(frontMatter.publishDate).toLocaleDateString('ja-JP')}
                </span>
              )}
              {frontMatter.author && (
                <span className="mb-2">
                  著者: {frontMatter.author}
                </span>
              )}
            </div>
          </header>
        </SafeSection>

        {/* メイン動画プレイヤー */}
        {frontMatter.videoUrl && (
          <SafeSection 
            sectionName="動画プレイヤー"
            fallback={
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-600">動画を読み込めませんでした</p>
              </div>
            }
          >
            <div className="mb-6">
              <VideoPlayer 
                src={frontMatter.videoUrl}
                title={frontMatter.title}
                className="w-full"
              />
            </div>
          </SafeSection>
        )}

        {/* メイン音声プレイヤー */}
        {frontMatter.audioUrl && (
          <SafeSection 
            sectionName="音声プレイヤー"
            fallback={
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-600">音声を読み込めませんでした</p>
              </div>
            }
          >
            <div className="mb-6">
              <AudioPlayer 
                src={frontMatter.audioUrl}
                title={frontMatter.title}
                className="w-full"
              />
            </div>
          </SafeSection>
        )}

        {/* 目次 */}
        {toc.length > 0 && (
          <SafeSection sectionName="目次">
            <div className="mb-6">
              <EnhancedTableOfContents
                toc={toc}
                type="main"
                enableDynamicToc={true}
              />
            </div>
          </SafeSection>
        )}

        {/* 記事本文・MDXコンテンツ */}
        <SafeSection 
          sectionName="記事本文"
          fallback={
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <p className="text-yellow-700">コンテンツの表示でエラーが発生しました。</p>
            </div>
          }
        >
          <article className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
            {mdxContent ? (
              // ContentfulのMDXコンテンツを表示
              <div className="prose prose-base md:prose-lg max-w-none">
                {mdxContent}
              </div>
            ) : content ? (
              // Contentfulのリッチテキストコンテンツを表示
              <ContentfulRichText content={content} />
            ) : (
              <div className="text-gray-500 text-center py-8">
                <p>コンテンツがありません</p>
              </div>
            )}
          </article>
        </SafeSection>

        {/* ダウンロードファイル */}
        {downloadableFiles && downloadableFiles.length > 0 && (
          <SafeSection 
            sectionName="ダウンロード"
            fallback={
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-gray-600">ダウンロードファイルの表示でエラーが発生しました。</p>
              </div>
            }
          >
            <DownloadSection files={downloadableFiles} />
          </SafeSection>
        )}

        {/* 関連コンテンツ */}
        {relatedContents && relatedContents.length > 0 && (
          <SafeSection 
            sectionName="関連コンテンツ"
            fallback={
              <div className="bg-gray-100 rounded-lg p-4">
                <p className="text-gray-600">関連コンテンツの表示でエラーが発生しました。</p>
              </div>
            }
          >
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">関連コンテンツ</h2>
              <RelatedContents contents={relatedContents} />
            </div>
          </SafeSection>
        )}
      </div>
    </div>
  );

  return (
    <PreviewWrapper
      contentType={contentType}
      slug={slug}
      title={frontMatter.title}
      contentfulEntryId={contentfulEntryId}
    >
      {mainContent}
      
      {/* プレビューメタ情報（開発・編集者向け） */}
      <PreviewMeta
        data={{
          entryId: contentfulEntryId,
          contentType,
          slug,
          lastModified,
          version
        }}
      />
    </PreviewWrapper>
  );
}

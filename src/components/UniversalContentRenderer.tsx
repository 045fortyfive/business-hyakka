import React from 'react';
import Link from 'next/link';
import EnhancedTableOfContents from '@/components/EnhancedTableOfContents';
import MdxTableOfContents from '@/components/MdxTableOfContents';
import RelatedContents from '@/components/RelatedContents';
import DownloadSection from '@/components/DownloadSection';
import ContentfulRichText from '@/components/ContentfulRichText';
import MDXRenderer from '@/components/MDXRenderer';
import CustomImage from '@/components/mdx/CustomImage';
import VideoPlayer from '@/components/VideoPlayer';
import AudioPlayer from '@/components/AudioPlayer';
import { PreviewWrapper, PreviewMeta } from '@/components/preview';
import { extractTocFromMdx } from '@/utils/toc-generator';
import { generateUnsplashImageUrl, normalizeImageUrl } from '@/utils/image-utils';

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
  tocItems?: Array<{id: string, title: string, level: number, children?: any[]}>;
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
  tocItems = [],
  relatedContents = [],
  downloadableFiles = [],
  contentType = 'article',
  contentfulEntryId,
  lastModified,
  version
}: UniversalContentRendererProps) {
  // 目次の生成（MDXコンテンツがある場合）
  const toc = content ? extractTocFromMdx(content) : [];
  
  // デバッグログを追加
  console.log('UniversalContentRenderer - Debug info:', {
    hasTocItems: tocItems.length > 0,
    tocItemsCount: tocItems.length,
    hasToc: toc.length > 0,
    tocCount: toc.length,
    hasContent: !!content,
    hasMdxContent: !!mdxContent,
    contentType
  });

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
        <SafeSection sectionName="アイキャッチ画像">
          <div className="mb-6">
            {frontMatter.featuredImage ? (
              <CustomImage
                src={normalizeImageUrl(frontMatter.featuredImage.url) || ''}
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
            ) : (
              <div className="w-full aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center relative overflow-hidden">
                {/* 背景パターン */}
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234F46E5' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                    backgroundSize: '30px 30px'
                  }} />
                </div>

                {/* コンテンツ */}
                <div className="text-center z-10 px-6">
                  <div className="w-16 h-16 mx-auto mb-4 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    {frontMatter.category || 'ビジネス'}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {frontMatter.title.length > 50 ? `${frontMatter.title.substring(0, 50)}...` : frontMatter.title}
                  </p>
                </div>
              </div>
            )}
          </div>
        </SafeSection>

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
        {(() => {
          console.log('UniversalContentRenderer: Checking video URL:', {
            hasVideoUrl: !!frontMatter.videoUrl,
            videoUrl: frontMatter.videoUrl,
            contentType
          });
          return frontMatter.videoUrl;
        })() && (
          <SafeSection
            sectionName="動画プレイヤー"
            fallback={
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <p className="text-gray-600">動画を読み込めませんでした</p>
              </div>
            }
          >
            <div className="mb-6">
              {(() => {
                console.log('UniversalContentRenderer: Rendering VideoPlayer with props:', {
                  videoUrl: frontMatter.videoUrl,
                  title: frontMatter.title,
                  className: "w-full"
                });
                return null;
              })()}
              <VideoPlayer
                videoUrl={frontMatter.videoUrl}
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
        {(tocItems.length > 0 || toc.length > 0) && (
          <SafeSection sectionName="目次">
            <div className="mb-6">
              {tocItems.length > 0 ? (
                // MDX目次を表示
                <MdxTableOfContents tocItems={tocItems} />
              ) : (
                // Contentful Rich Text目次を表示
                <EnhancedTableOfContents
                  toc={toc}
                  type="main"
                  enableDynamicToc={true}
                />
              )}
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
              // Contentfulのリッチテキストコンテンツまたはプレーンテキストを表示
              typeof content === 'string' && content.includes('#') ? (
                // MDXライクなコンテンツの場合はMDXRendererを使用
                <MDXRenderer content={content} />
              ) : (
                // リッチテキストコンテンツの場合はContentfulRichTextを使用
                <ContentfulRichText content={content} />
              )
            ) : (
              <div className="text-gray-500 text-center py-8">
                <p>コンテンツがありません</p>
                <p className="text-sm mt-2">デバッグ情報: mdxContent={mdxContent ? 'あり' : 'なし'}, content={content ? 'あり' : 'なし'}</p>
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

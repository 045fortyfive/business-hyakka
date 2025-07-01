import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getMdxBySlug, renderContentfulMdx } from '@/utils/mdx-utils';
import UniversalContentRenderer from '@/components/UniversalContentRenderer';
import { PreviewWrapper } from '@/components/preview';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // paramsを非同期で解決
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  try {
    // まずContentfulからコンテンツを取得
    const contentfulData = await renderContentfulMdx(slug);

    // タイトルを取得（frontMatterから直接取得）
    const title = contentfulData.frontMatter.title || 'タイトルなし';
    const description = contentfulData.frontMatter.description || `${title}に関する記事`;

    return {
      title: `${title} | ビジネススキル百科`,
      description,
      openGraph: {
        title: `${title} | ビジネススキル百科`,
        description,
        images: contentfulData.frontMatter.featuredImage ? [
          {
            url: contentfulData.frontMatter.featuredImage.url,
            width: contentfulData.frontMatter.featuredImage.width,
            height: contentfulData.frontMatter.featuredImage.height,
            alt: contentfulData.frontMatter.featuredImage.title || title,
          }
        ] : [],
      },
    };
  } catch (error) {
    console.error(`Error generating metadata for ${slug}:`, error);

    // Contentfulからの取得に失敗した場合はファイルシステムから取得
    try {
      const { frontMatter, content } = getMdxBySlug(slug);

      // タイトルを抽出（最初の見出しを使用）
      const titleMatch = content.match(/^# (.+)$/m);
      const title = titleMatch ? titleMatch[1] : frontMatter.title || slug;

      return {
        title: `${title} | ビジネススキル百科`,
        description: frontMatter.description || `${title}に関する記事`,
      };
    } catch (fallbackError) {
      console.error(`Fallback metadata generation failed for ${slug}:`, fallbackError);

      return {
        title: `${slug} | ビジネススキル百科`,
        description: `${slug}に関する記事`,
      };
    }
  }
}

export default async function MdxArticlePage({ params }: Props) {
  // paramsを非同期で解決
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  // 問題のある記事を一時的にスキップ
  const problematicSlugs = ['ichinichisekkeijyutu', 'jibunnonobashikata'];
  if (problematicSlugs.includes(slug)) {
    console.warn(`Redirecting problematic article: ${slug}`);
    notFound();
  }

  try {
    // Contentfulからコンテンツを取得
    console.log(`Rendering article: ${slug}`);
    const contentData = await renderContentfulMdx(slug);
    console.log(`Successfully rendered article: ${slug}`);

    return (
      <PreviewWrapper
        contentType="article"
        slug={slug}
        title={contentData.frontMatter.title}
        contentfulEntryId={contentData.contentfulEntryId}
        lastModified={contentData.lastModified}
        showMeta={false}
      >
        <UniversalContentRenderer
          slug={slug}
          frontMatter={contentData.frontMatter}
          content={contentData.content}
          mdxContent={contentData.mdxContent}
          tocItems={contentData.tocItems} // 目次アイテムを追加
          relatedContents={contentData.relatedContents}
          downloadableFiles={contentData.downloadableFiles}
          contentType="article"
        />
      </PreviewWrapper>
    );
  } catch (error) {
    console.error(`Error rendering article ${slug}:`, error);
    
    // フォールバック：ファイルシステムから取得
    try {
      const { frontMatter, content } = getMdxBySlug(slug);

      return (
        <PreviewWrapper
          contentType="article"
          slug={slug}
          title={frontMatter.title || slug}
          showMeta={false}
        >
          <UniversalContentRenderer
            slug={slug}
            frontMatter={{
              title: frontMatter.title || slug,
              description: frontMatter.description,
              category: frontMatter.category,
              author: frontMatter.author,
              publishDate: frontMatter.publishDate,
              featuredImage: frontMatter.featuredImage,
            }}
            content={content}
            mdxContent={null}
            relatedContents={[]}
            downloadableFiles={[]}
            contentType="article"
          />
        </PreviewWrapper>
      );
    } catch (fallbackError) {
      console.error(`Fallback failed for ${slug}:`, fallbackError);
      
      // 最終フォールバック：エラーページ
      return (
        <PreviewWrapper
          contentType="article"
          slug={slug}
          title="エラーが発生しました"
          showMeta={false}
        >
          <UniversalContentRenderer
            slug={slug}
            frontMatter={{
              title: 'エラーが発生しました',
              description: 'コンテンツの読み込み中にエラーが発生しました。',
            }}
            content="# エラーが発生しました\n\nコンテンツの読み込み中にエラーが発生しました。[ホームに戻る](/)"
            mdxContent={null}
            relatedContents={[]}
            downloadableFiles={[]}
            contentType="article"
          />
        </PreviewWrapper>
      );
    }
  }
}

// 静的ページ生成のためのパスを取得
export async function generateStaticParams() {
  try {
    // Contentfulから記事を取得
    const { getClient } = await import('@/lib/api');
    const client = await getClient();

    const { CONTENT_TYPE } = await import('@/lib/contentful');
    const { CONTENT_TYPES } = await import('@/lib/types');

    const entries = await client.getEntries({
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.ARTICLE,
      select: ['fields.slug'],
      limit: 1000, // 十分な数を取得
    });

    // 問題のある記事を一時的にスキップ
    const problematicSlugs = ['ichinichisekkeijyutu', 'jibunnonobashikata'];

    // slugが有効な記事のみを返す
    const validArticles = entries.items.filter(
      (article: any) => {
        const hasValidSlug = article?.fields?.slug &&
                           typeof article.fields.slug === 'string' &&
                           article.fields.slug.trim() !== '';

        // 問題のある記事をスキップ
        if (problematicSlugs.includes(article.fields.slug)) {
          console.warn(`Skipping problematic article: ${article.fields.slug}`);
          return false;
        }

        if (!hasValidSlug) {
          console.warn(`Article "${article?.fields?.title || 'Unknown'}" has invalid slug: "${article?.fields?.slug}"`);
        }

        return hasValidSlug;
      }
    );

    console.log(`Generating static params for ${validArticles.length} valid articles out of ${entries.items.length} total`);

    return validArticles.map((article: any) => ({
      slug: article.fields.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for articles:', error);
    // エラーが発生した場合は空の配列を返す
    return [];
  }
}

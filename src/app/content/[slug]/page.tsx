import { notFound } from 'next/navigation';
import { getContentBySlug } from '@/lib/api';
import { renderContentfulMdx } from '@/utils/mdx-utils';
import UniversalContentRenderer from '@/components/UniversalContentRenderer';
import { getContentDisplayType } from '@/utils/content-type-utils';

interface ContentPageProps {
  params: {
    slug: string;
  };
}

export default async function ContentPage({ params }: ContentPageProps) {
  const { slug } = await params;

  try {
    // コンテンツを取得（コンテンツタイプに関係なく）
    const content = await getContentBySlug(slug);

    if (!content) {
      notFound();
    }

    // コンテンツタイプを判定
    const displayType = getContentDisplayType(content.fields.contentType);

    // MDXレンダリングを実行
    const contentData = await renderContentfulMdx(slug, displayType);

    return (
      <UniversalContentRenderer
        slug={slug}
        frontMatter={contentData.frontMatter}
        content={contentData.content}
        mdxContent={contentData.mdxContent}
        tocItems={contentData.tocItems}
        relatedContents={contentData.relatedContents}
        downloadableFiles={contentData.downloadableFiles}
        contentType={displayType}
        contentfulEntryId={contentData.contentfulEntryId}
        lastModified={contentData.lastModified}
        version={contentData.version}
      />
    );
  } catch (error) {
    console.error('Error fetching content:', error);
    notFound();
  }
}

// 静的生成のためのパラメータを生成
export async function generateStaticParams() {
  try {
    // 全てのコンテンツタイプから静的パラメータを生成
    const { getArticles, getVideos, getAudios } = await import('@/lib/api');

    const [articles, videos, audios] = await Promise.all([
      getArticles(100, 0),
      getVideos(100, 0),
      getAudios(100, 0)
    ]);

    const allContent = [
      ...articles.items,
      ...videos.items,
      ...audios.items
    ];

    return allContent.map((content) => ({
      slug: content.fields.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for content:', error);
    return [];
  }
}

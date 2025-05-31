import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getVideoBySlug } from "@/lib/api";
import { renderContentfulMdx } from "@/utils/mdx-utils";
import UniversalContentRenderer from "@/components/UniversalContentRenderer";

// 1時間ごとに再検証
export const revalidate = 3600;

interface Props {
  params: {
    slug: string;
  };
}

// 動的メタデータ
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // paramsを非同期で解決
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  try {
    // まずContentfulからコンテンツを取得
    const contentfulData = await renderContentfulMdx(slug, 'video');
    const title = contentfulData.frontMatter.title || 'タイトルなし';
    const description = contentfulData.frontMatter.description || `${title}に関する動画`;

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
    console.error(`Error generating metadata for video ${slug}:`, error);

    // フォールバック
    const video = await getVideoBySlug(slug);
    if (video) {
      return {
        title: `${video.fields.title} | ビジネススキル百科`,
        description: video.fields.description || `${video.fields.title}に関する動画です。`,
      };
    }

    return {
      title: "動画が見つかりません | ビジネススキル百科",
    };
  }
}

export default async function VideoPage({ params }: Props) {
  // paramsを非同期で解決
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  try {
    // Contentfulからコンテンツを取得
    const contentData = await renderContentfulMdx(slug, 'video');

    return (
      <UniversalContentRenderer
        slug={slug}
        frontMatter={contentData.frontMatter}
        content={contentData.content}
        mdxContent={contentData.mdxContent}
        relatedContents={contentData.relatedContents}
        downloadableFiles={contentData.downloadableFiles}
        contentType="video"
      />
    );
  } catch (error) {
    console.error(`Error rendering video ${slug}:`, error);
    
    // フォールバック：従来のAPIから取得
    try {
      const video = await getVideoBySlug(slug);
      
      if (!video) {
        notFound();
      }

      const {
        title,
        description,
        publishDate,
        videoUrlEmbed,
        category,
        tags,
      } = video.fields;

      return (
        <UniversalContentRenderer
          slug={slug}
          frontMatter={{
            title,
            description,
            publishDate,
            videoUrl: videoUrlEmbed,
            category: category?.fields?.name,
            tags: tags?.map((tag: any) => tag.fields.name) || [],
          }}
          content={description || ''}
          mdxContent={null}
          relatedContents={[]}
          downloadableFiles={[]}
          contentType="video"
        />
      );
    } catch (fallbackError) {
      console.error(`Fallback failed for video ${slug}:`, fallbackError);
      notFound();
    }
  }
}

// 静的ページ生成のためのパスを取得
export async function generateStaticParams() {
  try {
    // Contentfulから動画を取得
    const { getClient } = await import('@/lib/api');
    const client = await getClient();

    const { CONTENT_TYPE } = await import('@/lib/contentful');
    const { CONTENT_TYPES } = await import('@/lib/types');

    const entries = await client.getEntries({
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.VIDEO,
      select: ['fields.slug'],
      limit: 1000, // 十分な数を取得
    });

    // slugが有効な動画のみを返す
    const validVideos = entries.items.filter(
      (video: any) => video?.fields?.slug && typeof video.fields.slug === 'string'
    );

    console.log(`Generating static params for ${validVideos.length} videos`);

    return validVideos.map((video: any) => ({
      slug: video.fields.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for videos:', error);
    // エラーが発生した場合は空の配列を返す
    return [];
  }
}

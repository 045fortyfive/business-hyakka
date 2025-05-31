import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAudioBySlug, getAudios } from "@/lib/api";
import { renderContentfulMdx } from "@/utils/mdx-utils";
import UniversalContentRenderer from "@/components/UniversalContentRenderer";
import { PreviewWrapper } from "@/components/preview";

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
    const contentfulData = await renderContentfulMdx(slug, 'audio');
    const title = contentfulData.frontMatter.title || 'タイトルなし';
    const description = contentfulData.frontMatter.description || `${title}に関する音声`;

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
    console.error(`Error generating metadata for audio ${slug}:`, error);

    // フォールバック
    try {
      const audio = await getAudioBySlug(slug);
      if (audio) {
        return {
          title: `${audio.fields.title} | ビジネススキル百科`,
          description: audio.fields.description || `${audio.fields.title}に関する音声です。`,
        };
      }
    } catch (fallbackError) {
      console.error(`Fallback metadata generation failed for audio ${slug}:`, fallbackError);
    }

    return {
      title: "音声が見つかりません | ビジネススキル百科",
    };
  }
}

// 静的パスの生成
export async function generateStaticParams() {
  try {
    // Contentfulから音声を取得
    const { getClient } = await import('@/lib/api');
    const client = await getClient();

    const { CONTENT_TYPE } = await import('@/lib/contentful');
    const { CONTENT_TYPES } = await import('@/lib/types');

    const entries = await client.getEntries({
      content_type: CONTENT_TYPE.CONTENT,
      'fields.contentType': CONTENT_TYPES.AUDIO,
      select: ['fields.slug'],
      limit: 1000, // 十分な数を取得
    });

    // slugが有効な音声のみを返す
    const validAudios = entries.items.filter(
      (audio: any) => audio?.fields?.slug && typeof audio.fields.slug === 'string'
    );

    console.log(`Generating static params for ${validAudios.length} audios`);

    return validAudios.map((audio: any) => ({
      slug: audio.fields.slug,
    }));
  } catch (error) {
    console.error('Error generating static params for audios:', error);
    return [];
  }
}

export default async function AudioPage({ params }: Props) {
  // paramsを非同期で解決
  const resolvedParams = await Promise.resolve(params);
  const { slug } = resolvedParams;

  try {
    // Contentfulからコンテンツを取得
    const contentData = await renderContentfulMdx(slug, 'audio');

    return (
      <PreviewWrapper
        contentType="audio"
        slug={slug}
        title={contentData.frontMatter.title}
        contentfulEntryId={contentData.contentfulEntryId}
        lastModified={contentData.lastModified}
        showMeta={false} // ページ専用なのでメタ情報は非表示
      >
        <UniversalContentRenderer
          slug={slug}
          frontMatter={contentData.frontMatter}
          content={contentData.content}
          mdxContent={contentData.mdxContent}
          relatedContents={contentData.relatedContents}
          downloadableFiles={contentData.downloadableFiles}
          contentType="audio"
        />
      </PreviewWrapper>
    );
  } catch (error) {
    console.error(`Error rendering audio ${slug}:`, error);
    
    // フォールバック：従来のAPIから取得
    try {
      const audio = await getAudioBySlug(slug);
      
      if (!audio) {
        notFound();
      }

      const {
        title,
        description,
        publishDate,
        audioUrl,
        category,
        tags,
        thumbnail,
      } = audio.fields;

      return (
        <PreviewWrapper
          contentType="audio"
          slug={slug}
          title={title}
          contentfulEntryId={audio.sys.id}
          lastModified={audio.sys.updatedAt}
          showMeta={false}
        >
          <UniversalContentRenderer
            slug={slug}
            frontMatter={{
              title,
              description,
              publishDate,
              audioUrl,
              category: category?.fields?.name,
              tags: tags?.map((tag: any) => tag.fields.name) || [],
              featuredImage: thumbnail ? {
                url: `https:${thumbnail.fields.file.url}`,
                title: thumbnail.fields.title || title,
                width: thumbnail.fields.file.details?.image?.width || 800,
                height: thumbnail.fields.file.details?.image?.height || 450,
              } : undefined,
            }}
            content={description || ''}
            mdxContent={null}
            relatedContents={[]}
            downloadableFiles={[]}
            contentType="audio"
          />
        </PreviewWrapper>
      );
    } catch (fallbackError) {
      console.error(`Fallback failed for audio ${slug}:`, fallbackError);
      notFound();
    }
  }
}

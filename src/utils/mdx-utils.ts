import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import { Content, ContentFields } from '@/lib/types';
import { Asset } from 'contentful';
import { getContentBySlug } from '@/lib/api';
import { processContentfulLineBreaks } from '@/utils/linebreak-utils';

// MDXコンポーネント
import Callout from '@/components/mdx/Callout';
import CodeBlock from '@/components/mdx/CodeBlock';
import AdPlacement from '@/components/mdx/AdPlacement';
import CustomImage from '@/components/mdx/CustomImage';
import MediaRenderer from '@/components/mdx/MediaRenderer';
import { Br, LineBreak, Spacer, ParagraphBreak } from '@/components/mdx/LineBreak';
import { CustomIns, RedText, YellowHighlight } from '@/components/mdx/CustomStyling';
import { extractTocFromMdx, addHeadingIds, TocItem } from '@/utils/toc-utils';
import Image from 'next/image';

// MDXコンポーネントの設定
const components = {
  Callout,
  CodeBlock,
  AdPlacement,
  Image: CustomImage,
  img: MediaRenderer, // MDX内の<img>タグをMediaRendererで処理
  // 改行関連コンポーネント
  Br,
  LineBreak,
  Spacer,
  ParagraphBreak,
  // メディア関連コンポーネント
  MediaRenderer,
  // カスタムスタイリングコンポーネント
  ins: CustomIns,
  RedText,
  YellowHighlight,
  // 他のMDXコンポーネントをここに追加
};

// MDXファイルのディレクトリパス
const contentDirectory = path.join(process.cwd(), 'src/content');

// Helper function to safely extract category name
function getCategoryName(category: any): string | undefined {
  try {
    if (!category || !Array.isArray(category) || category.length === 0) {
      return undefined;
    }
    return category[0]?.fields?.name;
  } catch (error) {
    console.warn('Error extracting category name:', error);
    return undefined;
  }
}

// Helper function to safely extract author name
function getAuthorName(author: any): string | undefined {
  try {
    if (!author || !Array.isArray(author) || author.length === 0) {
      return undefined;
    }
    return author[0]?.fields?.name;
  } catch (error) {
    console.warn('Error extracting author name:', error);
    return undefined;
  }
}

// Helper function to safely extract tag names
function getTagNames(tags: any): string[] {
  try {
    if (!tags || !Array.isArray(tags)) {
      return [];
    }
    return tags.map(tag => tag?.fields?.name).filter(Boolean);
  } catch (error) {
    console.warn('Error extracting tag names:', error);
    return [];
  }
}

// Helper function to safely extract featured image
function getFeaturedImage(featuredImage: any) {
  try {
    if (!featuredImage?.fields?.file?.url) {
      return undefined;
    }
    return {
      url: `https:${featuredImage.fields.file.url}`,
      title: featuredImage.fields.title || '',
      width: featuredImage.fields.file.details?.image?.width || 800,
      height: featuredImage.fields.file.details?.image?.height || 450,
    };
  } catch (error) {
    console.warn('Error extracting featured image:', error);
    return undefined;
  }
}

// Helper function to safely extract body content
function getBodyContent(body: any): string {
  try {
    if (!body) return '';

    // If body is a rich text document, extract the content
    if (body.content && Array.isArray(body.content)) {
      return JSON.stringify(body);
    }

    // If body is already a string
    if (typeof body === 'string') {
      return body;
    }

    return '';
  } catch (error) {
    console.warn('Error extracting body content:', error);
    return '';
  }
}

// Helper function to process and sanitize MDX content
function sanitizeMDXContent(mdxContent: string): string {
  try {
    let processedContent = mdxContent;
    
    // 1. URL正規化 - ContentfulのアセットURL（//で始まる相対パス）をhttps:付きの絶対URLに変換
    processedContent = processedContent.replace(
      /(!\[.*?\]\(|<img[^>]+src=[\"\']{1}|<video[^>]+src=[\"\']{1}|<audio[^>]+src=[\"\']{1}|<a[^>]+href=[\"\']{1})(\/\/[^\)\s\"\'\']+)/g,
      (match, prefix, url) => {
        const httpsUrl = `https:${url}`;
        return `${prefix}${httpsUrl}`;
      }
    );
    
    // 2. Markdown画像記法をHTMLに変換（MDXパースエラーを回避）
    processedContent = processedContent.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      (match, alt, url) => {
        return `<img src="${url}" alt="${alt || ''}" />`;
      }
    );
    
    return processedContent;
  } catch (error) {
    console.warn('Error sanitizing MDX content:', error);
    return mdxContent;
  }
}

// Helper function to process media URLs in MDX content (旧関数を置き換え)
function processMediaUrls(mdxContent: string): string {
  // 新しいサニタイズ関数を使用
  return sanitizeMDXContent(mdxContent);
}

// Helper function to safely extract downloadable files
function getDownloadableFiles(content: any): Array<{url: string, title: string, filename: string}> {
  try {
    const files: Array<{url: string, title: string, filename: string}> = [];

    // Check for downloadableFiles field
    if (content.fields.downloadableFiles && Array.isArray(content.fields.downloadableFiles)) {
      content.fields.downloadableFiles.forEach((file: any) => {
        if (file?.fields?.file?.url) {
          files.push({
            url: `https:${file.fields.file.url}`,
            title: file.fields.title || file.fields.file.fileName || 'ダウンロード',
            filename: file.fields.file.fileName || 'file'
          });
        }
      });
    }

    // Check for assets in body content
    if (content.fields.body?.content) {
      const extractAssetsFromContent = (contentArray: any[]) => {
        contentArray.forEach((item: any) => {
          if (item.nodeType === 'embedded-asset-block' && item.data?.target?.fields?.file?.url) {
            const asset = item.data.target;
            files.push({
              url: `https:${asset.fields.file.url}`,
              title: asset.fields.title || asset.fields.file.fileName || 'ダウンロード',
              filename: asset.fields.file.fileName || 'file'
            });
          }
          if (item.content && Array.isArray(item.content)) {
            extractAssetsFromContent(item.content);
          }
        });
      };

      if (Array.isArray(content.fields.body.content)) {
        extractAssetsFromContent(content.fields.body.content);
      }
    }

    return files;
  } catch (error) {
    console.warn('Error extracting downloadable files:', error);
    return [];
  }
}

// Contentfulからのコンテンツを使用してMDXをレンダリング
export async function renderContentfulMdx(slug: string, contentType: string = 'article') {
  try {
    console.log(`Rendering Contentful MDX for slug: ${slug}, contentType: ${contentType}`);

    // Contentfulからコンテンツを取得
    const content = await getContentBySlug(slug, contentType) as Content;

    if (!content) {
      console.error(`コンテンツが見つかりません: ${slug}`);
      return {
        slug,
        frontMatter: {
          title: 'ページが見つかりません',
          description: '指定されたページは存在しません。',
          featuredImage: {
            url: 'https://placehold.co/1200x675/e2e8f0/1e293b?text=ページが見つかりません',
            title: 'ページが見つかりません',
            width: 1200,
            height: 675
          }
        },
        content: '# ページが見つかりません\n\n指定されたページは存在しません。[ホームに戻る](/)',
        mdxContent: null,
        relatedContents: [],
        downloadableFiles: [],
      };
    }

    console.log(`Found content: ${(content.fields as any).title}`);
    console.log(`Content fields:`, {
      title: (content.fields as any).title,
      hasCategory: !!(content.fields as any).category,
      categoryLength: (content.fields as any).category?.length,
      hasAuthor: !!(content.fields as any).author,
      authorLength: (content.fields as any).author?.length,
      hasFeaturedImage: !!(content.fields as any).featuredImage,
      hasBody: !!(content.fields as any).body,
      hasMdxContent: !!(content.fields as any).mdxContent,
      videoUrl: (content.fields as any).videoUrl,
      audioUrl: (content.fields as any).audioUrl,
      allFields: Object.keys(content.fields)
    });

    // Extract safe values
    const fields = content.fields as any;
    const categoryName = getCategoryName(fields.category);
    const authorName = getAuthorName(fields.author);
    const tagNames = getTagNames(fields.tags);
    const featuredImage = getFeaturedImage(fields.featuredImage);
    const bodyContent = getBodyContent(fields.body);
    const downloadableFiles = getDownloadableFiles(content);

    // MDXコンテンツがある場合はそれを使用
    if (fields.mdxContent) {
      console.log('Compiling MDX content...');

      // 改行処理とメディアURLを事前処理
      let processedMdxContent = processContentfulLineBreaks(fields.mdxContent);
      processedMdxContent = processMediaUrls(processedMdxContent);

      // 目次を生成
      console.log('MDX content for TOC extraction:', processedMdxContent.substring(0, 500));
      const tocItems = extractTocFromMdx(processedMdxContent);
      console.log('Generated TOC items:', tocItems);

      // 見出しにIDを追加
      processedMdxContent = addHeadingIds(processedMdxContent, tocItems);

      const { content: mdxContent } = await compileMDX({
        source: processedMdxContent,
        components,
        options: { parseFrontmatter: true },
      });

      return {
        slug,
        frontMatter: {
          title: fields.title || 'タイトルなし',
          description: fields.description || '',
          category: categoryName,
          tags: tagNames,
          author: authorName,
          publishDate: fields.publishDate,
          videoUrl: fields.videoUrl,
          audioUrl: fields.audioUrl,
          featuredImage,
        },
        content: processedMdxContent, // MDXコンテンツをcontentに渡す
        mdxContent,
        tocItems, // 目次を追加
        relatedContents: fields.relatedContents || [],
        downloadableFiles,
        // Preview関連情報を追加
        contentfulEntryId: content.sys.id,
        lastModified: content.sys.updatedAt,
        version: (content.sys as any).version
      };
    }

    // MDXコンテンツがない場合は通常のコンテンツを返す
    console.log('No MDX content, returning regular content');
    return {
      slug,
      frontMatter: {
        title: fields.title || 'タイトルなし',
        description: fields.description || '',
        category: categoryName,
        tags: tagNames,
        author: authorName,
        publishDate: fields.publishDate,
        videoUrl: fields.videoUrl,
        audioUrl: fields.audioUrl,
        featuredImage,
      },
      content: bodyContent,
      mdxContent: null,
      relatedContents: fields.relatedContents || [],
      downloadableFiles,
      // Preview関連情報を追加
      contentfulEntryId: content.sys.id,
      lastModified: content.sys.updatedAt,
      version: (content.sys as any).version
    };
  } catch (error) {
    console.error(`MDXコンテンツのレンダリング中にエラーが発生しました: ${error}`);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return {
      slug,
      frontMatter: {
        title: 'エラーが発生しました',
        description: 'コンテンツの読み込み中にエラーが発生しました。',
        featuredImage: {
          url: 'https://placehold.co/1200x675/e2e8f0/1e293b?text=エラーが発生しました',
          title: 'エラーが発生しました',
          width: 1200,
          height: 675
        }
      },
      content: '# エラーが発生しました\n\nコンテンツの読み込み中にエラーが発生しました。[ホームに戻る](/)',
      mdxContent: null,
      relatedContents: [],
      downloadableFiles: [],
    };
  }
}

// すべてのMDXファイルのスラッグを取得
export function getAllMdxSlugs() {
  const files = fs.readdirSync(contentDirectory);
  return files
    .filter((file) => file.endsWith('.mdx'))
    .map((file) => ({
      params: {
        slug: file.replace(/\.mdx$/, ''),
      },
    }));
}

// 特定のスラッグのMDXファイルの内容を取得
export function getMdxBySlug(slug: string) {
  try {
    const filePath = path.join(contentDirectory, `${slug}.mdx`);

    // ファイルが存在するか確認
    if (!fs.existsSync(filePath)) {
      // ファイルが存在しない場合はデフォルトのコンテンツを返す（エラーログは出さない）
      return {
        slug,
        frontMatter: {
          title: 'ページが見つかりません',
          description: '指定されたページは存在しません。',
          featuredImage: {
            url: 'https://placehold.co/1200x675/e2e8f0/1e293b?text=ページが見つかりません',
            title: 'ページが見つかりません',
            width: 1200,
            height: 675
          }
        },
        content: `# ページが見つかりません

指定されたページ（${slug}）は存在しません。

[ホームに戻る](/)`
      };
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');

    // gray-matterを使用してフロントマターとコンテンツを分離
    const { data, content } = matter(fileContents);

    return {
      slug,
      frontMatter: data,
      content,
    };
  } catch (error) {
    console.error(`MDXファイルの読み込み中にエラーが発生しました: ${error}`);
    // エラーが発生した場合はデフォルトのコンテンツを返す
    return {
      slug,
      frontMatter: {
        title: 'エラーが発生しました',
        description: 'コンテンツの読み込み中にエラーが発生しました。',
        featuredImage: {
          url: 'https://placehold.co/1200x675/e2e8f0/1e293b?text=エラーが発生しました',
          title: 'エラーが発生しました',
          width: 1200,
          height: 675
        }
      },
      content: `# エラーが発生しました

コンテンツの読み込み中にエラーが発生しました。

[ホームに戻る](/)`
    };
  }
}

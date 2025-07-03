import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import { Content } from '@/lib/types';
import { getContentBySlug } from '@/lib/api';
import { processContentfulLineBreaks } from '@/utils/linebreak-utils';

// MDXコンポーネント
import Callout from '@/components/mdx/Callout';
import CodeBlock from '@/components/mdx/CodeBlock';
import AdPlacement from '@/components/mdx/AdPlacement';
import CustomImage from '@/components/mdx/CustomImage';
import MediaRenderer from '@/components/mdx/MediaRenderer';
import Table from '@/components/mdx/Table';
import { TableHeader, TableData } from '@/components/mdx/TableCell';
import { Br, LineBreak, Spacer, ParagraphBreak } from '@/components/mdx/LineBreak';
import { CustomIns, RedText, YellowHighlight } from '@/components/mdx/CustomStyling';
import { H1, H2, H3, H4, H5, H6 } from '@/components/mdx/Heading';
import Figure from '@/components/mdx/Figure';
import { extractTocFromMdx, addHeadingIds } from '@/utils/toc-utils';

// MDXコンポーネントの設定
const components: any = {
  // 見出しコンポーネント
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  // その他のコンポーネント
  Callout,
  CodeBlock,
  AdPlacement,
  Table,
  Image: CustomImage,
  img: MediaRenderer, // MDX内の<img>タグをMediaRendererで処理
  // テーブル関連コンポーネント
  table: Table,
  th: TableHeader,
  td: TableData,
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
  // Figure コンポーネント
  Figure,
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
      (_match, prefix, url) => {
        const httpsUrl = `https:${url}`;
        return `${prefix}${httpsUrl}`;
      }
    );
    
    // 2. Markdown画像記法をHTMLに変換（MDXパースエラーを回避）
    processedContent = processedContent.replace(
      /!\[([^\]]*)\]\(([^)]+)\)/g,
      (_match, alt, url) => {
        return `<img src="${url}" alt="${alt || ''}" />`;
      }
    );
    
    return processedContent;
  } catch (error) {
    console.warn('Error sanitizing MDX content:', error);
    return mdxContent;
  }
}

// Helper function to sanitize Callout tags
function sanitizeCalloutTags(mdxContent: string): string {
  if (!mdxContent || typeof mdxContent !== 'string') {
    return '';
  }

  try {
    let sanitized = mdxContent;

    // 1. 不完全なCalloutタグを修正
    // 開始タグがあるが終了タグがない場合
    const calloutOpenRegex = /<Callout[^>]*>/g;
    const calloutCloseRegex = /<\/Callout>/g;

    const openMatches = sanitized.match(calloutOpenRegex) || [];
    const closeMatches = sanitized.match(calloutCloseRegex) || [];

    // 開始タグの数が終了タグより多い場合、不足分を追加
    if (openMatches.length > closeMatches.length) {
      const missingCloseTags = openMatches.length - closeMatches.length;
      for (let i = 0; i < missingCloseTags; i++) {
        sanitized += '\n</Callout>';
      }
    }

    // 2. 空のCalloutタグを削除
    sanitized = sanitized.replace(/<Callout[^>]*>\s*<\/Callout>/g, '');

    // 3. 不正な属性を修正
    sanitized = sanitized.replace(/<Callout\s+type="([^"]*)"[^>]*>/g, '<Callout type="$1">');
    sanitized = sanitized.replace(/<Callout\s+type='([^']*)'[^>]*>/g, '<Callout type="$1">');

    // 4. type属性がない場合はデフォルトを追加
    sanitized = sanitized.replace(/<Callout\s*>/g, '<Callout type="info">');

    return sanitized;
  } catch (error) {
    console.error('Error in sanitizeCalloutTags:', error);
    return mdxContent;
  }
}

// Helper function to sanitize code blocks
function sanitizeCodeBlocks(mdxContent: string): string {
  if (!mdxContent || typeof mdxContent !== 'string') {
    return '';
  }

  try {
    let sanitized = mdxContent;

    // 1. CodeBlockコンポーネントの不正な使用を修正
    // <CodeBlock language="javascript">undefined</CodeBlock> のようなパターン
    sanitized = sanitized.replace(/<CodeBlock([^>]*)>undefined<\/CodeBlock>/g, '<CodeBlock$1></CodeBlock>');
    sanitized = sanitized.replace(/<CodeBlock([^>]*)>null<\/CodeBlock>/g, '<CodeBlock$1></CodeBlock>');

    // 2. 空のCodeBlockを修正
    sanitized = sanitized.replace(/<CodeBlock([^>]*)>\s*<\/CodeBlock>/g, '');

    // 3. 不正な属性値を修正
    sanitized = sanitized.replace(/language="undefined"/g, 'language="text"');
    sanitized = sanitized.replace(/language="null"/g, 'language="text"');
    sanitized = sanitized.replace(/language=""/g, 'language="text"');

    // 4. マークダウンコードブロックの修正
    // ```undefined や ```null のようなパターン
    sanitized = sanitized.replace(/```undefined\n/g, '```text\n');
    sanitized = sanitized.replace(/```null\n/g, '```text\n');
    sanitized = sanitized.replace(/```\s*\n/g, '```text\n');

    // 5. 不完全なコードブロックを修正
    sanitized = sanitized.replace(/```[^`]*$/g, ''); // 閉じられていないコードブロック

    // 6. Calloutタグの修正
    sanitized = sanitizeCalloutTags(sanitized);

    return sanitized;
  } catch (error) {
    console.error('Error in sanitizeCodeBlocks:', error);
    return mdxContent;
  }
}

// Helper function to sanitize problematic MDX patterns
function sanitizeProblematicMDXPatterns(mdxContent: string): string {
  if (!mdxContent || typeof mdxContent !== 'string') {
    return '';
  }

  try {
    let sanitized = mdxContent;

    // 1. 最も問題となる太字とカスタムタグの混在パターンを修正
    // すべてのカスタムタグに対して適用
    const customTags = ['YellowHighlight', 'RedText', 'CustomIns'];

    for (const tag of customTags) {
      // **<Tag>text**→**text</Tag>** のようなパターン
      const pattern1 = new RegExp(`\\*\\*<${tag}>([^*]*)\\*\\*([^<]*)<\\/${tag}>\\*\\*`, 'g');
      sanitized = sanitized.replace(pattern1, `**<${tag}>$1$2</${tag}>**`);

      // **<Tag>text</Tag>** のようなパターン
      const pattern2 = new RegExp(`\\*\\*<${tag}>([^<]*)<\\/${tag}>\\*\\*`, 'g');
      sanitized = sanitized.replace(pattern2, `**<${tag}>$1</${tag}>**`);

      // <Tag>**text**</Tag> のようなパターン
      const pattern3 = new RegExp(`<${tag}>\\*\\*([^*]*)\\*\\*<\\/${tag}>`, 'g');
      sanitized = sanitized.replace(pattern3, `**<${tag}>$1</${tag}>**`);

      // **<Tag>text**text</Tag> のような複雑なパターン
      const pattern4 = new RegExp(`\\*\\*<${tag}>([^<]*?)\\*\\*([^<]*?)<\\/${tag}>`, 'g');
      sanitized = sanitized.replace(pattern4, `**<${tag}>$1$2</${tag}>**`);
    }

    // 2. 空のタグを削除
    sanitized = sanitized.replace(/<YellowHighlight>\s*<\/YellowHighlight>/g, '');
    sanitized = sanitized.replace(/<RedText>\s*<\/RedText>/g, '');
    sanitized = sanitized.replace(/<CustomIns>\s*<\/CustomIns>/g, '');

    // 3. 不正な属性を持つタグを修正
    sanitized = sanitized.replace(/<YellowHighlight[^>]*>/g, '<YellowHighlight>');
    sanitized = sanitized.replace(/<RedText[^>]*>/g, '<RedText>');
    sanitized = sanitized.replace(/<CustomIns[^>]*>/g, '<CustomIns>');

    // 4. 壊れたネストを修正
    sanitized = sanitized.replace(/<YellowHighlight>\s*<YellowHighlight>/g, '<YellowHighlight>');
    sanitized = sanitized.replace(/<\/YellowHighlight>\s*<\/YellowHighlight>/g, '</YellowHighlight>');

    // 5. 不完全なタグを修正
    sanitized = sanitized.replace(/<YellowHighlight([^>]*)$/g, ''); // 閉じられていないタグ
    sanitized = sanitized.replace(/^([^<]*)<\/YellowHighlight>/g, '$1'); // 開始タグのないタグ

    // 6. コードブロックの検証と修正
    sanitized = sanitizeCodeBlocks(sanitized);

    return sanitized;
  } catch (error) {
    console.error('Error in sanitizeProblematicMDXPatterns:', error);
    return mdxContent;
  }
}

// Helper function to process media URLs in MDX content (旧関数を置き換え)
function processMediaUrls(mdxContent: string): string {
  // 入力値の検証
  if (!mdxContent || typeof mdxContent !== 'string') {
    console.warn('processMediaUrls: Invalid content provided:', typeof mdxContent);
    return '';
  }

  try {
    // 問題のあるパターンをサニタイズ
    let processed = sanitizeProblematicMDXPatterns(mdxContent);

    // 新しいサニタイズ関数を使用
    processed = sanitizeMDXContent(processed);

    return processed;
  } catch (error) {
    console.error('Error in processMediaUrls:', error);
    return mdxContent; // エラーの場合は元のコンテンツを返す
  }
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
      console.log('MDX content length:', fields.mdxContent.length);
      console.log('MDX content preview:', fields.mdxContent.substring(0, 200));

      // 改行処理とメディアURLを事前処理
      let processedMdxContent = processContentfulLineBreaks(fields.mdxContent);
      processedMdxContent = processMediaUrls(processedMdxContent);

      // 目次を生成
      console.log('MDX content for TOC extraction:', processedMdxContent.substring(0, 500));
      let tocItems: any[] = [];
      try {
        tocItems = extractTocFromMdx(processedMdxContent);
        console.log('Generated TOC items:', tocItems);
      } catch (tocError) {
        console.error('Error generating TOC:', tocError);
        tocItems = [];
      }

      // 見出しにIDを追加
      processedMdxContent = addHeadingIds(processedMdxContent, tocItems);

      try {
        // MDXコンパイル前の検証
        if (!processedMdxContent || typeof processedMdxContent !== 'string') {
          throw new Error('Invalid MDX content: content is not a string');
        }

        console.log('Starting MDX compilation...');

        // MDXコンパイル
        const { content: mdxContent } = await compileMDX({
          source: processedMdxContent,
          components,
          options: {
            parseFrontmatter: true
          },
        });

        console.log('MDX compilation successful');

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
      } catch (mdxError) {
        console.error('MDX compilation failed:', mdxError instanceof Error ? mdxError.message : mdxError);

        // MDXコンパイルに失敗した場合は、プレーンテキストとして表示
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
          content: processedMdxContent, // 処理済みMDXコンテンツをcontentに渡す
          mdxContent: null, // MDXコンパイルに失敗したのでnull
          tocItems,
          relatedContents: fields.relatedContents || [],
          downloadableFiles,
          contentfulEntryId: content.sys.id,
          lastModified: content.sys.updatedAt,
          version: (content.sys as any).version
        };
      }
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

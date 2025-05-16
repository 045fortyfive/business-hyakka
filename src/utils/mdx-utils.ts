import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { compileMDX } from 'next-mdx-remote/rsc';
import { Content, ContentFields } from '@/lib/types';
import { Asset } from 'contentful';
import { getContentBySlug } from '@/lib/api';

// MDXコンポーネント
import Callout from '@/components/mdx/Callout';
import CodeBlock from '@/components/mdx/CodeBlock';
import AdPlacement from '@/components/mdx/AdPlacement';
import Image from 'next/image';

// MDXコンポーネントの設定
const components = {
  Callout,
  CodeBlock,
  AdPlacement,
  Image,
  // 他のMDXコンポーネントをここに追加
};

// MDXファイルのディレクトリパス
const contentDirectory = path.join(process.cwd(), 'src/content');

// Contentfulからのコンテンツを使用してMDXをレンダリング
export async function renderContentfulMdx(slug: string, contentType: string = 'article') {
  try {
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
      };
    }

    // MDXコンテンツがある場合はそれを使用
    if (content.fields.mdxContent) {
      const { content: mdxContent } = await compileMDX({
        source: content.fields.mdxContent,
        components,
        options: { parseFrontmatter: true },
      });

      return {
        slug,
        frontMatter: {
          title: content.fields.title,
          description: content.fields.description,
          category: content.fields.category?.[0]?.fields.name,
          tags: content.fields.tags?.map(tag => tag.fields.name),
          author: content.fields.author?.[0]?.fields.name,
          publishDate: content.fields.publishDate,
          videoUrl: content.fields.videoUrl,
          audioUrl: content.fields.audioUrl,
          featuredImage: content.fields.featuredImage ? {
            url: `https:${content.fields.featuredImage.fields.file.url}`,
            title: content.fields.featuredImage.fields.title || '',
            width: content.fields.featuredImage.fields.file.details.image?.width || 800,
            height: content.fields.featuredImage.fields.file.details.image?.height || 450,
          } : undefined,
        },
        content: content.fields.body?.content || '',
        mdxContent,
        relatedContents: content.fields.relatedContents || [],
      };
    }

    // MDXコンテンツがない場合は通常のコンテンツを返す
    return {
      slug,
      frontMatter: {
        title: content.fields.title,
        description: content.fields.description,
        category: content.fields.category?.[0]?.fields.name,
        tags: content.fields.tags?.map(tag => tag.fields.name),
        author: content.fields.author?.[0]?.fields.name,
        publishDate: content.fields.publishDate,
        videoUrl: content.fields.videoUrl,
        audioUrl: content.fields.audioUrl,
      },
      content: content.fields.body?.content || '',
      mdxContent: null,
      relatedContents: content.fields.relatedContents || [],
    };
  } catch (error) {
    console.error(`MDXコンテンツのレンダリング中にエラーが発生しました: ${error}`);
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

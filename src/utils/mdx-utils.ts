import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// MDXファイルのディレクトリパス
const contentDirectory = path.join(process.cwd(), 'src/content');

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
  const filePath = path.join(contentDirectory, `${slug}.mdx`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  
  // gray-matterを使用してフロントマターとコンテンツを分離
  const { data, content } = matter(fileContents);
  
  return {
    slug,
    frontMatter: data,
    content,
  };
}

# skillpedia 技術仕様書

## システム概要

skillpediaは、Next.js 15とContentful CMSを基盤とした、ビジネススキル学習プラットフォームです。

### 技術スタック

**フロントエンド**
- Next.js 15.3.2 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Contentful Rich Text Renderer

**バックエンド・CMS**
- Contentful CMS
- Vercel (ホスティング・デプロイ)
- Vercel Blob Storage (メディア)

**開発・ビルドツール**
- ESLint
- Prettier
- Git/GitHub

## アーキテクチャ

### ディレクトリ構造

```
src/
├── app/                    # Next.js App Router
│   ├── about/             # Aboutページ
│   ├── articles/[slug]/   # 記事詳細ページ
│   ├── audios/[slug]/     # 音声詳細ページ
│   ├── categories/[slug]/ # カテゴリページ
│   ├── mdx-articles/[slug]/ # MDX記事ページ
│   ├── search/            # 検索ページ
│   ├── videos/[slug]/     # 動画詳細ページ
│   ├── globals.css        # グローバルスタイル
│   ├── layout.tsx         # ルートレイアウト
│   └── page.tsx           # ホームページ
├── components/            # Reactコンポーネント
│   ├── AudioPlayer.tsx    # 音声プレーヤー
│   ├── ContentfulRichText.tsx # リッチテキストレンダラー
│   ├── DownloadSection.tsx # ダウンロードセクション
│   ├── EnhancedTableOfContents.tsx # 目次コンポーネント
│   ├── Header.tsx         # ヘッダー
│   ├── HeroCarousel.tsx   # ヒーローカルーセル
│   ├── MDXRenderer.tsx    # MDXレンダラー
│   ├── RelatedContents.tsx # 関連コンテンツ
│   ├── SearchBar.tsx      # 検索バー
│   ├── SimpleCardCarousel.tsx # カードカルーセル
│   └── VideoPlayer.tsx    # 動画プレーヤー
├── lib/                   # ライブラリ・ユーティリティ
│   ├── api.ts            # Contentful API
│   ├── contentful.ts     # Contentful設定
│   ├── types.ts          # TypeScript型定義
│   └── utils.ts          # ユーティリティ関数
└── utils/                 # ユーティリティ
    ├── mdx-utils.ts      # MDX処理
    └── toc-generator.ts  # 目次生成
```

## Contentful データモデル

### Content Model

**Content（コンテンツ）**
```typescript
interface ContentFields {
  title: string;              // タイトル
  slug: string;               // URL用スラッグ
  contentType: string[];      // コンテンツタイプ（記事/動画/音声）
  description?: string;       // 説明文
  category: Entry<CategoryFields>[]; // カテゴリー
  author?: Entry<AuthorFields>[]; // 著者
  tags?: Entry<TagFields>[];  // タグ
  body?: any;                 // リッチテキスト本文
  mdxContent?: string;        // MDXコンテンツ
  videoUrl?: string;          // 動画URL
  audioUrl?: string;          // 音声URL
  featuredImage?: Asset;      // アイキャッチ画像
  thumbnail?: Asset;          // サムネイル
  publishDate?: string;       // 公開日
  relatedContents?: Entry<ContentFields>[]; // 関連コンテンツ
}
```

**Category（カテゴリー）**
```typescript
interface CategoryFields {
  name: string;        // カテゴリー名
  slug: string;        // URL用スラッグ
  description?: string; // 説明
}
```

**Tag（タグ）**
```typescript
interface TagFields {
  name: string; // タグ名
  slug: string; // URL用スラッグ
}
```

**Author（著者）**
```typescript
interface AuthorFields {
  name: string;              // 著者名
  bio?: string;              // 経歴
  profilePicture?: Asset;    // プロフィール画像
}
```

## コンテンツレンダリング

### ContentfulRichText コンポーネント

**主要機能**
- Contentfulリッチテキストの完全レンダリング
- YouTube動画自動埋め込み
- 画像・ファイルアセット表示
- 内部リンク自動ルーティング
- アクセシビリティ対応

**対応要素**
```typescript
// テキスト装飾
MARKS.BOLD      // 太字
MARKS.ITALIC    // 斜体
MARKS.UNDERLINE // 下線
MARKS.CODE      // コード

// ブロック要素
BLOCKS.PARAGRAPH    // 段落
BLOCKS.HEADING_1-6  // 見出し1-6
BLOCKS.UL_LIST      // 箇条書きリスト
BLOCKS.OL_LIST      // 番号付きリスト
BLOCKS.LIST_ITEM    // リスト項目
BLOCKS.QUOTE        // 引用
BLOCKS.HR           // 水平線
BLOCKS.EMBEDDED_ASSET // 埋め込みアセット

// インライン要素
INLINES.HYPERLINK      // 外部リンク
INLINES.ENTRY_HYPERLINK // 内部リンク
```

### YouTube動画埋め込み

**対応URL形式**
```javascript
const youtubePatterns = [
  /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
  /youtube\.com\/watch\?.*v=([^&\n?#]+)/
];
```

**埋め込み設定**
```javascript
const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
```

## 目次（TOC）生成

### 処理フロー

1. **Contentfulリッチテキスト解析**
   ```typescript
   extractTocFromContentfulRichText(content) → TocDocument
   ```

2. **見出し抽出**
   ```typescript
   extractHeadingsFromRichText(richTextDocument) → Heading[]
   ```

3. **階層構造生成**
   ```typescript
   generateTableOfContents(tocDocument) → TocItem[]
   ```

4. **ID生成**
   ```typescript
   generateHeadingId(text, index, level) → string
   // 例: "heading-2-プレゼンテーション-スキル"
   ```

### TOC表示

**デスクトップ**
- 記事上部に固定表示
- スクロール連動ハイライト
- スムーズスクロール

**モバイル**
- 折りたたみ可能
- タッチ操作対応

## API設計

### Contentful API ラッパー

**基本関数**
```typescript
// コンテンツ取得
getArticles(limit?, skip?, orderBy?) → ContentCollection
getVideos(limit?, skip?, orderBy?) → ContentCollection
getAudios(limit?, skip?, orderBy?) → ContentCollection

// 個別取得
getContentBySlug(slug, contentType) → Content | null
getArticleBySlug(slug) → Content | null
getVideoBySlug(slug) → Content | null
getAudioBySlug(slug) → Content | null

// カテゴリー
getCategories() → CategoryCollection
getCategoryBySlug(slug) → Category | null
getContentByCategory(categorySlug) → CategoryContentResult

// 検索
searchContent(query, limit?, skip?) → SearchResult
```

**キャッシュ戦略**
- React Cache API使用
- ISR（Incremental Static Regeneration）
- revalidate: 3600秒（1時間）

## パフォーマンス最適化

### 画像最適化

**Next.js Image コンポーネント**
- 自動WebP変換
- レスポンシブ画像
- 遅延読み込み
- プレースホルダー表示

**推奨設定**
```typescript
<Image
  src={imageUrl}
  alt={altText}
  width={1200}
  height={675}
  className="rounded-lg"
  priority={isAboveFold}
  placeholder="blur"
/>
```

### 静的生成

**generateStaticParams**
```typescript
// 全コンテンツの静的パス生成
export async function generateStaticParams() {
  const entries = await client.getEntries({
    content_type: 'content',
    select: ['fields.slug'],
    limit: 1000
  });
  
  return entries.items.map(item => ({
    slug: item.fields.slug
  }));
}
```

### バンドル最適化

**動的インポート**
```typescript
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Spinner />,
  ssr: false
});
```

## SEO対応

### メタデータ生成

**動的メタデータ**
```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const content = await getContentBySlug(params.slug);
  
  return {
    title: `${content.fields.title} | skillpedia`,
    description: content.fields.description,
    openGraph: {
      title: content.fields.title,
      description: content.fields.description,
      images: [content.fields.featuredImage?.fields.file.url],
    },
  };
}
```

### 構造化データ

**JSON-LD**
```typescript
const structuredData = {
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": title,
  "description": description,
  "author": {
    "@type": "Person",
    "name": author
  },
  "datePublished": publishDate,
  "image": featuredImage
};
```

## セキュリティ

### Content Security Policy

```typescript
const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline' *.youtube.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: *.ctfassets.net *.vercel-storage.com;
  font-src 'self';
  object-src 'none';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  frame-src *.youtube.com;
`;
```

### 環境変数

```bash
# Contentful
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_access_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token
CONTENTFUL_ENVIRONMENT=master

# Vercel
VERCEL_URL=your_vercel_url
```

## デプロイメント

### Vercel設定

**vercel.json**
```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "functions": {
    "app/**/*.tsx": {
      "maxDuration": 30
    }
  }
}
```

### ビルド最適化

**next.config.js**
```javascript
module.exports = {
  images: {
    domains: ['images.ctfassets.net', 'assets.ctfassets.net'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
};
```

## 監視・分析

### パフォーマンス監視

- Core Web Vitals
- Lighthouse CI
- Vercel Analytics
- Real User Monitoring

### エラー追跡

- Vercel Error Tracking
- Console.log monitoring
- 404 Page tracking

---

*この技術仕様書は開発の進行に合わせて更新されます。*

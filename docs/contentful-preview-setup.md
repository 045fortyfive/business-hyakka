# Contentfulプレビュー設定ガイド

このドキュメントでは、Contentfulのプレビュー機能を設定する方法について説明します。

## プレビュー設定の手順

1. Contentfulの管理画面にログインします。
2. 左側のメニューから「Settings」を選択し、ドロップダウンから「Content preview」を選択します。
3. 「+ Create preview platform」ボタンをクリックします。
4. 以下の情報を入力します：

### 基本情報
- **Name**: Skillpedia Preview
- **Description**: プレビュー環境の説明（任意）

### コンテンツタイプごとのプレビューURL設定

各コンテンツタイプに対して、以下のようなプレビューURLを設定します：

#### 記事（article）
```
https://www.skillpedia.jp/api/preview?secret=YOUR_PREVIEW_SECRET&slug={entry.fields.slug}&type=article
```

#### 動画（video）
```
https://www.skillpedia.jp/api/preview?secret=YOUR_PREVIEW_SECRET&slug={entry.fields.slug}&type=video
```

#### 音声（audio）
```
https://www.skillpedia.jp/api/preview?secret=YOUR_PREVIEW_SECRET&slug={entry.fields.slug}&type=audio
```

#### カテゴリー（category）
```
https://www.skillpedia.jp/api/preview?secret=YOUR_PREVIEW_SECRET&slug={entry.fields.slug}&type=category
```

#### タグ（tag）
```
https://www.skillpedia.jp/api/preview?secret=YOUR_PREVIEW_SECRET&slug={entry.fields.slug}&type=tag
```

## プレビューAPIの実装

Next.jsでプレビューAPIを実装するには、以下のようなAPIルートを作成します：

```typescript
// src/app/api/preview/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')
  const type = searchParams.get('type')

  // プレビューシークレットをチェック
  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  // スラッグが必要
  if (!slug) {
    return new Response('No slug in URL', { status: 401 })
  }

  // コンテンツタイプが必要
  if (!type) {
    return new Response('No content type specified', { status: 401 })
  }

  // ドラフトモードを有効化
  draftMode().enable()

  // コンテンツタイプに応じたリダイレクト先を設定
  let redirectUrl = '/'
  
  switch (type) {
    case 'article':
      redirectUrl = `/articles/${slug}`
      break
    case 'video':
      redirectUrl = `/videos/${slug}`
      break
    case 'audio':
      redirectUrl = `/audios/${slug}`
      break
    case 'category':
      redirectUrl = `/categories/${slug}`
      break
    case 'tag':
      redirectUrl = `/tags/${slug}`
      break
    default:
      redirectUrl = '/'
  }

  // プレビューページにリダイレクト
  redirect(redirectUrl)
}
```

## 環境変数の設定

`.env.local`ファイルに以下の環境変数を追加します：

```
CONTENTFUL_PREVIEW_SECRET=your_secure_random_string
```

## プレビューモードの終了

プレビューモードを終了するためのAPIルートも実装します：

```typescript
// src/app/api/exit-preview/route.ts
import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  // ドラフトモードを無効化
  draftMode().disable()

  // ホームページにリダイレクト
  redirect('/')
}
```

## 注意事項

- プレビューシークレットは安全な文字列を使用し、公開しないでください。
- プレビュー機能はContentfulの「master」環境でのみ設定できます。
- プレビューURLにアクセストークンを含めないでください。認証プロセスはクライアントアプリで実装してください。

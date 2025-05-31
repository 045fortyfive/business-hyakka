# 🎯 Contentful Webhook テストガイド

このガイドでは、ContentfulとNext.jsの即時更新機能をテストする方法を説明します。

## 🚀 セットアップ

### 1. 開発サーバーの起動
```bash
npm run dev
```

### 2. 環境変数の確認
`.env.local`ファイルに以下が設定されていることを確認：
```bash
CONTENTFUL_WEBHOOK_SECRET=ouRdtEWBClayl75vda53_B-MDOcqLB1DjiG0lIN-zpDoQ7ahBswgWZVDYycYl4bG
```

## 🧪 テスト方法

### 方法1: Webインターフェース（推奨）
1. ブラウザで `http://localhost:3000/api/test-webhook` にアクセス
2. テストしたいコンテンツタイプのボタンをクリック
3. 結果を確認

### 方法2: コマンドライン
```bash
# 記事公開をテスト
node scripts/test-webhook.js article_published http://localhost:3000

# カテゴリ公開をテスト  
node scripts/test-webhook.js category_published http://localhost:3000

# 動画公開をテスト
node scripts/test-webhook.js video_published http://localhost:3000
```

### 方法3: curl（上級者向け）
```bash
curl -X POST http://localhost:3000/api/revalidate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ouRdtEWBClayl75vda53_B-MDOcqLB1DjiG0lIN-zpDoQ7ahBswgWZVDYycYl4bG" \
  -H "x-contentful-webhook-name: test-article-published" \
  -d '{
    "sys": {
      "id": "test-123",
      "contentType": {"sys": {"id": "content"}},
      "space": {"sys": {"id": "vxy009lryi3x"}}
    },
    "fields": {
      "title": {"en-US": "テスト記事"},
      "slug": {"en-US": "test-article"},
      "contentType": {"en-US": "記事"}
    }
  }'
```

## 🔍 確認項目

### ✅ 成功時の確認ポイント
1. **HTTPステータス**: 200 OK
2. **レスポンス**: `"success": true`
3. **再検証リソース**: `revalidated.paths` と `revalidated.tags` の配列
4. **ログ出力**: コンソールに詳細なログが表示される

### 📋 再検証されるリソース
- **記事更新時**:
  - `/` (ホームページ)
  - `/articles` (記事一覧)
  - `/articles/[slug]` (記事詳細)
  - `/categories` (カテゴリ一覧)
  - `/search` (検索ページ)

- **カテゴリ更新時**:
  - `/articles` (記事一覧)  
  - `/categories` (カテゴリ一覧)
  - `/` (ホームページ)

### 🏷️ キャッシュタグ
- `contentful` (全体)
- `articles`, `videos`, `audios`, `categories` (タイプ別)
- `article:slug`, `video:slug` など (個別)

## 🐛 トラブルシューティング

### ❌ 401 Unauthorized
- 環境変数 `CONTENTFUL_WEBHOOK_SECRET` が正しく設定されているか確認
- Contentful側のHeadersの設定が正しいか確認

### ❌ 500 Internal Server Error  
- Next.jsの開発サーバーが起動しているか確認
- コンソールログでエラー詳細を確認

### ❌ 接続エラー
- URLが正しいか確認（http://localhost:3000）
- ファイアウォールやプロキシの設定を確認

## 📊 パフォーマンス確認

### Before/After比較
1. **テスト前**: ページの最終更新時刻を確認
2. **Webhook実行**: 上記方法でテスト実行
3. **テスト後**: ページを再読み込みして更新を確認

### キャッシュ効果の確認
- Chrome DevToolsのNetworkタブで `(from cache)` を確認
- `Cache-Control` ヘッダーの値を確認

## 🔗 関連URL

### 開発環境
- テストページ: http://localhost:3000/api/test-webhook
- ヘルスチェック: http://localhost:3000/api/revalidate
- 記事一覧: http://localhost:3000/articles
- カテゴリ一覧: http://localhost:3000/categories

### 本番環境 
- ヘルスチェック: https://www.skillpedia.jp/api/revalidate
- 記事一覧: https://www.skillpedia.jp/articles

## 💡 Tips

1. **リアルタイム監視**: 開発サーバーのコンソールログをリアルタイムで確認
2. **ブラウザのキャッシュクリア**: Ctrl+F5 または Cmd+Shift+R で強制更新
3. **複数タブ**: 複数のタブで同時にページを開いて更新効果を確認
4. **ネットワークタブ**: DevToolsで実際のAPIリクエストを監視

## 🎯 次のステップ

テストが成功したら：
1. Contentfulの本番Webhookを有効化
2. 実際のコンテンツで動作確認
3. パフォーマンス監視の設定
4. エラー通知の設定

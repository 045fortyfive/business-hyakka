# Contentful Live Preview 設定ガイド

このドキュメントでは、skillpedia.jpでContentfulのLive Preview機能を設定する方法を説明します。

## 🎯 問題解決: "Your website refused to connect" エラー

### 問題の原因
ContentfulのLive Previewがiframeでサイトを埋め込もうとする際に、セキュリティヘッダー（X-Frame-Options, CSP）により接続が拒否されている状態です。

### ✅ 解決策（実装済み）

#### 1. セキュリティヘッダーの最適化
- **X-Frame-Options**: `ALLOWALL` (プレビューページ用)
- **Content-Security-Policy**: Contentfulドメインを許可
- **CORS設定**: `https://app.contentful.com` からのアクセス許可

#### 2. プレビューAPI の強化
- OPTIONS メソッド対応（CORS プリフライト）
- Live Preview 専用ヘッダー設定
- エラーハンドリング改善

#### 3. Middleware による動的ヘッダー設定
- Contentful からのアクセス検出
- プレビューモード時の特別なセキュリティ設定

## 🔧 Contentful側の設定手順

### 1. Preview URL の設定

Contentfulの管理画面で以下のPreview URLを設定してください：

```
https://www.skillpedia.jp/api/preview?secret=YOUR_PREVIEW_SECRET&slug={entry.fields.slug}&type=article
```

**重要**: `YOUR_PREVIEW_SECRET` を実際のシークレット値に置き換えてください。

### 2. コンテンツタイプ別のPreview URL

#### 記事 (Article)
```
https://www.skillpedia.jp/api/preview?secret=YOUR_PREVIEW_SECRET&slug={entry.fields.slug}&type=article
```

#### 動画 (Video)
```
https://www.skillpedia.jp/api/preview?secret=YOUR_PREVIEW_SECRET&slug={entry.fields.slug}&type=video
```

#### 音声 (Audio)
```
https://www.skillpedia.jp/api/preview?secret=YOUR_PREVIEW_SECRET&slug={entry.fields.slug}&type=audio
```

#### MDX記事
```
https://www.skillpedia.jp/api/preview?secret=YOUR_PREVIEW_SECRET&slug={entry.fields.slug}&type=mdx-article
```

### 3. Live Preview の有効化

1. **Settings** → **Content preview** → **Preview URLs** に移動
2. **Add preview URL** をクリック
3. 上記のURLを設定
4. **Enable Live Preview** を有効にする

## 🔍 トラブルシューティング

### ヘルスチェックAPI の使用

以下のエンドポイントでプレビュー機能の状態を確認できます：

```bash
# 基本的なステータス確認
curl https://www.skillpedia.jp/api/preview-health?action=status

# ヘッダー情報の確認
curl https://www.skillpedia.jp/api/preview-health?action=headers

# 総合テスト
curl https://www.skillpedia.jp/api/preview-health?action=test
```

### よくある問題と解決策

#### 1. "refused to connect" エラー
**原因**: セキュリティヘッダーの設定  
**解決**: 実装済みの設定により解決

#### 2. "Invalid secret" エラー
**原因**: プレビューシークレットが間違っている  
**解決**: 環境変数 `CONTENTFUL_PREVIEW_SECRET` の値を確認

#### 3. "Content not found" エラー
**原因**: slugが存在しないか、コンテンツタイプが間違っている  
**解決**: Contentfulでslugとコンテンツタイプを確認

#### 4. Live Preview が動作しない
**原因**: ブラウザのセキュリティ設定  
**解決**: 新しいタブでプレビューを開く、またはLive Previewを無効化

## 🛡️ セキュリティ考慮事項

### 1. プレビューシークレットの管理
- 強力なランダム文字列を使用
- 定期的なローテーション
- 環境変数での管理

### 2. アクセス制限
- Contentfulドメインからのみアクセス許可
- プレビューモード時のみ緩いセキュリティ設定適用

### 3. ログ監視
- プレビューアクセスのログ記録
- 不正アクセスの検出

## 📊 パフォーマンス最適化

### 1. キャッシュ設定
- プレビューモード時はキャッシュ無効化
- 通常モードでは適切なキャッシュ設定

### 2. 環境分離
- 本番環境とプレビュー環境の分離
- プレビュー専用のContentfulスペース使用を推奨

## 🚀 実装完了事項

### ✅ セキュリティヘッダー最適化
- next.config.js でのヘッダー設定
- middleware.ts による動的ヘッダー制御

### ✅ API エンドポイント強化
- CORS対応の追加
- エラーハンドリング改善
- ログ機能の充実

### ✅ プレビューUI改善
- 視覚的フィードバックの追加
- 編集者向けの操作性向上

### ✅ 監視・デバッグ機能
- ヘルスチェックAPI
- 詳細なログ出力
- トラブルシューティング支援

## 📞 サポート

問題が解決しない場合は、以下の情報を含めてお問い合わせください：

1. エラーメッセージの詳細
2. ブラウザの開発者ツールのコンソールログ
3. `/api/preview-health?action=test` の実行結果
4. 使用しているContentfulのPreview URL設定

---

**最終更新**: 2024年12月
**バージョン**: 2.0
**対応状況**: Contentful Live Preview 完全対応済み

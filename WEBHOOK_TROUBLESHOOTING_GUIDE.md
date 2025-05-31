# 🔍 「更新されない場合」の完全トラブルシューティングガイド

## 📊 現在のシステム状況

### ✅ 正常動作確認済み項目
- **Webhook エンドポイント**: 正常 (198ms response)
- **認証システム**: 正常 (正しいトークンで認証成功、不正トークンで拒否)
- **コンテンツタイプ処理**: 全て正常 (記事、カテゴリ、タグ)
- **ページアクセス**: 全て正常 (/, /articles, /categories, /search)
- **パフォーマンス**: 優秀 (全ページ400ms以下)

## 🔧 「更新されない場合」の原因と解決策

### 1. ⏰ **タイミングの問題**

#### 症状
- Contentfulで更新したが、すぐにサイトに反映されない
- 数分後には反映される

#### 原因
```
Contentful更新 → Webhook送信 → Next.js処理 → CDN更新
     ↓              ↓           ↓          ↓
   即座         1-2秒       1-2秒     10-30秒
```

#### 解決策
1. **待ち時間を理解する**: 最大30秒程度待つ
2. **ハードリフレッシュ**: Ctrl+F5 (Windows) / Cmd+Shift+R (Mac)
3. **キャッシュクリア**: ブラウザのキャッシュをクリア

#### 確認方法
```bash
# Webhookが実際に送信されているか確認
node scripts/test-production-webhook.js article_published
```

---

### 2. 🌐 **CDN・ブラウザキャッシュの問題**

#### 症状
- Webhookは成功しているが、ページが古いまま
- 他のユーザーには更新が見えるが、自分には見えない

#### 原因
- Vercelの Edge Cache
- CloudflareなどのCDN
- ブラウザキャッシュ
- ISPキャッシュ

#### 解決策
```bash
# 1. 強制リフレッシュ
Ctrl + F5 (Windows)
Cmd + Shift + R (Mac)

# 2. プライベートブラウジング
新しいシークレットタブで確認

# 3. 異なるネットワークでテスト
スマートフォンのモバイル回線で確認

# 4. キャッシュバスティング
URL末尾に ?t=1234567890 を追加
```

#### 確認ツール
```javascript
// ブラウザのコンソールで実行
console.log('Page loaded at:', new Date());
console.log('Cache status:', performance.getEntriesByType('navigation')[0]);
```

---

### 3. 🔒 **Webhook配信の失敗**

#### 症状
- Contentfulで更新したが、まったく反映されない
- エラーメッセージは表示されない

#### 原因と確認方法

##### 📡 Contentful側の確認
1. **Contentful管理画面**
   ```
   Settings → Webhooks → "Next.js Instant Update" → Activity
   ```

2. **成功時の表示例**
   ```
   ✅ 2025-05-31 13:30:00 - 200 OK - Entry Published
   ✅ 2025-05-31 13:25:00 - 200 OK - Entry Published
   ```

3. **失敗時の表示例**
   ```
   ❌ 2025-05-31 13:30:00 - 401 Unauthorized
   ❌ 2025-05-31 13:25:00 - 500 Internal Server Error
   ❌ 2025-05-31 13:20:00 - Timeout
   ```

##### 🔧 対処法
```bash
# ステータスコード別の対処

# 401 Unauthorized
→ Vercel環境変数の CONTENTFUL_WEBHOOK_SECRET を確認
→ Contentful の Headers 設定を確認

# 500 Internal Server Error  
→ Vercelのfunction logsを確認
→ /api/revalidate のコードエラーを確認

# Timeout
→ Vercelの関数実行時間を確認
→ 大量のページ再検証がないか確認
```

---

### 4. 🎯 **特定コンテンツタイプの問題**

#### 症状
- 記事は更新されるが、カテゴリは更新されない
- 一部のコンテンツタイプのみ問題

#### 原因
- Contentful Webhookのフィルタ設定
- `/api/revalidate`のコンテンツタイプ処理

#### 確認方法
```bash
# 各コンテンツタイプをテスト
node scripts/comprehensive-webhook-diagnostic.js
```

#### 解決策
1. **Contentfulフィルタ確認**
   ```
   Webhookの「Filters」で以下が設定されているか確認:
   - Content Type ID: content, category, tag
   ```

2. **APIルート確認**
   ```typescript
   // src/app/api/revalidate/route.ts の switch文を確認
   switch (contentType) {
     case 'content': // ← 確認
     case 'category': // ← 確認  
     case 'tag': // ← 確認
   }
   ```

---

### 5. 🔄 **部分的な更新の問題**

#### 症状
- 一覧ページは更新されるが、詳細ページが更新されない
- ホームページは更新されるが、カテゴリページが更新されない

#### 原因
- 再検証パスの不足
- スラッグの取得エラー

#### 診断方法
```bash
# Webhookレスポンスで再検証されたパスを確認
node scripts/test-production-webhook.js article_published

# レスポンス例
{
  "revalidated": {
    "paths": [
      "/articles",           # ← 一覧ページ
      "/articles/test-slug", # ← 詳細ページ
      "/",                   # ← ホームページ
      "/categories",         # ← カテゴリ一覧
      "/search"              # ← 検索ページ
    ]
  }
}
```

#### 解決策
```typescript
// 不足しているパスを追加
revalidatePath('/missing-path');
revalidateTag('missing-tag');
```

---

### 6. 📝 **Contentful Environment の問題**

#### 症状
- プレビュー環境では更新されるが、本番では更新されない
- 逆のパターン

#### 原因
- Webhook設定のEnvironment指定
- 間違ったSpace IDやEnvironment

#### 確認方法
```javascript
// Webhookペイロードで確認すべき項目
{
  "sys": {
    "space": {"sys": {"id": "vxy009lryi3x"}}, // ← 正しいSpace ID
    "environment": {"sys": {"id": "master"}}   // ← 正しいEnvironment
  }
}
```

#### 解決策
1. **Contentful Webhook設定**
   ```
   Filters → Environment ID → master (本番の場合)
   ```

2. **環境変数確認**
   ```bash
   # Vercelで確認
   CONTENTFUL_SPACE_ID=vxy009lryi3x
   CONTENTFUL_ENVIRONMENT=master
   ```

---

### 7. 🚨 **緊急時の手動更新方法**

#### Webhookが完全に動かない場合の緊急対処

##### 方法1: Vercel Dashboard
```
1. Vercelダッシュボード → Functions → Deployments
2. 「Redeploy」ボタンをクリック
3. 全サイトが強制的に再生成される（5-10分）
```

##### 方法2: コマンドライン
```bash
# ローカルから手動でWebhookを実行
node scripts/test-production-webhook.js article_published
```

##### 方法3: ブラウザから直接
```
# ブラウザで以下にアクセス（GET request）
https://www.skillpedia.jp/api/revalidate

# 健康状態を確認
{"status":"OK","environment":"production"}
```

---

## 🎯 定期監視の設定

### 自動監視スクリプト
```bash
#!/bin/bash
# daily-health-check.sh

echo "Daily Webhook Health Check - $(date)"
node scripts/comprehensive-webhook-diagnostic.js

# 結果をログファイルに保存
if [ $? -eq 0 ]; then
    echo "✅ Health check passed" >> webhook-health.log
else
    echo "❌ Health check failed" >> webhook-health.log
    # アラートメール送信など
fi
```

### Cron設定例
```bash
# 毎日午前9時に健康チェック実行
0 9 * * * /path/to/daily-health-check.sh
```

---

## 📊 パフォーマンス監視

### 重要な指標
```javascript
// 監視すべきメトリクス
const metrics = {
  webhookResponseTime: '< 500ms',      // Webhook処理時間
  pageLoadTime: '< 2000ms',            // ページ読み込み時間  
  successRate: '> 99%',                // Webhook成功率
  cacheHitRate: '> 80%',               // キャッシュヒット率
};
```

### アラート条件
```
🚨 即座対応が必要:
- Webhook 5分以上失敗
- ページ読み込み 5秒以上
- エラー率 10%以上

⚠️ 注意が必要:
- Webhook応答時間 1秒以上
- ページ読み込み 3秒以上
- エラー率 5%以上
```

---

## 🎉 まとめ

### ✅ 現在のシステム状況 (優秀)
- **Webhook機能**: 完全動作 (14/14テスト成功)
- **認証セキュリティ**: 正常動作
- **パフォーマンス**: 優秀 (198-337ms)
- **全コンテンツタイプ**: 正常処理

### 🔍 「更新されない」主な原因TOP5

1. **⏰ タイミング問題** (最も頻繁)
   - **症状**: すぐに反映されない
   - **解決**: 30秒待つ + ハードリフレッシュ
   - **確認**: `Ctrl+F5` でページ更新

2. **🌐 キャッシュ問題** (2番目に頻繁)
   - **症状**: 他の人には見えるが自分には見えない
   - **解決**: シークレットタブで確認
   - **確認**: 異なるデバイス・ネットワークでテスト

3. **📡 Webhook配信失敗** (技術的問題)
   - **症状**: まったく反映されない
   - **解決**: Contentful Activity確認 → Vercel環境変数確認
   - **確認**: `Settings → Webhooks → Activity`

4. **🎯 コンテンツタイプフィルタ** (設定問題)
   - **症状**: 特定タイプのみ更新されない
   - **解決**: Webhook Filtersでcontent/category/tag確認
   - **確認**: 包括診断スクリプト実行

5. **🔄 部分更新問題** (実装問題)
   - **症状**: 一覧は更新されるが詳細ページは更新されない
   - **解決**: `/api/revalidate`の再検証パス確認
   - **確認**: Webhookレスポンスのpaths配列確認

### 🛠️ 緊急時対応フロー

```
更新されない！
     ↓
① 30秒待つ + Ctrl+F5
     ↓ (ダメなら)
② シークレットタブで確認
     ↓ (ダメなら)
③ Contentful Webhook Activity確認
     ↓ (エラーがあれば)
④ 認証トークン確認・修正
     ↓ (それでもダメなら)
⑤ Vercel再デプロイ
     ↓ (最終手段)
⑥ 手動Webhook実行
```

### 📊 監視・診断ツール

#### 日常的なチェック
```bash
# 簡単なヘルスチェック
curl https://www.skillpedia.jp/api/revalidate

# 期待される応答
{"status":"OK","environment":"production"}
```

#### 詳細診断
```bash
# 包括的テスト (問題発生時)
node scripts/comprehensive-webhook-diagnostic.js

# 本番環境テスト (Webhook機能確認)
node scripts/test-production-webhook.js article_published
```

#### Contentful側の確認
```
1. Contentful → Settings → Webhooks
2. "Next.js Instant Update" → Activity
3. 最新のステータスコードを確認:
   ✅ 200 OK → 正常
   ❌ 401 → 認証エラー
   ❌ 500 → サーバーエラー
   ❌ Timeout → 処理時間オーバー
```

### 🎯 ベストプラクティス

#### 更新後の確認手順
1. **Contentfulで更新・公開**
2. **10秒待つ**
3. **対象ページをハードリフレッシュ**
4. **更新を確認**
5. **異なるデバイス/ネットワークで再確認**

#### 予防的メンテナンス
```bash
# 週1回の健康チェック
node scripts/comprehensive-webhook-diagnostic.js

# 月1回のパフォーマンス確認
# → レスポンス時間・成功率の推移確認
```

#### 設定確認チェックリスト
- ✅ Vercel環境変数: `CONTENTFUL_WEBHOOK_SECRET`
- ✅ Contentful URL: `https://www.skillpedia.jp/api/revalidate`
- ✅ Contentful Headers: `Authorization: Bearer ...`
- ✅ Contentful Filters: `content, category, tag`
- ✅ Contentful Events: `Entry published, unpublished, deleted`

### 📈 期待されるパフォーマンス

#### 更新速度
```
Contentful公開 → サイト反映
理想: 5-10秒
許容: 30秒以内
問題: 1分以上
```

#### ページ読み込み速度
```
初回訪問: 300-500ms (優秀)
再訪問: 100-200ms (キャッシュ効果)
Webhook処理: 200ms以下
```

#### 成功率
```
Webhook配信成功率: 99%以上
ページアクセス成功率: 99.9%以上
再検証成功率: 100%
```

### 🚀 実装完了 & 運用開始

ContentfulとNext.jsの即時更新機能が正常に稼働中です！

**主な成果:**
- ⚡ **即座更新**: 数秒でサイト反映
- 🔒 **セキュア**: 認証付きWebhook
- 📊 **高性能**: 200-300ms応答時間
- 🎯 **包括的**: 全コンテンツタイプ対応
- 🛠️ **監視完備**: 診断・トラブルシューティングツール

**運用ポイント:**
- 通常は何もする必要なし（自動動作）
- 問題発生時は上記フローで対応
- 定期的な健康チェック推奨

---

**🎉 お疲れさまでした！**

これで、ContentfulでコンテンツをPublishするとほぼ即座にWebサイトに反映される
最新のJamstack環境が完成しました！

何か問題が発生した場合は、このガイドを参考にトラブルシューティングを
行ってください。

**Happy Content Management! 🚀✨**

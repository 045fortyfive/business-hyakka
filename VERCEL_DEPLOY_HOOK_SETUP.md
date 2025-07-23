# Vercel Deploy Hook 設定ガイド

## 🎯 目的
ContentfulでコンテンツをPublishした時に、Vercelで自動的に再デプロイを実行

## 🚀 Step 1: Vercel Deploy Hook URL取得

### 1. Vercel Dashboardにアクセス
1. [Vercel Dashboard](https://vercel.com/dashboard)にログイン
2. プロジェクト **businesspedia-8gao** を選択

### 2. Deploy Hook作成
1. **Settings** タブをクリック
2. 左サイドバーで **Git** を選択
3. **Deploy Hooks** セクションまでスクロール
4. **Create Hook** ボタンをクリック

### 3. Hook設定
```
Hook Name: Contentful Auto Deploy
Git Branch: master (または main)
```

### 4. URLコピー
生成されたDeploy Hook URLをコピー
例: `https://api.vercel.com/v1/integrations/deploy/prj_xxx/xxx`

## 🔧 Step 2: Contentful Webhook設定

### 1. 新しいWebhook作成
1. **Contentful管理画面** → **Settings** → **Webhooks**
2. **Add webhook** をクリック

### 2. 基本設定
```
Name: Vercel Auto Deploy
URL: [Step 1でコピーしたDeploy Hook URL]
Method: POST (自動選択)
Active: ON
```

### 3. Triggers設定
**Content Events**で以下を選択：
- ✅ **Entry** → **Publish**
- ✅ **Entry** → **Unpublish**
- ✅ **Entry** → **Delete**

### 4. Filters設定
```
Environment ID (sys.environment.sys.id) equals master
Content Type ID (sys.contentType.sys.id) equals content
Content Type ID (sys.contentType.sys.id) equals category
Content Type ID (sys.contentType.sys.id) equals tag
```

### 5. Headers設定
**不要** (Deploy Hookは認証不要)

### 6. Payload設定
**Use default payload** を選択

## 🔄 Step 3: ハイブリッド設定（推奨）

### 既存のRevalidation Webhook
```
Name: Next.js Instant Update
URL: https://www.skillpedia.jp/api/revalidate
Purpose: 高速更新（5-10秒）
```

### 新しいDeploy Hook Webhook
```
Name: Vercel Auto Deploy
URL: [Vercel Deploy Hook URL]
Purpose: 確実な更新（1-3分）
```

## 🧪 Step 4: テスト実行

### 1. Deploy Hook単体テスト
```bash
curl -X POST [Vercel Deploy Hook URL]
```

### 2. Contentful側テスト
1. Webhook設定画面で **Test webhook** をクリック
2. Vercel Dashboardで新しいデプロイが開始されることを確認

### 3. 実際のコンテンツテスト
1. 任意の記事を編集
2. **Publish** をクリック
3. **5-10秒後**: Revalidationで即座更新
4. **1-3分後**: Deploy Hookで完全更新

## 📊 期待される動作

### タイムライン
```
0秒: Contentfulで Publish
↓
5-10秒: Revalidation完了 → サイト即座更新
↓
1-3分: Deploy Hook完了 → サイト完全更新
```

### メリット
- ✅ **即座更新**: Revalidationで高速反映
- ✅ **確実更新**: Deploy Hookで完全反映
- ✅ **冗長性**: 片方が失敗してももう片方で更新
- ✅ **キャッシュクリア**: Deploy Hookで全キャッシュクリア

## 🔍 トラブルシューティング

### Deploy Hookが動作しない場合
1. **URL確認**: Vercelで生成されたURLが正確か
2. **Branch確認**: 正しいブランチが指定されているか
3. **Project確認**: 正しいプロジェクトのHookか

### 両方のWebhookが動作しない場合
1. **Contentful Filters**: 正しく設定されているか
2. **Content Type ID**: 実際のIDと一致しているか
3. **Environment**: masterに設定されているか

## ✅ 完了確認

以下が正常に動作すれば設定完了：

1. ✅ Contentfulでコンテンツ編集・公開
2. ✅ 5-10秒後にサイト即座更新（Revalidation）
3. ✅ 1-3分後にVercelで新しいデプロイ開始
4. ✅ デプロイ完了後にサイト完全更新

---

**🎯 重要**: Deploy HookとRevalidationの併用により、高速性と確実性の両方を実現！

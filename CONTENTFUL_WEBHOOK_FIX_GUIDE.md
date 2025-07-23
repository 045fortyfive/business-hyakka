# Contentful Webhook 修正ガイド

## 🎯 問題
Contentfulで内容を保存しただけではページが更新されない（slugを変更した時だけ更新される）

## 🔍 原因
Contentful側のWebhook設定で「Entry published」イベントが無効になっている可能性

## 🛠️ 修正手順

### 1. Contentful管理画面にアクセス
1. [Contentful管理画面](https://app.contentful.com/)にログイン
2. 対象のSpace（vxy009lryi3x）を選択
3. **Settings > Webhooks** に移動

### 2. 既存Webhookの確認
既存のWebhookを見つけて「Edit」をクリック

### 3. 設定の確認・修正

#### URL設定
```
https://www.skillpedia.jp/api/revalidate
```

#### Headers設定
```
Key: Authorization
Value: Bearer ouRdtEWBClayl75vda53_B-MDOcqLB1DjiG0lIN-zpDoQ7ahBswgWZVDYycYl4bG
```

#### 🚨 重要: Events設定
以下のイベントが**すべて有効**になっているか確認：
- ✅ **Entry published** ← **これが最重要！**
- ✅ **Entry unpublished**
- ✅ **Entry deleted**

#### Filters設定
**Content types**:
- `content`
- `category` 
- `tag`

**Environments**:
- `master`

### 4. テスト実行

#### Contentful側でのテスト
1. Webhook設定画面で「Test webhook」をクリック
2. 成功レスポンス（200 OK）が返ることを確認

#### 実際のコンテンツでのテスト
1. 任意の記事を開く
2. タイトルや内容を少し変更
3. **「Publish」ボタンをクリック**
4. 10秒待つ
5. サイトをリフレッシュして変更が反映されているか確認

## 🎉 期待される動作

修正後は以下のようになります：

1. **Contentfulで記事を編集**
2. **「Publish」をクリック**
3. **5-10秒後にサイトに反映**

## 🔧 トラブルシューティング

### Webhookが届かない場合
1. URL設定を再確認
2. Authorization Headerを再確認
3. Events設定で「Entry published」が有効か確認

### 更新が反映されない場合
1. ブラウザのハードリフレッシュ（Ctrl+F5 / Cmd+Shift+R）
2. 別のブラウザ/デバイスで確認
3. 10-30秒待ってから再確認

## 📊 確認方法

### ローカル環境でのWebhookテスト
```bash
# 開発サーバー起動
npm run dev

# Webhookテスト実行
curl -X POST http://localhost:3003/api/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"testType": "article_published"}'
```

### 本番環境でのWebhookテスト
```bash
curl -X POST https://www.skillpedia.jp/api/test-webhook \
  -H "Content-Type: application/json" \
  -d '{"testType": "article_published"}'
```

## ✅ 完了確認

以下が正常に動作すれば修正完了：

1. ✅ Contentfulでコンテンツを編集・公開
2. ✅ 5-10秒後にサイトに反映
3. ✅ slugを変更しなくても更新される
4. ✅ 全てのコンテンツタイプ（記事、動画、音声）で動作

---

**🎯 重要ポイント**: 「Entry published」イベントが有効になっていることが最も重要です！

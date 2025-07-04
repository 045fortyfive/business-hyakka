# Contentful コンテンツ作成ガイドライン

## 概要

このドキュメントは、Contentfulでコンテンツを作成する際のベストプラクティスとガイドラインを提供します。これらのガイドラインに従うことで、サイトの安定性とユーザー体験を向上させることができます。

## 🎯 基本原則

1. **一貫性**: 統一されたフォーマットを使用する
2. **安全性**: エラーを引き起こす可能性のあるパターンを避ける
3. **可読性**: 明確で理解しやすいコンテンツを作成する
4. **保守性**: 将来の変更に対応しやすい構造を維持する

## 📝 MDXコンテンツの作成ガイドライン

### ✅ 推奨パターン

#### カスタムスタイリングタグ

```mdx
<!-- 正しい使用例 -->
<YellowHighlight>重要なポイント</YellowHighlight>
<RedText>注意事項</RedText>
<CustomIns>追加情報</CustomIns>

<!-- 太字との組み合わせ -->
**<YellowHighlight>強調したい重要なポイント</YellowHighlight>**
```

#### コードブロック

```mdx
<!-- 正しい使用例 -->
<CodeBlock language="javascript">
const example = "Hello World";
console.log(example);
</CodeBlock>

<!-- マークダウン形式 -->
```javascript
const example = "Hello World";
console.log(example);
```
```

### ❌ 避けるべきパターン

#### 不正なタグの使用

```mdx
<!-- 避けるべき例 -->
<YellowHighlight></YellowHighlight>  <!-- 空のタグ -->
<YellowHighlight prop="value">テキスト</YellowHighlight>  <!-- 不正な属性 -->
<YellowHighlight>**テキスト**</YellowHighlight>**  <!-- 不正なネスト -->
**<YellowHighlight>テキスト**</YellowHighlight>  <!-- 壊れたネスト -->
```

#### 不正なコードブロック

```mdx
<!-- 避けるべき例 -->
<CodeBlock language="">  <!-- 空の言語指定 -->
<CodeBlock language="undefined">  <!-- 不正な言語指定 -->
<CodeBlock>  <!-- 言語指定なし -->

```undefined  <!-- 不正な言語指定 -->
```  <!-- 言語指定なし -->
```

## 🛠️ コンテンツタイプ別ガイドライン

### 記事（Articles）

#### 必須フィールド
- **title**: 明確で説明的なタイトル
- **slug**: URL-safe な文字列（英数字、ハイフンのみ）
- **category**: 適切なカテゴリの選択
- **mdxContent**: 適切にフォーマットされたMDXコンテンツ

#### 推奨フィールド
- **featuredImage**: 16:9比率の高品質画像
- **excerpt**: 150文字以内の要約
- **tags**: 関連するタグの設定

### 動画（Videos）

#### 必須フィールド
- **title**: 動画の内容を表すタイトル
- **videoUrl**: 有効なYouTube URL
- **category**: 適切なカテゴリの選択

### 音声（Audios）

#### 必須フィールド
- **title**: 音声コンテンツのタイトル
- **audioUrl**: 有効な音声ファイルURL
- **category**: 適切なカテゴリの選択

## 🎨 画像ガイドライン

### 推奨仕様
- **フォーマット**: JPEG, PNG, WebP
- **アスペクト比**: 16:9 (1920x1080, 1280x720など)
- **ファイルサイズ**: 1MB以下
- **解像度**: 最低1280x720px

### 画像がない場合
システムが自動的に以下を提供します：
- カテゴリに応じたプレースホルダー画像
- グラデーション背景
- 適切なアイコン表示

## 🔧 トラブルシューティング

### よくある問題と解決方法

#### 1. MDXコンパイルエラー
**症状**: ページが表示されない、エラーメッセージが表示される
**解決方法**:
- カスタムタグの正しい使用を確認
- 太字とカスタムタグの混在パターンを修正
- 空のタグを削除

#### 2. コードブロックエラー
**症状**: コードが正しく表示されない
**解決方法**:
- 言語指定を確認（javascript, python, bashなど）
- コードブロックの開始・終了タグを確認
- 特殊文字のエスケープを確認

#### 3. 画像表示問題
**症状**: 画像が表示されない
**解決方法**:
- 画像URLの有効性を確認
- ファイル形式とサイズを確認
- 画像なしでも適切なプレースホルダーが表示されることを確認

## 📊 品質チェックリスト

### 公開前チェック
- [ ] タイトルが適切に設定されている
- [ ] スラッグがURL-safeである
- [ ] カテゴリが選択されている
- [ ] MDXコンテンツにエラーがない
- [ ] 画像が適切に設定されている（または意図的に未設定）
- [ ] プレビューで正常に表示される

### MDXコンテンツチェック
- [ ] カスタムタグが正しく使用されている
- [ ] コードブロックに適切な言語指定がある
- [ ] 太字とカスタムタグの混在がない
- [ ] 空のタグがない
- [ ] 不正な属性がない

## 🚀 パフォーマンス最適化

### 推奨事項
1. **画像最適化**: 適切なサイズと形式を使用
2. **コンテンツ長**: 適度な長さを維持（5000文字以内推奨）
3. **タグ使用**: 過度なカスタムタグの使用を避ける
4. **構造化**: 見出しを適切に使用してコンテンツを構造化

## 📞 サポート

問題が発生した場合は、以下の情報を含めて報告してください：
- コンテンツタイプ（記事、動画、音声）
- エラーメッセージ
- 問題のあるコンテンツのスラッグ
- 使用しているMDXパターン

## 📚 参考資料

- [MDX公式ドキュメント](https://mdxjs.com/)
- [Contentful公式ドキュメント](https://www.contentful.com/developers/docs/)
- [React Syntax Highlighter](https://github.com/react-syntax-highlighter/react-syntax-highlighter)

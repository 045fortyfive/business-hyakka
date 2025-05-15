import { getEnvironmentStatus, getLatestContent, getCategories } from "@/lib/contentful"
import Link from "next/link"

export default async function DebugPage() {
  const status = getEnvironmentStatus()

  // Contentfulからデータを取得してみる
  let contentfulData = null
  let error = null

  try {
    const [latestContent, categories] = await Promise.all([getLatestContent(3, false), getCategories(false)])

    contentfulData = {
      latestContent: latestContent.map((item) => ({
        id: item.id,
        title: item.title,
        slug: item.slug,
        type: item.type,
      })),
      categories: categories.map((cat) => ({
        id: cat.id,
        name: cat.name,
        slug: cat.slug,
      })),
    }
  } catch (err) {
    error = err instanceof Error ? err.message : String(err)
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">環境変数とContentfulデバッグ</h1>

      {status.useMockData && (
        <div className="bg-yellow-100 p-4 rounded-lg mb-6">
          <p className="font-bold">注意: モックデータを使用しています</p>
          <p className="mt-2">
            現在、アプリケーションはContentfulからのデータではなく、モックデータを使用しています。
            実際のContentfulデータを使用するには、
            <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_USE_MOCK_DATA=false</code> を設定し、
            有効なContentful認証情報を提供してください。
          </p>
        </div>
      )}

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">環境変数の状態</h2>
        <ul className="space-y-2">
          <li>
            <strong>モックデータの使用:</strong> {status.useMockData ? "はい" : "いいえ"}
          </li>
          <li>
            <strong>NEXT_PUBLIC_USE_MOCK_DATA:</strong> {status.nextPublicUseMockData || "未設定"}
          </li>
          <li>
            <strong>CONTENTFUL_SPACE_ID:</strong> {status.contentfulSpaceId}
          </li>
          <li>
            <strong>CONTENTFUL_ACCESS_TOKEN:</strong> {status.contentfulAccessToken}
          </li>
          <li>
            <strong>CONTENTFUL_PREVIEW_ACCESS_TOKEN:</strong> {status.contentfulPreviewAccessToken}
          </li>
        </ul>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">Contentfulデータテスト</h2>
        {error ? (
          <div className="text-red-500">
            <p className="font-bold">エラーが発生しました:</p>
            <p>{error}</p>
          </div>
        ) : contentfulData ? (
          <div>
            <h3 className="font-medium mb-2">最新コンテンツ ({contentfulData.latestContent.length}件):</h3>
            {contentfulData.latestContent.length > 0 ? (
              <ul className="list-disc pl-5 mb-4">
                {contentfulData.latestContent.map((item) => (
                  <li key={item.id}>
                    {item.title} (タイプ: {item.type}, スラッグ: {item.slug})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-yellow-600 mb-4">コンテンツが見つかりませんでした。</p>
            )}

            <h3 className="font-medium mb-2">カテゴリ ({contentfulData.categories.length}件):</h3>
            {contentfulData.categories.length > 0 ? (
              <ul className="list-disc pl-5">
                {contentfulData.categories.map((cat) => (
                  <li key={cat.id}>
                    {cat.name} (スラッグ: {cat.slug})
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-yellow-600">カテゴリが見つかりませんでした。</p>
            )}
          </div>
        ) : (
          <p>データを取得中...</p>
        )}
      </div>

      <div className="bg-blue-100 p-4 rounded-lg mb-6">
        <h2 className="text-lg font-semibold mb-2">詳細診断ツール</h2>
        <ul className="space-y-2">
          <li>
            <Link href="/debug/content-model" className="text-blue-600 hover:underline">
              Contentfulコンテンツモデルを確認する →
            </Link>
          </li>
          <li>
            <Link href="/debug/contentful-test" className="text-blue-600 hover:underline">
              Contentful接続テストを実行する →
            </Link>
          </li>
        </ul>
      </div>

      <div className="bg-gray-100 p-4 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">トラブルシューティング</h2>
        <ol className="list-decimal pl-5 space-y-2">
          <li>
            <strong>モックデータを無効にするには:</strong>{" "}
            <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_USE_MOCK_DATA=false</code>{" "}
            を環境変数に設定してください。
          </li>
          <li>
            <strong>Contentful APIキーを確認:</strong>{" "}
            Contentfulの管理画面で正しいAPIキーが生成されていることを確認してください。
          </li>
          <li>
            <strong>コンテンツモデルを確認:</strong>{" "}
            Contentfulのコンテンツモデルが正しく設定されていることを確認してください。
          </li>
          <li>
            <strong>キャッシュをクリア:</strong> ブラウザのキャッシュをクリアするか、開発サーバーを再起動してください。
          </li>
          <li>
            <strong>コンテンツの公開状態を確認:</strong> Contentfulでコンテンツが公開されていることを確認してください。
          </li>
        </ol>
      </div>
    </div>
  )
}

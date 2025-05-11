import { checkContentModel } from "@/lib/contentful"

export default async function ContentModelPage() {
  const contentModelInfo = await checkContentModel()

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Contentfulコンテンツモデル</h1>

      {contentModelInfo.status === "using_mock_data" ? (
        <div className="bg-yellow-100 p-4 rounded-lg">
          <p>{contentModelInfo.message}</p>
          <p className="mt-2">
            実際のContentfulデータを使用するには、
            <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_USE_MOCK_DATA=false</code> を設定してください。
          </p>
        </div>
      ) : contentModelInfo.status === "error" ? (
        <div className="bg-red-100 p-4 rounded-lg">
          <p className="font-bold text-red-600">エラーが発生しました:</p>
          <p>{contentModelInfo.message}</p>

          {contentModelInfo.stack && (
            <div className="mt-4">
              <p className="font-semibold">スタックトレース:</p>
              <pre className="bg-gray-800 text-white p-3 rounded text-xs overflow-x-auto mt-2">
                {contentModelInfo.stack}
              </pre>
            </div>
          )}

          {contentModelInfo.rawResponse && (
            <div className="mt-4">
              <p className="font-semibold">生のレスポンス:</p>
              <pre className="bg-gray-800 text-white p-3 rounded text-xs overflow-x-auto mt-2">
                {contentModelInfo.rawResponse}
              </pre>
            </div>
          )}

          <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
            <p className="font-semibold">トラブルシューティング:</p>
            <ul className="list-disc pl-5 mt-2">
              <li>Contentful APIキーが正しいことを確認してください</li>
              <li>Contentfulスペースが存在し、アクセス可能であることを確認してください</li>
              <li>ネットワーク接続を確認してください</li>
              <li>Contentfulの管理画面でコンテンツモデルが正しく設定されていることを確認してください</li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-4">
            以下はContentfulのコンテンツモデルの詳細です。アプリケーションのコードと一致していることを確認してください。
          </p>

          {contentModelInfo.contentModel && contentModelInfo.contentModel.length > 0 ? (
            contentModelInfo.contentModel.map((contentType) => (
              <div key={contentType.id} className="mb-8 bg-gray-100 p-4 rounded-lg">
                <h2 className="text-xl font-semibold mb-2">
                  {contentType.name} ({contentType.id})
                </h2>
                {contentType.description && <p className="text-gray-600 mb-4">{contentType.description}</p>}

                <h3 className="font-medium mb-2">フィールド:</h3>
                {contentType.fields && contentType.fields.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                      <thead>
                        <tr className="bg-gray-200">
                          <th className="py-2 px-4 text-left">ID</th>
                          <th className="py-2 px-4 text-left">名前</th>
                          <th className="py-2 px-4 text-left">タイプ</th>
                          <th className="py-2 px-4 text-left">必須</th>
                          <th className="py-2 px-4 text-left">ローカライズ</th>
                          <th className="py-2 px-4 text-left">リンクタイプ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contentType.fields.map((field) => (
                          <tr key={field.id} className="border-b">
                            <td className="py-2 px-4">{field.id}</td>
                            <td className="py-2 px-4">{field.name}</td>
                            <td className="py-2 px-4">{field.type}</td>
                            <td className="py-2 px-4">{field.required ? "はい" : "いいえ"}</td>
                            <td className="py-2 px-4">{field.localized ? "はい" : "いいえ"}</td>
                            <td className="py-2 px-4">{field.linkType || "-"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-yellow-600">このコンテンツタイプにはフィールドがありません。</p>
                )}
              </div>
            ))
          ) : (
            <div className="bg-yellow-100 p-4 rounded-lg">
              <p>
                コンテンツモデルが見つかりませんでした。Contentfulスペースにコンテンツモデルが定義されていることを確認してください。
              </p>
            </div>
          )}
        </div>
      )}

      <div className="mt-6">
        <h2 className="text-lg font-semibold mb-2">コンテンツモデルの確認ポイント</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>content</strong> タイプには、<code className="bg-gray-200 px-1 rounded">contentType</code>{" "}
            フィールドが必要です。 このフィールドは <code className="bg-gray-200 px-1 rounded">article</code>,{" "}
            <code className="bg-gray-200 px-1 rounded">video</code>,
            <code className="bg-gray-200 px-1 rounded">audio</code> のいずれかの値を持つ必要があります。
          </li>
          <li>
            <strong>category</strong> タイプには、<code className="bg-gray-200 px-1 rounded">name</code> と
            <code className="bg-gray-200 px-1 rounded">slug</code> フィールドが必要です。
          </li>
          <li>
            <strong>author</strong> タイプには、<code className="bg-gray-200 px-1 rounded">name</code>{" "}
            フィールドが必要です。
          </li>
          <li>
            <strong>tag</strong> タイプには、<code className="bg-gray-200 px-1 rounded">name</code> と
            <code className="bg-gray-200 px-1 rounded">slug</code> フィールドが必要です。
          </li>
        </ul>
      </div>

      <div className="mt-6">
        <a href="/debug" className="text-blue-600 hover:underline">
          ← デバッグホームに戻る
        </a>
      </div>
    </div>
  )
}

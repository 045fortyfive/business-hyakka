import { getClient, getEnvironmentStatus } from "@/lib/contentful"

export default async function ContentfulTestPage() {
  const status = getEnvironmentStatus()

  // モックデータを使用している場合は早期リターン
  if (status.useMockData) {
    return (
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-4">Contentful接続テスト</h1>

        <div className="bg-yellow-100 p-4 rounded-lg mb-6">
          <p className="font-bold">モックデータモードが有効です</p>
          <p className="mt-2">
            現在、アプリケーションはContentfulからのデータではなく、モックデータを使用しています。
            Contentful接続テストを実行するには、
            <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_USE_MOCK_DATA=false</code> を設定し、
            有効なContentful認証情報を提供してください。
          </p>
        </div>

        <div className="mt-6">
          <a href="/debug" className="text-blue-600 hover:underline">
            ← デバッグホームに戻る
          </a>
        </div>
      </div>
    )
  }

  const testResults = {
    connection: { status: "pending", message: "" },
    space: { status: "pending", message: "", data: null as any },
    contentTypes: { status: "pending", message: "", data: null as any },
    entries: { status: "pending", message: "", data: null as any },
  }

  try {
    // 1. 接続テスト
    const client = getClient(false)

    if (!client) {
      testResults.connection = {
        status: "error",
        message: "Contentfulクライアントの初期化に失敗しました。環境変数を確認してください。",
      }
    } else {
      testResults.connection = { status: "success", message: "Contentfulクライアントの初期化に成功しました" }

      // 2. スペース情報の取得
      try {
        const space = await client.getSpace()
        testResults.space = {
          status: "success",
          message: "スペース情報の取得に成功しました",
          data: {
            name: space.name,
            id: space.sys.id,
          },
        }
      } catch (error) {
        testResults.space = {
          status: "error",
          message: error instanceof Error ? error.message : String(error),
          data: null,
        }
      }

      // 3. コンテンツタイプの取得
      try {
        const contentTypes = await client.getContentTypes({ limit: 5 })
        testResults.contentTypes = {
          status: "success",
          message: "コンテンツタイプの取得に成功しました",
          data: {
            total: contentTypes.total,
            items: contentTypes.items.map((type) => ({
              id: type.sys.id,
              name: type.name,
            })),
          },
        }
      } catch (error) {
        testResults.contentTypes = {
          status: "error",
          message: error instanceof Error ? error.message : String(error),
          data: null,
        }
      }

      // 4. エントリーの取得
      try {
        const entries = await client.getEntries({ limit: 5 })
        testResults.entries = {
          status: "success",
          message: "エントリーの取得に成功しました",
          data: {
            total: entries.total,
            items: entries.items.map((entry) => ({
              id: entry.sys.id,
              contentType: entry.sys.contentType.sys.id,
              updatedAt: entry.sys.updatedAt,
            })),
          },
        }
      } catch (error) {
        testResults.entries = {
          status: "error",
          message: error instanceof Error ? error.message : String(error),
          data: null,
        }
      }
    }
  } catch (error) {
    testResults.connection = {
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    }
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold mb-4">Contentful接続テスト</h1>

      <div className="space-y-6">
        {/* 接続テスト */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">1. Contentful接続テスト</h2>
          <div
            className={`p-3 rounded-lg ${testResults.connection.status === "success" ? "bg-green-100" : "bg-red-100"}`}
          >
            <p
              className={`font-medium ${
                testResults.connection.status === "success" ? "text-green-700" : "text-red-700"
              }`}
            >
              {testResults.connection.status === "success" ? "✅ 成功" : "❌ 失敗"}
            </p>
            <p>{testResults.connection.message}</p>
          </div>
        </div>

        {/* スペース情報 */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">2. スペース情報</h2>
          <div
            className={`p-3 rounded-lg ${
              testResults.space.status === "success"
                ? "bg-green-100"
                : testResults.space.status === "error"
                  ? "bg-red-100"
                  : "bg-gray-200"
            }`}
          >
            <p
              className={`font-medium ${
                testResults.space.status === "success"
                  ? "text-green-700"
                  : testResults.space.status === "error"
                    ? "text-red-700"
                    : "text-gray-700"
              }`}
            >
              {testResults.space.status === "success"
                ? "✅ 成功"
                : testResults.space.status === "error"
                  ? "❌ 失敗"
                  : "⏳ 保留中"}
            </p>
            <p>{testResults.space.message}</p>
            {testResults.space.data && (
              <div className="mt-2 p-2 bg-white rounded">
                <p>
                  <strong>スペース名:</strong> {testResults.space.data.name}
                </p>
                <p>
                  <strong>スペースID:</strong> {testResults.space.data.id}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* コンテンツタイプ */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">3. コンテンツタイプ</h2>
          <div
            className={`p-3 rounded-lg ${
              testResults.contentTypes.status === "success"
                ? "bg-green-100"
                : testResults.contentTypes.status === "error"
                  ? "bg-red-100"
                  : "bg-gray-200"
            }`}
          >
            <p
              className={`font-medium ${
                testResults.contentTypes.status === "success"
                  ? "text-green-700"
                  : testResults.contentTypes.status === "error"
                    ? "text-red-700"
                    : "text-gray-700"
              }`}
            >
              {testResults.contentTypes.status === "success"
                ? "✅ 成功"
                : testResults.contentTypes.status === "error"
                  ? "❌ 失敗"
                  : "⏳ 保留中"}
            </p>
            <p>{testResults.contentTypes.message}</p>
            {testResults.contentTypes.data && (
              <div className="mt-2">
                <p>
                  <strong>合計:</strong> {testResults.contentTypes.data.total}件
                </p>
                {testResults.contentTypes.data.items.length > 0 && (
                  <div className="mt-2 p-2 bg-white rounded">
                    <p className="font-medium mb-1">最初の{testResults.contentTypes.data.items.length}件:</p>
                    <ul className="list-disc pl-5">
                      {testResults.contentTypes.data.items.map((type) => (
                        <li key={type.id}>
                          {type.name} (ID: {type.id})
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* エントリー */}
        <div className="bg-gray-100 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">4. エントリー</h2>
          <div
            className={`p-3 rounded-lg ${
              testResults.entries.status === "success"
                ? "bg-green-100"
                : testResults.entries.status === "error"
                  ? "bg-red-100"
                  : "bg-gray-200"
            }`}
          >
            <p
              className={`font-medium ${
                testResults.entries.status === "success"
                  ? "text-green-700"
                  : testResults.entries.status === "error"
                    ? "text-red-700"
                    : "text-gray-700"
              }`}
            >
              {testResults.entries.status === "success"
                ? "✅ 成功"
                : testResults.entries.status === "error"
                  ? "❌ 失敗"
                  : "⏳ 保留中"}
            </p>
            <p>{testResults.entries.message}</p>
            {testResults.entries.data && (
              <div className="mt-2">
                <p>
                  <strong>合計:</strong> {testResults.entries.data.total}件
                </p>
                {testResults.entries.data.items.length > 0 && (
                  <div className="mt-2 p-2 bg-white rounded">
                    <p className="font-medium mb-1">最初の{testResults.entries.data.items.length}件:</p>
                    <ul className="list-disc pl-5">
                      {testResults.entries.data.items.map((entry) => (
                        <li key={entry.id}>
                          ID: {entry.id}, コンテンツタイプ: {entry.contentType}, 更新日:{" "}
                          {new Date(entry.updatedAt).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <a href="/debug" className="text-blue-600 hover:underline">
          ← デバッグホームに戻る
        </a>
      </div>
    </div>
  )
}

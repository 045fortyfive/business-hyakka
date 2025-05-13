import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">404 - ページが見つかりません</h1>
      <p className="text-gray-600 mb-8">
        お探しのページは存在しないか、移動した可能性があります。
      </p>
      <div className="flex justify-center space-x-4">
        <Link
          href="/"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          ホームに戻る
        </Link>
        <Link
          href="/categories"
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          カテゴリ一覧を見る
        </Link>
      </div>
    </div>
  );
}

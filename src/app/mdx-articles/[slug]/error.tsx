'use client';

import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="bg-red-50 border border-red-200 p-8 rounded-lg text-center mb-8">
        <h2 className="text-xl font-bold text-red-700 mb-2">エラーが発生しました</h2>
        <p className="text-red-600 mb-4">
          記事の読み込み中に問題が発生しました。しばらくしてからもう一度お試しください。
        </p>
        <div className="flex justify-center gap-4">
          <button
            onClick={() => reset()}
            className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            再試行
          </button>
          <Link
            href="/"
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
          >
            ホームに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

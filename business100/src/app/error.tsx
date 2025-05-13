'use client';

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // エラーをログに記録
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-16 text-center">
      <h1 className="text-4xl font-bold mb-4">エラーが発生しました</h1>
      <p className="text-gray-600 mb-8">
        申し訳ありませんが、予期せぬエラーが発生しました。
      </p>
      <div className="flex justify-center space-x-4">
        <button
          onClick={reset}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          もう一度試す
        </button>
        <Link
          href="/"
          className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  );
}

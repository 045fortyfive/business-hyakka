'use client';

import { useEffect, useState } from 'react';
import { extractYouTubeId } from '@/lib/utils';

interface VideoPlayerProps {
  src: string;
  title: string;
  className?: string;
}

export default function VideoPlayer({ src, title, className = "" }: VideoPlayerProps) {
  const [isClient, setIsClient] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // YouTubeの埋め込みコードを生成
  const getEmbedCode = () => {
    if (!src) return null;

    // YouTube URLの場合
    const youtubeId = extractYouTubeId(src);
    if (youtubeId) {
      // YouTube埋め込みURLに追加パラメータを設定
      return `https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1&showinfo=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0`;
    }

    // その他の場合は直接URLを使用
    return src;
  };

  // iframeの読み込み完了を処理
  const handleIframeLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  // iframeの読み込みエラーを処理
  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  // クライアントサイドでのみレンダリングするために使用
  useEffect(() => {
    setIsClient(true);
  }, []);

  // srcが変更された時にリセット
  useEffect(() => {
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  // サーバーサイドレンダリング時は何も表示しない
  if (!isClient) {
    return (
      <div className={`w-full bg-gray-200 rounded-lg ${className}`}
           style={{ aspectRatio: '16 / 9', minHeight: '300px' }}>
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-500">動画を読み込んでいます...</p>
        </div>
      </div>
    );
  }

  const embedUrl = getEmbedCode();

  // URLが無効な場合
  if (!embedUrl) {
    return (
      <div className={`w-full bg-red-50 border border-red-200 rounded-lg ${className}`}
           style={{ aspectRatio: '16 / 9', minHeight: '300px' }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-red-600 font-medium">動画URLが無効です</p>
            <p className="text-red-500 text-sm mt-1">有効なYouTube URLを設定してください</p>
          </div>
        </div>
      </div>
    );
  }

  // エラーが発生した場合
  if (hasError) {
    return (
      <div className={`w-full bg-yellow-50 border border-yellow-200 rounded-lg ${className}`}
           style={{ aspectRatio: '16 / 9', minHeight: '300px' }}>
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <p className="text-yellow-700 font-medium">動画の読み込みに失敗しました</p>
            <p className="text-yellow-600 text-sm mt-1">しばらくしてからもう一度お試しください</p>
            <button
              onClick={() => {
                setHasError(false);
                setIsLoading(true);
              }}
              className="mt-3 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm"
            >
              再読み込み
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      {/* レスポンシブ動画コンテナ */}
      <div
        className="relative w-full rounded-lg overflow-hidden shadow-lg bg-black"
        style={{ aspectRatio: '16 / 9' }}
      >
        {/* 読み込み中のオーバーレイ */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-200 flex items-center justify-center z-10">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
              <p className="text-gray-600 text-sm">動画を読み込んでいます...</p>
            </div>
          </div>
        )}

        <iframe
          src={embedUrl}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0"
          style={{
            width: '100%',
            height: '100%',
            aspectRatio: '16 / 9'
          }}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
          loading="lazy"
        />
      </div>
    </div>
  );
}

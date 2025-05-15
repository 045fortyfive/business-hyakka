'use client';

import { useEffect, useState } from 'react';
import { extractYouTubeId } from '@/lib/utils';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
}

export default function VideoPlayer({ videoUrl, title }: VideoPlayerProps) {
  const [isClient, setIsClient] = useState(false);
  
  // YouTubeの埋め込みコードを生成
  const getEmbedCode = () => {
    // YouTube URLの場合
    const youtubeId = extractYouTubeId(videoUrl);
    if (youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}?rel=0`;
    }
    
    // その他の場合は直接URLを使用
    return videoUrl;
  };
  
  // クライアントサイドでのみレンダリングするために使用
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // サーバーサイドレンダリング時は何も表示しない
  if (!isClient) {
    return (
      <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg flex items-center justify-center">
        <p className="text-gray-500">動画を読み込んでいます...</p>
      </div>
    );
  }
  
  return (
    <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
      <iframe
        src={getEmbedCode()}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full"
      ></iframe>
    </div>
  );
}

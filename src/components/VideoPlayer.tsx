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
  
  // YouTubeの埋め込みコードを生成
  const getEmbedCode = () => {
    // YouTube URLの場合
    const youtubeId = extractYouTubeId(src);
    if (youtubeId) {
      return `https://www.youtube.com/embed/${youtubeId}?rel=0`;
    }
    
    // その他の場合は直接URLを使用
    return src;
  };
  
  // クライアントサイドでのみレンダリングするために使用
  useEffect(() => {
    setIsClient(true);
  }, []);
  
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
  
  return (
    <div className={`w-full ${className}`}>
      {/* レスポンシブ動画コンテナ */}
      <div 
        className="relative w-full rounded-lg overflow-hidden shadow-lg bg-black"
        style={{ aspectRatio: '16 / 9' }}
      >
        <iframe
          src={getEmbedCode()}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full border-0"
          style={{ 
            width: '100%', 
            height: '100%',
            aspectRatio: '16 / 9'
          }}
        />
      </div>
    </div>
  );
}

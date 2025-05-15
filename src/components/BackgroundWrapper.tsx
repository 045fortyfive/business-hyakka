'use client';

import { useBackground, backgroundColorClasses } from '@/contexts/BackgroundContext';
import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

// オーロラ背景をクライアントサイドのみでレンダリングするために動的インポート
const AuroraBackground = dynamic(
  () => import('@/components/card-samples/aurora-background'),
  { ssr: false }
);

export default function BackgroundWrapper({ children }: { children: React.ReactNode }) {
  const { settings } = useBackground();
  const { color, useAurora, auroraSpeed, auroraBlend } = settings;

  // クライアントサイドでのみレンダリングするための状態
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // サーバーサイドレンダリング時は白背景を使用し、
  // クライアントサイドでマウント後に実際の背景色を適用
  const bgClass = isMounted
    ? backgroundColorClasses[color]
    : 'bg-white text-gray-900'; // サーバーサイドでの初期値

  return (
    <div className={`relative min-h-screen w-full ${bgClass}`}>
      {/* オーロラ背景 - クライアントサイドでのみレンダリング */}
      {isMounted && useAurora && (
        <AuroraBackground speed={auroraSpeed} blend={auroraBlend} />
      )}

      {/* コンテンツ */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}

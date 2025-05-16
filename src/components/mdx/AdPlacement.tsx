'use client';

import React from 'react';
import Advertisement from '../Advertisement';

interface AdPlacementProps {
  id?: string;
  position?: 'inline' | 'sidebar' | 'footer';
}

export default function AdPlacement({ id, position = 'inline' }: AdPlacementProps) {
  // 広告IDが指定されている場合は、その広告を表示
  // 実際の実装では、IDを使用してContentfulから広告データを取得する
  // ここではデモ用のハードコードされた広告を表示
  
  // 広告IDに基づいて広告データを取得する関数
  // 実際の実装では、Contentfulから広告データを取得する
  const getAdData = (adId?: string) => {
    // デモ用の広告データ
    const demoAds = {
      'demo-ad-1': {
        title: 'ビジネススキルアップセミナー',
        description: '最新のビジネストレンドを学び、キャリアアップを目指しましょう。',
        imageUrl: 'https://placehold.co/600x400/e2e8f0/1e293b?text=ビジネスセミナー広告',
        linkUrl: 'https://example.com/seminar',
        altText: 'ビジネスセミナーの広告',
      },
      'demo-ad-2': {
        title: '新刊書籍のご案内',
        description: 'ビジネスリーダーのための必読書が新登場！',
        imageUrl: 'https://placehold.co/600x400/e2e8f0/1e293b?text=書籍広告',
        linkUrl: 'https://example.com/book',
        altText: '新刊書籍の広告',
      },
    };
    
    // 広告IDが指定されていて、対応する広告データがある場合はそれを返す
    if (adId && demoAds[adId as keyof typeof demoAds]) {
      return demoAds[adId as keyof typeof demoAds];
    }
    
    // 広告IDが指定されていない場合は、ランダムな広告を返す
    const adIds = Object.keys(demoAds);
    const randomAdId = adIds[Math.floor(Math.random() * adIds.length)];
    return demoAds[randomAdId as keyof typeof demoAds];
  };
  
  return <Advertisement position={position} adData={getAdData(id)} />;
}

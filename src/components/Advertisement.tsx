'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface AdvertisementProps {
  position?: 'inline' | 'sidebar' | 'footer';
  adCode?: string;
  adData?: {
    title?: string;
    description?: string;
    imageUrl?: string;
    linkUrl?: string;
    altText?: string;
  };
}

export default function Advertisement({ 
  position = 'inline', 
  adCode, 
  adData 
}: AdvertisementProps) {
  const [isClient, setIsClient] = useState(false);
  
  // クライアントサイドでのみレンダリングするために使用
  useEffect(() => {
    setIsClient(true);
  }, []);

  // サーバーサイドレンダリング時は何も表示しない
  if (!isClient) {
    return null;
  }

  // 広告コードが提供されている場合は、そのまま表示
  if (adCode) {
    return (
      <div 
        className={`advertisement advertisement-${position} my-6`}
        dangerouslySetInnerHTML={{ __html: adCode }}
      />
    );
  }

  // 広告データが提供されている場合は、カスタム広告を表示
  if (adData) {
    const { title, description, imageUrl, linkUrl, altText } = adData;
    
    // 広告のスタイルをポジションに応じて調整
    const adStyles = {
      inline: 'w-full bg-gray-50 rounded-lg overflow-hidden shadow-sm',
      sidebar: 'w-full bg-gray-50 rounded-lg overflow-hidden shadow-sm',
      footer: 'w-full bg-gray-50 rounded-lg overflow-hidden shadow-sm',
    };
    
    return (
      <div className={`advertisement advertisement-${position} my-6 ${adStyles[position]}`}>
        <Link href={linkUrl || '#'} target="_blank" rel="noopener noreferrer" className="block">
          {imageUrl && (
            <div className="relative w-full h-40">
              <Image
                src={imageUrl}
                alt={altText || title || '広告'}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 300px"
              />
              <div className="absolute top-2 right-2 bg-gray-800 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                広告
              </div>
            </div>
          )}
          <div className="p-4">
            {title && <h3 className="font-bold text-lg mb-2">{title}</h3>}
            {description && <p className="text-sm text-gray-600">{description}</p>}
          </div>
        </Link>
      </div>
    );
  }

  // 広告コードも広告データも提供されていない場合は、プレースホルダーを表示
  return (
    <div className={`advertisement advertisement-${position} my-6 bg-gray-100 rounded-lg p-4 text-center text-gray-500`}>
      <p>広告スペース</p>
    </div>
  );
}

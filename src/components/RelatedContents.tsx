"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Content } from '@/lib/types';

interface RelatedContentsProps {
  contents: Content[];
}

export default function RelatedContents({ contents }: RelatedContentsProps) {
  if (!contents || contents.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {contents.map((content) => {
        const { fields, sys } = content;
        const contentType = fields.contentType?.[0] || '記事';
        
        // コンテンツタイプに応じたリンク先を設定
        let linkUrl = '/';
        let linkText = '詳細を見る';
        let icon = '📄';
        
        switch (contentType) {
          case '記事':
            linkUrl = `/mdx-articles/${fields.slug}`;
            linkText = '記事を読む';
            icon = '📄';
            break;
          case '動画':
            linkUrl = `/videos/${fields.slug}`;
            linkText = '動画を見る';
            icon = '🎬';
            break;
          case '音声':
            linkUrl = `/audios/${fields.slug}`;
            linkText = '音声を聴く';
            icon = '🎧';
            break;
        }
        
        // サムネイル画像のURLを取得
        const thumbnailUrl = fields.thumbnail?.fields?.file?.url
          ? `https:${fields.thumbnail.fields.file.url}`
          : '/placeholder.svg';
        
        return (
          <div key={sys.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
            <div className="relative h-40">
              <Image
                src={thumbnailUrl}
                alt={fields.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 text-xs font-medium">
                {icon} {contentType}
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{fields.title}</h3>
              {fields.description && (
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">{fields.description}</p>
              )}
              <Link
                href={linkUrl}
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                {linkText}
              </Link>
            </div>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import React from 'react';
import Image from 'next/image';

interface FigureProps {
  src: string;
  alt?: string; // オプショナルに変更
  caption?: string;
  width?: number;
  height?: number;
}

export default function Figure({
  src,
  alt,
  caption,
  width = 1200,
  height = 630,
}: FigureProps) {
  // alt属性のフォールバック処理
  const safeAlt = alt || caption || 'Figure image';

  // src属性の検証
  if (!src) {
    return (
      <figure className="my-8">
        <div className="overflow-hidden rounded-lg shadow-md bg-gray-100 flex items-center justify-center h-64">
          <span className="text-gray-500">画像を読み込めませんでした</span>
        </div>
        {caption && (
          <figcaption className="text-center text-sm text-gray-500 mt-3">
            {caption}
          </figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-lg shadow-md">
        <Image
          src={src}
          alt={safeAlt}
          width={width}
          height={height}
          className="w-full"
          onError={(e) => {
            console.warn('Figure image failed to load:', src);
            // エラー時のフォールバック処理
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      </div>
      {caption && (
        <figcaption className="text-center text-sm text-gray-500 mt-3">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

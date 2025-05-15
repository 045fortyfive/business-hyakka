import React from 'react';
import Image from 'next/image';

interface FigureProps {
  src: string;
  alt: string;
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
  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-lg shadow-md">
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="w-full"
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

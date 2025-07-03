'use client';

import Image from 'next/image';
import { useState, useCallback } from 'react';
import { 
  optimizeContentfulImage, 
  generateResponsiveSrcSet, 
  generateBlurDataUrl, 
  generateImageAlt, 
  isValidImageUrl 
} from '@/utils/image-optimization';

interface CustomImageProps {
  src?: string;
  alt?: string;
  title?: string;
  description?: string;
  width?: number | string;
  height?: number | string;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  responsive?: boolean;
}

export default function CustomImage({
  src,
  alt,
  title,
  description,
  width,
  height,
  className = '',
  priority = false,
  quality = 80,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  fill = false,
  responsive = true
}: CustomImageProps) {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 2;

  // 画像の読み込みエラーハンドリング
  const handleError = useCallback(() => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setError(false);
      setLoading(true);
      // 少し遅延してリトライ
      setTimeout(() => {
        setLoading(false);
      }, 1000);
    } else {
      setError(true);
      setLoading(false);
    }
  }, [retryCount, maxRetries]);

  // 画像の読み込み完了ハンドリング
  const handleLoad = useCallback(() => {
    setLoading(false);
    setError(false);
  }, []);

  // 画像URLの検証
  if (!src || !isValidImageUrl(src)) {
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg p-8 my-4">
        <div className="text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span className="text-gray-500 text-sm block">画像が指定されていません</span>
        </div>
      </div>
    );
  }

  // エラー時の表示
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center bg-gray-100 rounded-lg p-8 my-4">
        <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.232 15.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span className="text-gray-500 text-sm block mb-1">画像を読み込めませんでした</span>
        {(title || alt || description) && (
          <span className="text-gray-400 text-xs">{generateImageAlt(title, description, alt)}</span>
        )}
        {retryCount < maxRetries && (
          <button 
            onClick={() => {
              setError(false);
              setLoading(true);
              setRetryCount(prev => prev + 1);
            }}
            className="mt-2 px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition-colors"
          >
            再試行
          </button>
        )}
      </div>
    );
  }

  // 画像の寸法決定
  const getImageDimensions = () => {
    if (width && height) {
      return {
        width: typeof width === 'string' ? parseInt(width) : width,
        height: typeof height === 'string' ? parseInt(height) : height,
      };
    }
    
    return {
      width: 800,
      height: 450,
    };
  };

  const dimensions = getImageDimensions();
  
  // 最適化された画像URLを生成
  const optimizedSrc = optimizeContentfulImage(src, {
    width: fill ? undefined : dimensions.width,
    height: fill ? undefined : dimensions.height,
    quality,
    format: 'webp'
  });

  // レスポンシブsrcSetを生成（レスポンシブモードの場合）
  const srcSet = responsive && !fill ? generateResponsiveSrcSet(src) : undefined;
  
  // ブラー用データURLを生成
  const blurDataURL = generateBlurDataUrl(src);
  
  // alt属性を生成
  const imageAlt = generateImageAlt(title, description, alt);

  return (
    <div className="my-6 relative">
      {/* ローディング表示 */}
      {loading && (
        <div 
          className="flex items-center justify-center bg-gray-100 rounded-lg animate-pulse absolute inset-0 z-10" 
          style={fill ? {} : { aspectRatio: `${dimensions.width}/${dimensions.height}` }}
        >
          <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      
      {/* メイン画像 */}
      <Image
        src={optimizedSrc}
        alt={imageAlt}
        title={title}
        width={fill ? undefined : dimensions.width}
        height={fill ? undefined : dimensions.height}
        fill={fill}
        className={`rounded-lg max-w-full h-auto transition-opacity duration-300 ${className} ${loading ? 'opacity-0' : 'opacity-100'}`}
        onLoad={handleLoad}
        onError={handleError}
        priority={priority}
        quality={quality}
        sizes={responsive ? sizes : undefined}
        srcSet={srcSet}
        placeholder="blur"
        blurDataURL={blurDataURL}
        // アクセシビリティの改善
        loading={priority ? 'eager' : 'lazy'}
      />
      
      {/* キャプション */}
      {(title || description) && (
        <figcaption className="text-sm text-gray-600 mt-2 text-center italic">
          {title && <span className="font-medium">{title}</span>}
          {title && description && <span className="mx-1">-</span>}
          {description && <span>{description}</span>}
        </figcaption>
      )}
    </div>
  );
}

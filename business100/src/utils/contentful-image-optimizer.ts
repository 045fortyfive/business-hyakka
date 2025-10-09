/**
 * Contentful画像最適化の統合ユーティリティ
 * PCでの高品質表示に特化した設定
 */

import { optimizeContentfulImage, generateResponsiveSrcSet, generateRetinaResponsiveSrcSet } from './image-optimization'

/**
 * PC向け高品質画像設定
 */
export const PC_HIGH_QUALITY_SETTINGS = {
  // カード画像用（適切な品質でクリアな表示）
  card: {
    quality: 75,
    format: 'webp' as const,
    sizes: '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
  },

  // ヒーロー画像用（高品質）
  hero: {
    quality: 82,
    format: 'webp' as const,
    sizes: '100vw'
  },

  // サムネイル用（バランス重視）
  thumbnail: {
    quality: 75,
    format: 'webp' as const,
    sizes: '(max-width: 640px) 50vw, (max-width: 768px) 33vw, 25vw'
  },

  // 記事内画像用（バランス重視）
  article: {
    quality: 75,
    format: 'webp' as const,
    sizes: '(max-width: 768px) 100vw, (max-width: 1024px) 80vw, 60vw'
  }
}

/**
 * PC向けContentful画像最適化
 * @param url 元の画像URL
 * @param type 画像の用途
 * @param customOptions カスタム設定
 */
export function optimizeForPC(
  url: string,
  type: keyof typeof PC_HIGH_QUALITY_SETTINGS,
  customOptions: {
    width?: number
    height?: number
    quality?: number
    format?: 'webp' | 'jpg' | 'png' | 'avif'
  } = {}
) {
  const settings = PC_HIGH_QUALITY_SETTINGS[type]
  
  return optimizeContentfulImage(url, {
    quality: customOptions.quality || settings.quality,
    format: customOptions.format || settings.format,
    width: customOptions.width,
    height: customOptions.height,
    fit: 'fill',
    focus: 'center'
  })
}

/**
 * PC向けレスポンシブsrcSet生成
 * @param url 元の画像URL
 * @param type 画像の用途
 */
export function generatePCResponsiveSrcSet(
  url: string,
  type: keyof typeof PC_HIGH_QUALITY_SETTINGS
) {
  const settings = PC_HIGH_QUALITY_SETTINGS[type]
  
  // PC向けの高解像度ブレークポイント
  const breakpoints = [640, 768, 1024, 1280, 1536, 1920, 2560]
  
  return breakpoints.map(width => {
    const optimizedUrl = optimizeContentfulImage(url, {
      width,
      quality: settings.quality,
      format: settings.format,
      fit: 'fill'
    })
    return `${optimizedUrl} ${width}w`
  }).join(', ')
}

/**
 * 高解像度ディスプレイ向けsrcSet生成
 * @param url 元の画像URL
 * @param baseWidth ベース幅
 * @param type 画像の用途
 */
export function generateRetinaForPC(
  url: string,
  baseWidth: number,
  type: keyof typeof PC_HIGH_QUALITY_SETTINGS
) {
  const settings = PC_HIGH_QUALITY_SETTINGS[type]
  const densities = [1, 1.5, 2, 3]
  
  return densities.map(density => {
    const width = Math.round(baseWidth * density)
    const optimizedUrl = optimizeContentfulImage(url, {
      width,
      quality: settings.quality,
      format: settings.format,
      fit: 'fill'
    })
    return `${optimizedUrl} ${density}x`
  }).join(', ')
}

/**
 * ブラープレースホルダー生成
 * @param url 元の画像URL
 * @returns ブラー画像URL
 */
export function generateBlurPlaceholder(url: string): string {
  return optimizeContentfulImage(url, {
    width: 10,
    height: 10,
    quality: 10,
    format: 'jpg'
  })
}

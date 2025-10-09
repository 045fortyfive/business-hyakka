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
    quality: 80,
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
  const densities = [1, 1.5, 2] // 1x, 1.5x, 2x対応

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
 * ブラー用プレースホルダー画像生成
 * @param url 元の画像URL
 */
export function generateBlurPlaceholder(url: string) {
  return optimizeContentfulImage(url, {
    width: 10,
    height: 10,
    quality: 10,
    format: 'jpg',
    fit: 'fill'
  })
}

/**
 * 画像の最適化設定を取得
 * @param type 画像の用途
 */
export function getImageSettings(type: keyof typeof PC_HIGH_QUALITY_SETTINGS) {
  return PC_HIGH_QUALITY_SETTINGS[type]
}

/**
 * Contentful画像URLの正規化
 * @param url 元のURL
 */
export function normalizeContentfulUrl(url: string): string {
  if (!url) return ''
  
  // //で始まるURLをhttps:に変換
  if (url.startsWith('//')) {
    return `https:${url}`
  }
  
  // 既にhttps:で始まっている場合はそのまま
  if (url.startsWith('https:')) {
    return url
  }
  
  // その他の場合はhttps://を追加
  return `https://${url}`
}

/**
 * 画像URLが有効かチェック
 * @param url チェックするURL
 */
export function isValidContentfulUrl(url: string): boolean {
  if (!url) return false
  
  try {
    const normalizedUrl = normalizeContentfulUrl(url)
    const urlObj = new URL(normalizedUrl)
    return urlObj.hostname.includes('ctfassets.net')
  } catch {
    return false
  }
}

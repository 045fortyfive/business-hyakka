/**
 * Contentful画像最適化ユーティリティ
 */

interface ImageOptimizationOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'webp' | 'jpg' | 'png' | 'avif';
  fit?: 'pad' | 'fill' | 'scale' | 'crop' | 'thumb';
  focus?: 'center' | 'top' | 'right' | 'left' | 'bottom' | 'top_right' | 'top_left' | 'bottom_right' | 'bottom_left' | 'face' | 'faces';
}

/**
 * ContentfulのアセットURLを最適化されたURLに変換
 * @param originalUrl 元の画像URL
 * @param options 最適化オプション
 * @returns 最適化された画像URL
 */
export function optimizeContentfulImage(
  originalUrl: string, 
  options: ImageOptimizationOptions = {}
): string {
  if (!originalUrl) return '';

  // URLの正規化
  let url = originalUrl;
  if (url.startsWith('//')) {
    url = `https:${url}`;
  }

  // Contentfulの画像URLでない場合はそのまま返す
  if (!url.includes('images.ctfassets.net')) {
    return url;
  }

  // URLオブジェクトを作成
  const urlObj = new URL(url);
  
  // 最適化パラメータを追加
  const { 
    width, 
    height, 
    quality = 80, 
    format = 'webp', 
    fit = 'fill',
    focus = 'center'
  } = options;

  if (width) urlObj.searchParams.set('w', width.toString());
  if (height) urlObj.searchParams.set('h', height.toString());
  if (quality) urlObj.searchParams.set('q', quality.toString());
  if (format) urlObj.searchParams.set('fm', format);
  if (fit) urlObj.searchParams.set('fit', fit);
  if (focus) urlObj.searchParams.set('f', focus);

  return urlObj.toString();
}

/**
 * レスポンシブ画像のsrcSetを生成
 * @param originalUrl 元の画像URL
 * @param breakpoints ブレークポイントの配列
 * @returns srcSet文字列
 */
export function generateResponsiveSrcSet(
  originalUrl: string, 
  breakpoints: number[] = [640, 768, 1024, 1280, 1536]
): string {
  if (!originalUrl) return '';

  const srcSet = breakpoints.map(width => {
    const optimizedUrl = optimizeContentfulImage(originalUrl, { 
      width,
      format: 'webp',
      quality: 80 
    });
    return `${optimizedUrl} ${width}w`;
  }).join(', ');

  return srcSet;
}

/**
 * ブラー用のデータURLを生成
 * @param originalUrl 元の画像URL
 * @returns 小さなブラー画像のデータURL
 */
export function generateBlurDataUrl(originalUrl: string): string {
  if (!originalUrl) return '';

  // 非常に小さなサイズでブラー画像を生成
  const blurUrl = optimizeContentfulImage(originalUrl, {
    width: 10,
    height: 10,
    quality: 10,
    format: 'jpg'
  });

  // 実際の実装では、この画像をbase64に変換してデータURLとして返す
  // 今回は簡単な実装として、そのままURLを返す
  return blurUrl;
}

/**
 * 画像のalt属性を生成
 * @param title 画像のタイトル
 * @param description 画像の説明
 * @param fallback フォールバック文字列
 * @returns alt属性の文字列
 */
export function generateImageAlt(
  title?: string, 
  description?: string, 
  fallback: string = ''
): string {
  if (title && description) {
    return `${title} - ${description}`;
  }
  
  return title || description || fallback;
}

/**
 * 画像URLが有効かチェック
 * @param url チェックする画像URL
 * @returns 有効かどうか
 */
export function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  
  try {
    const urlObj = new URL(url.startsWith('//') ? `https:${url}` : url);
    return urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
  } catch {
    return false;
  }
}

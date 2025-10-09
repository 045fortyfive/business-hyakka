import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js Middleware for Contentful Preview Mode
 * Live Preview対応とセキュリティヘッダーの動的設定
 */

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const referer = request.headers.get('referer');
  const origin = request.headers.get('origin');
  const host = request.headers.get('host') || request.nextUrl.hostname;
  
  const isFromContentful = referer?.includes('contentful.com');
  
  // プレビューモードの検出
  const hasPreviewCookie = request.cookies.has('__prerender_bypass');
  const hasPreviewParam = searchParams.has('preview') || searchParams.has('secret');
  const isPreviewMode = hasPreviewCookie || hasPreviewParam;
  
  // ⭐ ドメイン制限: 本番ドメインでのプレビューを無効化
  const isProductionDomain = host?.includes('skillpedia.jp') && !host?.includes('localhost');
  
  // 本番ドメインでプレビューが要求された場合は拒否
  if (isProductionDomain && isPreviewMode && !isFromContentful) {
    console.warn('🚫 Preview mode blocked on production domain');
    console.warn(`🌍 Host: ${host}`);
    console.warn(`🔗 Referer: ${referer}`);
    
    // プレビュークッキーがある場合は削除
    const response = NextResponse.redirect(new URL(pathname, request.url));
    response.cookies.delete('__prerender_bypass');
    response.cookies.delete('__next_preview_data');
    return response;
  }
  
  console.log(`🔍 Middleware check: ${pathname}`);
  console.log(`📊 Preview mode: ${isPreviewMode}`);
  console.log(`🔗 From Contentful: ${isFromContentful}`);
  console.log(`🌍 Host: ${host}`);
  console.log(`🏭 Production domain: ${isProductionDomain}`);
  
  const response = NextResponse.next();
  
  // Contentful Live Preview からのアクセスの場合は特別なヘッダーを設定
  if (isFromContentful || isPreviewMode) {
    console.log('🎯 Setting Live Preview headers');
    
    // Live Preview用の緩いセキュリティ設定
    response.headers.set('X-Frame-Options', 'ALLOWALL');
    response.headers.set('Access-Control-Allow-Origin', 'https://app.contentful.com');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    // CSP を Live Preview 用に調整（GTM/GA許可）
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.contentful.com https://*.contentful.com https://www.googletagmanager.com https://*.googletagmanager.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "media-src 'self' https://downloads.ctfassets.net https://images.ctfassets.net https://*.ctfassets.net",
      "connect-src 'self' https://cdn.contentful.com https://api.contentful.com https://preview.contentful.com https://app.contentful.com https://*.contentful.com https://www.google-analytics.com https://www.googletagmanager.com https://*.googletagmanager.com",
      "frame-ancestors 'self' https://app.contentful.com https://*.contentful.com",
      "frame-src 'self' https://app.contentful.com https://*.contentful.com https://www.googletagmanager.com https://www.youtube.com https://www.youtube-nocookie.com",
      "object-src 'none'",
      "base-uri 'self'",
    ].join('; ');
    
    response.headers.set('Content-Security-Policy', csp);
  }
  
  // プレビューモードの場合は追加のヘッダーを設定
  if (isPreviewMode) {
    response.headers.set('X-Preview-Mode', 'true');
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
  }
  
  return response;
}

// Middleware を適用するパスの設定
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes that don't need middleware
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}

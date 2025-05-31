import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Next.js Middleware for Contentful Preview Mode
 * Live Preview対応とセキュリティヘッダーの動的設定
 */

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const referer = request.headers.get('referer');
  const isFromContentful = referer?.includes('contentful.com');
  
  // プレビューモードの検出
  const hasPreviewCookie = request.cookies.has('__prerender_bypass');
  const hasPreviewParam = searchParams.has('preview') || searchParams.has('secret');
  const isPreviewMode = hasPreviewCookie || hasPreviewParam;
  
  console.log(`🔍 Middleware check: ${pathname}`);
  console.log(`📊 Preview mode: ${isPreviewMode}`);
  console.log(`🔗 From Contentful: ${isFromContentful}`);
  
  const response = NextResponse.next();
  
  // Contentful Live Preview からのアクセスの場合は特別なヘッダーを設定
  if (isFromContentful || isPreviewMode) {
    console.log('🎯 Setting Live Preview headers');
    
    // Live Preview用の緩いセキュリティ設定
    response.headers.set('X-Frame-Options', 'ALLOWALL');
    response.headers.set('Access-Control-Allow-Origin', 'https://app.contentful.com');
    response.headers.set('Access-Control-Allow-Credentials', 'true');
    
    // CSP を Live Preview 用に調整
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://app.contentful.com https://*.contentful.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://cdn.contentful.com https://api.contentful.com https://preview.contentful.com https://app.contentful.com https://*.contentful.com",
      "frame-ancestors 'self' https://app.contentful.com https://*.contentful.com",
      "frame-src 'self' https://app.contentful.com https://*.contentful.com",
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

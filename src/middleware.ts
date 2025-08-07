import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// レガシーURLから新しいスキルカテゴリURLへのマッピング
const LEGACY_URL_REDIRECTS = {
  '/articles': '/categories/basic-business-skills',
  '/videos': '/categories/thinking-methods', 
  '/audios': '/categories/business-improvement',
  '/categories': '/', // カテゴリ一覧は新しいホームページへ
} as const;

// デフォルトのスキルカテゴリマッピング（コンテンツタイプ別）
const CONTENT_TYPE_TO_SKILL_MAPPING = {
  'article': 'basic-business-skills',
  'video': 'thinking-methods',
  'audio': 'business-improvement'
} as const;

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // レガシーURLのリダイレクト処理
  if (pathname in LEGACY_URL_REDIRECTS) {
    const redirectUrl = LEGACY_URL_REDIRECTS[pathname as keyof typeof LEGACY_URL_REDIRECTS];
    const newUrl = new URL(redirectUrl, request.url);
    
    // クエリパラメータを保持
    if (search) {
      newUrl.search = search;
    }
    
    console.log(`Redirecting legacy URL: ${pathname} -> ${redirectUrl}`);
    return NextResponse.redirect(newUrl, 301); // 永続的リダイレクト
  }

  // 個別コンテンツページのリダイレクト処理
  // /articles/[slug], /videos/[slug], /audios/[slug] -> /content/[slug]
  const contentTypeMatch = pathname.match(/^\/(articles|videos|audios)\/(.+)$/);
  if (contentTypeMatch) {
    const [, contentType, slug] = contentTypeMatch;
    const newUrl = new URL(`/content/${slug}`, request.url);
    
    // クエリパラメータを保持
    if (search) {
      newUrl.search = search;
    }
    
    console.log(`Redirecting content URL: ${pathname} -> /content/${slug}`);
    return NextResponse.redirect(newUrl, 301); // 永続的リダイレクト
  }

  // カテゴリページでのクエリパラメータ処理
  // /categories/[slug]?type=article などを適切に処理
  const categoryMatch = pathname.match(/^\/categories\/(.+)$/);
  if (categoryMatch && search.includes('type=')) {
    const url = new URL(request.url);
    const contentType = url.searchParams.get('type');
    
    if (contentType && contentType in CONTENT_TYPE_TO_SKILL_MAPPING) {
      // typeパラメータを削除して、適切なスキルカテゴリにリダイレクト
      url.searchParams.delete('type');
      
      // 既存のカテゴリスラグがスキルカテゴリでない場合は、コンテンツタイプに基づいてリダイレクト
      const skillCategory = CONTENT_TYPE_TO_SKILL_MAPPING[contentType as keyof typeof CONTENT_TYPE_TO_SKILL_MAPPING];
      const newUrl = new URL(`/categories/${skillCategory}`, request.url);
      
      // 他のクエリパラメータを保持
      for (const [key, value] of url.searchParams.entries()) {
        newUrl.searchParams.set(key, value);
      }
      
      console.log(`Redirecting category with type filter: ${pathname}?${search} -> /categories/${skillCategory}`);
      return NextResponse.redirect(newUrl, 302); // 一時的リダイレクト
    }
  }

  // その他のリクエストはそのまま通す
  return NextResponse.next();
}

// ミドルウェアを適用するパスを設定
export const config = {
  matcher: [
    // レガシーコンテンツタイプURL
    '/articles/:path*',
    '/videos/:path*', 
    '/audios/:path*',
    // カテゴリURL（クエリパラメータ付き）
    '/categories/:path*',
    // 除外するパス
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

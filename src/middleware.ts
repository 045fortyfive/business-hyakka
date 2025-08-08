import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SKILL_TO_CATEGORY_SLUG } from '@/lib/types';

// レガシーURLから新しいスキルカテゴリURLへのマッピング
const LEGACY_URL_REDIRECTS = {
  '/articles': '/categories/basic-business-skill', // 実カテゴリslug
  '/videos': '/categories/sikouhou',
  '/audios': '/categories/Business-improvement',
  '/categories': '/', // カテゴリ一覧はトップへ
} as const;

// デフォルトのスキルカテゴリマッピング（typeクエリ用）
const CONTENT_TYPE_TO_SKILL_MAPPING = {
  'article': 'basic-business-skill',
  'video': 'sikouhou',
  'audio': 'Business-improvement'
} as const;

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // レガシーURLのリダイレクト処理
  if (pathname in LEGACY_URL_REDIRECTS) {
    const redirectUrl = LEGACY_URL_REDIRECTS[pathname as keyof typeof LEGACY_URL_REDIRECTS];
    const newUrl = new URL(redirectUrl, request.url);
    if (search) newUrl.search = search; // クエリ保持
    return NextResponse.redirect(newUrl, 301);
  }

  // 個別コンテンツページ -> /content/[slug]
  const contentTypeMatch = pathname.match(/^\/(articles|videos|audios)\/(.+)$/);
  if (contentTypeMatch) {
    const [, , slug] = contentTypeMatch;
    const newUrl = new URL(`/content/${slug}`, request.url);
    if (search) newUrl.search = search;
    return NextResponse.redirect(newUrl, 301);
  }

  // /categories/[slug] の正規化: スキル表記/大小文字揺れをContentful実slugへ
  const catMatch = pathname.match(/^\/categories\/(.+)$/);
  if (catMatch) {
    const raw = catMatch[1];
    const mapped = (SKILL_TO_CATEGORY_SLUG as any)[raw] ?? (SKILL_TO_CATEGORY_SLUG as any)[raw.toLowerCase()];
    if (mapped && mapped !== raw) {
      const url = new URL(`/categories/${mapped}`, request.url);
      if (search) url.search = search;
      return NextResponse.redirect(url, 308);
    }
  }

  // /categories/[slug]?type=article など -> 実カテゴリslugへ
  const categoryMatch = pathname.match(/^\/categories\/(.+)$/);
  if (categoryMatch && search.includes('type=')) {
    const url = new URL(request.url);
    const contentType = url.searchParams.get('type');
    if (contentType && contentType in CONTENT_TYPE_TO_SKILL_MAPPING) {
      url.searchParams.delete('type');
      const skillCategory = CONTENT_TYPE_TO_SKILL_MAPPING[contentType as keyof typeof CONTENT_TYPE_TO_SKILL_MAPPING];
      const newUrl = new URL(`/categories/${skillCategory}`, request.url);
      // 他のクエリを保持
      for (const [key, value] of url.searchParams.entries()) newUrl.searchParams.set(key, value);
      return NextResponse.redirect(newUrl, 302);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/articles/:path*',
    '/videos/:path*',
    '/audios/:path*',
    '/categories/:path*',
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};

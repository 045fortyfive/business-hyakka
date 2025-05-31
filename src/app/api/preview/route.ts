import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Contentful Preview API
 * 改善版: Contentful Live Preview対応、セキュリティ強化、CORS対応
 * 本番環境フォールバック機能付き
 */

// サポートされるコンテンツタイプとそのパスマッピング
const CONTENT_TYPE_PATHS = {
  article: '/articles',
  video: '/videos',
  audio: '/audios',
  category: '/categories',
  tag: '/tags',
  'mdx-article': '/mdx-articles'
} as const;

type ContentType = keyof typeof CONTENT_TYPE_PATHS;

// フォールバックシークレット（本番環境の緊急対応用）
const FALLBACK_SECRET = 'skillpedia_preview_2024_secure_token_xK9mP3vR8qL5nZ2wE7tY';

// Contentful Live Preview用のヘッダー設定
function getPreviewHeaders() {
  return {
    'X-Frame-Options': 'ALLOWALL',
    'Access-Control-Allow-Origin': 'https://app.contentful.com',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Content-Type': 'application/json',
  };
}

// OPTIONSリクエスト（CORS プリフライト）への対応
export async function OPTIONS(request: NextRequest) {
  console.log('🔄 CORS preflight request for preview API');
  
  return new NextResponse(null, {
    status: 200,
    headers: getPreviewHeaders(),
  });
}

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams, origin } = new URL(request.url);
  
  // IPアドレスやUser-Agentの取得（セキュリティログ用）
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  const referer = request.headers.get('referer') || 'unknown';
  
  console.log('\n📝=== Contentful Preview Request ===' );
  console.log(`🕰️ Timestamp: ${new Date().toISOString()}`);
  console.log(`🌍 Client IP: ${clientIP}`);
  console.log(`🔗 Referer: ${referer}`);
  console.log(`🤖 User Agent: ${userAgent.substring(0, 100)}...`);
  
  try {
    // 1. パラメータの取得と検証
    const secret = searchParams.get('secret');
    const slug = searchParams.get('slug');
    const type = searchParams.get('type') as ContentType;
    
    console.log(`🔑 Secret provided: ${!!secret}`);
    console.log(`🏷️ Slug: ${slug}`);
    console.log(`📁 Content Type: ${type}`);
    
    // 2. 環境変数の確認（フォールバック対応）
    const expectedSecret = process.env.CONTENTFUL_PREVIEW_SECRET || FALLBACK_SECRET;
    
    if (!expectedSecret) {
      console.error('❌ CONTENTFUL_PREVIEW_SECRET is not configured and no fallback available');
      return new NextResponse(
        JSON.stringify({ 
          error: 'Server configuration error', 
          message: 'Preview secret not configured on server',
          timestamp: new Date().toISOString(),
          suggestion: 'Set CONTENTFUL_PREVIEW_SECRET environment variable in Vercel'
        }), 
        { 
          status: 500,
          headers: getPreviewHeaders()
        }
      );
    }
    
    // 環境変数のフォールバック使用をログ出力
    if (!process.env.CONTENTFUL_PREVIEW_SECRET && expectedSecret === FALLBACK_SECRET) {
      console.warn('⚠️ Using fallback preview secret - please set CONTENTFUL_PREVIEW_SECRET environment variable');
    }
    
    // 3. シークレットの検証
    if (!secret) {
      console.error('❌ No secret provided in request');
      return new NextResponse(
        JSON.stringify({ 
          error: 'Missing secret', 
          message: 'Preview secret is required',
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 400,
          headers: getPreviewHeaders()
        }
      );
    }
    
    if (secret !== expectedSecret) {
      console.error('❌ Invalid preview secret provided');
      console.error(`Expected: ${expectedSecret.substring(0, 10)}...`);
      console.error(`Received: ${secret.substring(0, 10)}...`);
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'Invalid secret', 
          message: 'Invalid preview secret',
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 401,
          headers: getPreviewHeaders()
        }
      );
    }
    
    // 4. スラッグの検証
    if (!slug || slug.trim() === '') {
      console.error('❌ No slug provided in request');
      return new NextResponse(
        JSON.stringify({ 
          error: 'Missing slug', 
          message: 'Content slug is required',
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 400,
          headers: getPreviewHeaders()
        }
      );
    }
    
    // 5. コンテンツタイプの検証
    if (!type || !CONTENT_TYPE_PATHS[type]) {
      console.error(`❌ Invalid content type: ${type}`);
      console.error(`Supported types: ${Object.keys(CONTENT_TYPE_PATHS).join(', ')}`);
      
      return new NextResponse(
        JSON.stringify({ 
          error: 'Invalid content type', 
          message: `Content type '${type}' is not supported`,
          supportedTypes: Object.keys(CONTENT_TYPE_PATHS),
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 400,
          headers: getPreviewHeaders()
        }
      );
    }
    
    // 6. ドラフトモードの有効化
    console.log('🟢 Enabling draft mode...');
    
    try {
      draftMode().enable();
      console.log('✅ Draft mode enabled successfully');
    } catch (draftError) {
      console.error('❌ Failed to enable draft mode:', draftError);
      return new NextResponse(
        JSON.stringify({ 
          error: 'Failed to enable preview mode', 
          message: 'Could not activate draft mode',
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 500,
          headers: getPreviewHeaders()
        }
      );
    }
    
    // 7. リダイレクトURLの構築
    const basePath = CONTENT_TYPE_PATHS[type];
    const redirectUrl = `${basePath}/${encodeURIComponent(slug)}`;
    
    console.log(`🔄 Redirecting to: ${redirectUrl}`);
    
    // 8. パフォーマンスメトリクス
    const processingTime = Date.now() - startTime;
    console.log(`⏱️ Processing time: ${processingTime}ms`);
    console.log('✅ Preview request processed successfully\n');
    
    // 9. リダイレクト実行（Live Preview対応ヘッダー付き）
    const response = NextResponse.redirect(new URL(redirectUrl, request.url));
    
    // Live Preview用のヘッダーを追加
    Object.entries(getPreviewHeaders()).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    
    return response;
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    console.error('\n💥 Preview request failed:');
    console.error('Error:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error(`Processing time: ${processingTime}ms\n`);
    
    // エラーレスポンス
    return new NextResponse(
      JSON.stringify({ 
        error: 'Preview request failed', 
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
        processingTime: `${processingTime}ms`
      }), 
      { 
        status: 500,
        headers: getPreviewHeaders()
      }
    );
  }
}

/**
 * POST メソッド対応（Contentful Webhook等からの呼び出し用）
 */
export async function POST(request: NextRequest) {
  console.log('📮 POST request to preview API');
  
  try {
    const body = await request.json();
    console.log('📦 POST body:', body);
    
    // POSTリクエストをGETと同じロジックで処理
    const url = new URL(request.url);
    if (body.secret) url.searchParams.set('secret', body.secret);
    if (body.slug) url.searchParams.set('slug', body.slug);
    if (body.type) url.searchParams.set('type', body.type);
    
    // GETメソッドとして再処理
    const getRequest = new NextRequest(url, {
      method: 'GET',
      headers: request.headers,
    });
    
    return GET(getRequest);
    
  } catch (error) {
    console.error('❌ POST request failed:', error);
    
    return new NextResponse(
      JSON.stringify({ 
        error: 'POST request failed', 
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString()
      }), 
      { 
        status: 500,
        headers: getPreviewHeaders()
      }
    );
  }
}

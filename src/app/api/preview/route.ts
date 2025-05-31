import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

/**
 * Contentful Preview API
 * 改善版: セキュリティ強化、エラーハンドリング改善、ログ機能充実
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

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams, origin } = new URL(request.url);
  
  // IPアドレスやUser-Agentの取得（セキュリティログ用）
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  console.log('\n📝=== Contentful Preview Request ===' );
  console.log(`🕰️ Timestamp: ${new Date().toISOString()}`);
  console.log(`🌍 Client IP: ${clientIP}`);
  console.log(`🤖 User Agent: ${userAgent.substring(0, 100)}...`);
  
  try {
    // 1. パラメータの取得と検証
    const secret = searchParams.get('secret');
    const slug = searchParams.get('slug');
    const type = searchParams.get('type') as ContentType;
    
    console.log(`🔑 Secret provided: ${!!secret}`);
    console.log(`🏷️ Slug: ${slug}`);
    console.log(`📁 Content Type: ${type}`);
    
    // 2. 環境変数の確認
    const expectedSecret = process.env.CONTENTFUL_PREVIEW_SECRET;
    
    if (!expectedSecret) {
      console.error('❌ CONTENTFUL_PREVIEW_SECRET is not configured');
      return new Response(
        JSON.stringify({ 
          error: 'Server configuration error', 
          message: 'Preview secret not configured on server',
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // 3. シークレットの検証
    if (!secret) {
      console.error('❌ No secret provided in request');
      return new Response(
        JSON.stringify({ 
          error: 'Missing secret', 
          message: 'Preview secret is required',
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    if (secret !== expectedSecret) {
      console.error('❌ Invalid preview secret provided');
      console.error(`Expected: ${expectedSecret.substring(0, 10)}...`);
      console.error(`Received: ${secret.substring(0, 10)}...`);
      
      return new Response(
        JSON.stringify({ 
          error: 'Invalid secret', 
          message: 'Invalid preview secret',
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // 4. スラッグの検証
    if (!slug || slug.trim() === '') {
      console.error('❌ No slug provided in request');
      return new Response(
        JSON.stringify({ 
          error: 'Missing slug', 
          message: 'Content slug is required',
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // 5. コンテンツタイプの検証
    if (!type || !CONTENT_TYPE_PATHS[type]) {
      console.error(`❌ Invalid content type: ${type}`);
      console.error(`Supported types: ${Object.keys(CONTENT_TYPE_PATHS).join(', ')}`);
      
      return new Response(
        JSON.stringify({ 
          error: 'Invalid content type', 
          message: `Content type '${type}' is not supported`,
          supportedTypes: Object.keys(CONTENT_TYPE_PATHS),
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
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
      return new Response(
        JSON.stringify({ 
          error: 'Failed to enable preview mode', 
          message: 'Could not activate draft mode',
          timestamp: new Date().toISOString()
        }), 
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
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
    
    // 9. リダイレクト実行
    redirect(redirectUrl);
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    console.error('\n💥 Preview request failed:');
    console.error('Error:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error(`Processing time: ${processingTime}ms\n`);
    
    // エラーレスポンス
    return new Response(
      JSON.stringify({ 
        error: 'Preview request failed', 
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
        processingTime: `${processingTime}ms`
      }), 
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}

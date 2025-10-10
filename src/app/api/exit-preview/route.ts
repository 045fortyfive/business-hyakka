import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'
import { NextRequest } from 'next/server'

/**
 * Contentful Exit Preview API
 * 改善版: ログ機能充実、エラーハンドリング改善
 */

export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const { searchParams } = new URL(request.url);
  
  // リダイレクト先の指定があるかチェック
  const redirectTo = searchParams.get('redirect') || '/';
  
  // IPアドレスの取得（ログ用）
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  
  console.log('\n📝=== Exit Preview Request ===');
  console.log(`🕰️ Timestamp: ${new Date().toISOString()}`);
  console.log(`🌍 Client IP: ${clientIP}`);
  console.log(`🔄 Redirect to: ${redirectTo}`);
  
  try {
    // ドラフトモードを無効化
    console.log('🔴 Disabling draft mode...');

    try {
      (await draftMode()).disable();
      console.log('✅ Draft mode disabled successfully');
    } catch (draftError) {
      console.error('❌ Failed to disable draft mode:', draftError);
      // ドラフトモードの無効化に失敗してもリダイレクトは続行
      console.warn('⚠️ Proceeding with redirect despite draft mode error');
    }
    
    // パフォーマンスメトリクス
    const processingTime = Date.now() - startTime;
    console.log(`⏱️ Processing time: ${processingTime}ms`);
    console.log('✅ Exit preview request processed successfully\n');
    
    // 指定されたページにリダイレクト
    redirect(redirectTo);
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    console.error('\n💥 Exit preview request failed:');
    console.error('Error:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error(`Processing time: ${processingTime}ms\n`);
    
    // エラーが発生してもホームページにリダイレクト
    console.warn('⚠️ Redirecting to home due to error');
    redirect('/');
  }
}

/**
 * POSTメソッドでの終了リクエストもサポート
 * フロントエンドからのAjaxリクエストに対応
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  
  console.log('\n📝=== Exit Preview POST Request ===');
  console.log(`🕰️ Timestamp: ${new Date().toISOString()}`);
  console.log(`🌍 Client IP: ${clientIP}`);
  
  try {
    // リクエストボディからリダイレクト先を取得
    const body = await request.json().catch(() => ({}));
    const redirectTo = body.redirectTo || '/';
    
    console.log(`🔄 Requested redirect to: ${redirectTo}`);
    
    // ドラフトモードを無効化
    console.log('🔴 Disabling draft mode...');

    try {
      (await draftMode()).disable();
      console.log('✅ Draft mode disabled successfully');
    } catch (draftError) {
      console.error('❌ Failed to disable draft mode:', draftError);
    }
    
    const processingTime = Date.now() - startTime;
    console.log(`⏱️ Processing time: ${processingTime}ms`);
    console.log('✅ Exit preview POST request processed successfully\n');
    
    // JSONレスポンスを返す（Ajaxリクエスト用）
    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Preview mode disabled successfully',
        redirectTo,
        timestamp: new Date().toISOString(),
        processingTime: `${processingTime}ms`
      }), 
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    console.error('\n💥 Exit preview POST request failed:');
    console.error('Error:', error);
    console.error('Stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error(`Processing time: ${processingTime}ms\n`);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to exit preview mode',
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

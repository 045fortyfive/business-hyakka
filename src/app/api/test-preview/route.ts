import { NextRequest, NextResponse } from 'next/server';
import { 
  checkPreviewConfiguration, 
  logPreviewConfiguration,
  generateExamplePreviewUrls,
  generateContentfulPreviewTemplate,
  checkPreviewHealth,
  showPreviewSetupGuide
} from '@/utils/preview-utils';

/**
 * Preview機能のテスト・設定確認用APIエンドポイント
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'status';
  const baseUrl = searchParams.get('baseUrl') || 'https://www.skillpedia.jp';

  console.log(`🔍 Preview test API called with action: ${action}`);

  try {
    switch (action) {
      case 'status':
        const configCheck = checkPreviewConfiguration();
        logPreviewConfiguration();
        
        return NextResponse.json({
          success: true,
          action: 'status',
          configuration: configCheck,
          timestamp: new Date().toISOString()
        });

      case 'urls':
        const exampleUrls = generateExamplePreviewUrls(baseUrl);
        
        return NextResponse.json({
          success: true,
          action: 'urls',
          exampleUrls,
          baseUrl,
          timestamp: new Date().toISOString()
        });

      case 'template':
        const template = generateContentfulPreviewTemplate(baseUrl);
        
        return NextResponse.json({
          success: true,
          action: 'template',
          contentfulTemplate: template,
          baseUrl,
          timestamp: new Date().toISOString()
        });

      case 'health':
        const health = await checkPreviewHealth(baseUrl);
        
        return NextResponse.json({
          success: true,
          action: 'health',
          healthCheck: health,
          timestamp: new Date().toISOString()
        });

      case 'guide':
        const guide = showPreviewSetupGuide();
        
        return NextResponse.json({
          success: true,
          action: 'guide',
          setupGuide: guide,
          timestamp: new Date().toISOString()
        });

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action',
          availableActions: ['status', 'urls', 'template', 'health', 'guide'],
          timestamp: new Date().toISOString()
        }, { status: 400 });
    }

  } catch (error) {
    console.error('🚨 Preview test API error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  console.log('🧪 Preview test API POST request');

  try {
    const body = await request.json();
    const { action, slug, type, baseUrl = 'https://www.skillpedia.jp' } = body;

    switch (action) {
      case 'test-preview':
        if (!slug || !type) {
          return NextResponse.json({
            success: false,
            error: 'Missing required parameters',
            required: ['slug', 'type'],
            timestamp: new Date().toISOString()
          }, { status: 400 });
        }

        // Preview URLを生成してテスト
        const secret = process.env.CONTENTFUL_PREVIEW_SECRET;
        if (!secret) {
          return NextResponse.json({
            success: false,
            error: 'Preview secret not configured',
            timestamp: new Date().toISOString()
          }, { status: 500 });
        }

        const testUrl = `${baseUrl}/api/preview?secret=${secret}&type=${type}&slug=${slug}`;
        
        console.log(`🔗 Testing preview URL: ${testUrl}`);

        // プレビューURLのテスト実行
        try {
          const testResponse = await fetch(testUrl, {
            method: 'GET',
            redirect: 'manual' // リダイレクトを手動で処理
          });

          return NextResponse.json({
            success: true,
            action: 'test-preview',
            testUrl,
            testResult: {
              status: testResponse.status,
              statusText: testResponse.statusText,
              headers: Object.fromEntries(testResponse.headers.entries()),
              redirected: testResponse.status >= 300 && testResponse.status < 400
            },
            timestamp: new Date().toISOString()
          });

        } catch (testError) {
          return NextResponse.json({
            success: false,
            action: 'test-preview',
            testUrl,
            error: 'Test request failed',
            message: testError instanceof Error ? testError.message : 'Unknown error',
            timestamp: new Date().toISOString()
          }, { status: 500 });
        }

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid action for POST request',
          availableActions: ['test-preview'],
          timestamp: new Date().toISOString()
        }, { status: 400 });
    }

  } catch (error) {
    console.error('🚨 Preview test API POST error:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

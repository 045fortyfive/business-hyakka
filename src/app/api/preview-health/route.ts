import { NextRequest, NextResponse } from 'next/server';
import { draftMode } from 'next/headers';

/**
 * プレビューモードのヘルスチェック用APIエンドポイント
 * Contentful Live Preview の接続確認とトラブルシューティング用
 */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const action = searchParams.get('action') || 'status';
  
  try {
    switch (action) {
      case 'status':
        return await checkPreviewStatus(request);
      
      case 'headers':
        return checkHeaders(request);
      
      case 'test':
        return await testLivePreview(request);
      
      default:
        return NextResponse.json({
          error: 'Invalid action',
          availableActions: ['status', 'headers', 'test'],
        }, { status: 400 });
    }
  } catch (error) {
    console.error('Health check error:', error);
    return NextResponse.json({
      error: 'Health check failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

async function checkPreviewStatus(request: NextRequest) {
  const { isEnabled } = await draftMode();
  const cookies = request.headers.get('cookie') || '';
  const referer = request.headers.get('referer') || '';
  
  return NextResponse.json({
    previewMode: {
      enabled: isEnabled,
      hasPreviewCookie: cookies.includes('__prerender_bypass'),
      fromContentful: referer.includes('contentful.com'),
    },
    environment: {
      hasPreviewSecret: !!process.env.CONTENTFUL_PREVIEW_SECRET,
      hasSpaceId: !!process.env.CONTENTFUL_SPACE_ID,
      hasPreviewToken: !!process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
    },
    request: {
      userAgent: request.headers.get('user-agent')?.substring(0, 100),
      referer: referer,
      ip: request.headers.get('x-forwarded-for') || 'unknown',
    },
    timestamp: new Date().toISOString(),
  });
}

function checkHeaders(request: NextRequest) {
  const headers = Object.fromEntries(request.headers.entries());
  
  return NextResponse.json({
    requestHeaders: headers,
    securityAnalysis: {
      hasXFrameOptions: !!headers['x-frame-options'],
      hasCSP: !!headers['content-security-policy'],
      hasCORS: !!headers['access-control-allow-origin'],
      fromContentful: headers.referer?.includes('contentful.com') || false,
    },
    timestamp: new Date().toISOString(),
  });
}

async function testLivePreview(request: NextRequest) {
  const testResults = {
    environmentVariables: {
      previewSecret: !!process.env.CONTENTFUL_PREVIEW_SECRET,
      spaceId: !!process.env.CONTENTFUL_SPACE_ID,
      previewToken: !!process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
    },
    draftMode: {
      canEnable: false,
      error: null as string | null,
    },
    sampleUrls: {
      article: `/api/preview?secret=${process.env.CONTENTFUL_PREVIEW_SECRET}&type=article&slug=sample-article`,
      video: `/api/preview?secret=${process.env.CONTENTFUL_PREVIEW_SECRET}&type=video&slug=sample-video`,
    },
  };
  
  // ドラフトモードのテスト
  try {
    draftMode().enable();
    testResults.draftMode.canEnable = true;
    draftMode().disable(); // すぐに無効化
  } catch (error) {
    testResults.draftMode.error = error instanceof Error ? error.message : 'Unknown error';
  }
  
  return NextResponse.json({
    ...testResults,
    recommendations: generateRecommendations(testResults),
    timestamp: new Date().toISOString(),
  });
}

function generateRecommendations(testResults: any) {
  const recommendations = [];
  
  if (!testResults.environmentVariables.previewSecret) {
    recommendations.push({
      type: 'error',
      message: 'CONTENTFUL_PREVIEW_SECRET環境変数が設定されていません',
      action: '.env.localファイルにCONTENTFUL_PREVIEW_SECRETを追加してください',
    });
  }
  
  if (!testResults.environmentVariables.previewToken) {
    recommendations.push({
      type: 'warning',
      message: 'CONTENTFUL_PREVIEW_ACCESS_TOKEN環境変数が設定されていません',
      action: 'Contentfulのプレビュー用アクセストークンを設定してください',
    });
  }
  
  if (!testResults.draftMode.canEnable) {
    recommendations.push({
      type: 'error',
      message: 'Draft Modeの有効化に失敗しました',
      action: 'Next.jsのdraftMode設定を確認してください',
    });
  }
  
  if (recommendations.length === 0) {
    recommendations.push({
      type: 'success',
      message: 'プレビュー機能の設定が正常です',
      action: 'ContentfulでPreview URLを設定してテストしてください',
    });
  }
  
  return recommendations;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action } = body;
    
    if (action === 'reset-preview') {
      draftMode().disable();
      return NextResponse.json({
        success: true,
        message: 'Preview mode disabled',
        timestamp: new Date().toISOString(),
      });
    }
    
    return NextResponse.json({
      error: 'Invalid action',
      availableActions: ['reset-preview'],
    }, { status: 400 });
    
  } catch (error) {
    return NextResponse.json({
      error: 'Request failed',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

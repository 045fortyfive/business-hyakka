import { draftMode } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';

/**
 * プレビューモードの状態を確認するAPIエンドポイント
 * フロントエンドからプレビュー状態を確認するために使用
 */

export async function GET(request: NextRequest) {
  try {
    // draftModeの状態を確認
    const { isEnabled } = await draftMode();
    
    const response = {
      isPreview: isEnabled,
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent')?.substring(0, 100) || 'unknown'
    };

    return NextResponse.json(response, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });

  } catch (error) {
    console.error('Preview status check failed:', error);
    
    return NextResponse.json({
      isPreview: false,
      error: 'Failed to check preview status',
      timestamp: new Date().toISOString()
    }, { 
      status: 500,
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      }
    });
  }
}

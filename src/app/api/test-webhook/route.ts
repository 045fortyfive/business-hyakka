import { NextRequest, NextResponse } from 'next/server';

// テスト用のWebhookペイロードのサンプル
const SAMPLE_PAYLOADS = {
  article_published: {
    sys: {
      id: 'test-article-123',
      contentType: { sys: { id: 'content' } },
      space: { sys: { id: 'vxy009lryi3x' } }
    },
    fields: {
      title: { 'en-US': 'テスト記事: ビジネススキル向上術' },
      slug: { 'en-US': 'test-business-skills' },
      contentType: { 'en-US': '記事' },
      description: { 'en-US': 'これはWebhookテスト用のサンプル記事です。' }
    }
  },
  category_published: {
    sys: {
      id: 'test-category-456',
      contentType: { sys: { id: 'category' } },
      space: { sys: { id: 'vxy009lryi3x' } }
    },
    fields: {
      name: { 'en-US': 'テストカテゴリ' },
      slug: { 'en-US': 'test-category' },
      description: { 'en-US': 'これはWebhookテスト用のサンプルカテゴリです。' }
    }
  },
  video_published: {
    sys: {
      id: 'test-video-789',
      contentType: { sys: { id: 'content' } },
      space: { sys: { id: 'vxy009lryi3x' } }
    },
    fields: {
      title: { 'en-US': 'テスト動画: プレゼンテーション技術' },
      slug: { 'en-US': 'test-presentation-skills' },
      contentType: { 'en-US': '動画' },
      description: { 'en-US': 'これはWebhookテスト用のサンプル動画です。' }
    }
  }
};

export async function POST(request: NextRequest) {
  console.log('🧪 Test webhook endpoint called');
  
  try {
    // リクエストボディからテストタイプを取得
    const body = await request.json();
    const testType = body.testType || 'article_published';
    
    console.log(`🎯 Test type: ${testType}`);
    
    // 対応するペイロードを選択
    const payload = SAMPLE_PAYLOADS[testType as keyof typeof SAMPLE_PAYLOADS] || SAMPLE_PAYLOADS.article_published;
    
    // 本物のWebhookエンドポイントを呼び出し
    const webhookUrl = `${request.nextUrl.origin}/api/revalidate`;
    const secret = process.env.CONTENTFUL_WEBHOOK_SECRET;
    
    if (!secret) {
      return NextResponse.json({
        success: false,
        error: 'CONTENTFUL_WEBHOOK_SECRET not configured'
      }, { status: 500 });
    }
    
    console.log(`📡 Calling webhook: ${webhookUrl}`);
    console.log(`📦 Payload:`, JSON.stringify(payload, null, 2));
    
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${secret}`,
        'x-contentful-webhook-name': `test-${testType}`,
        'User-Agent': 'Contentful-Webhook/1.0 (Test)'
      },
      body: JSON.stringify(payload)
    });
    
    const webhookResult = await webhookResponse.json();
    
    console.log('✅ Webhook response received:');
    console.log(`Status: ${webhookResponse.status}`);
    console.log('Body:', JSON.stringify(webhookResult, null, 2));
    
    return NextResponse.json({
      success: true,
      testType,
      webhookStatus: webhookResponse.status,
      webhookResponse: webhookResult,
      timestamp: new Date().toISOString(),
      payload
    });
    
  } catch (error) {
    console.error('💥 Test webhook error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

// GET メソッドでテスト画面を表示
export async function GET() {
  const testInterface = `
    <!DOCTYPE html>
    <html lang="ja">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contentful Webhook テスト</title>
      <style>
        body { 
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px; 
          background: #f5f5f5;
        }
        .container { 
          background: white; 
          padding: 30px; 
          border-radius: 10px; 
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 { 
          color: #333; 
          border-bottom: 3px solid #007acc; 
          padding-bottom: 10px;
        }
        button { 
          background: #007acc; 
          color: white; 
          border: none; 
          padding: 12px 24px; 
          border-radius: 6px; 
          cursor: pointer; 
          margin: 10px 5px; 
          font-size: 14px;
          transition: background-color 0.3s;
        }
        button:hover { 
          background: #005999; 
        }
        button:disabled { 
          background: #ccc; 
          cursor: not-allowed; 
        }
        .result { 
          background: #f8f9fa; 
          border: 1px solid #dee2e6; 
          border-radius: 6px; 
          padding: 15px; 
          margin-top: 20px; 
          font-family: Monaco, 'Courier New', monospace; 
          font-size: 12px;
          white-space: pre-wrap;
          max-height: 400px;
          overflow-y: auto;
        }
        .success { border-left: 4px solid #28a745; }
        .error { border-left: 4px solid #dc3545; }
        .status { 
          padding: 10px; 
          border-radius: 6px; 
          margin: 10px 0; 
          font-weight: bold;
        }
        .status.loading { background: #fff3cd; color: #856404; }
        .status.success { background: #d4edda; color: #155724; }
        .status.error { background: #f8d7da; color: #721c24; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🎯 Contentful Webhook テスト</h1>
        
        <p>このページでは、Contentful Webhookの動作をローカルでテストできます。</p>
        
        <div>
          <h3>📋 テストケース</h3>
          <button onclick="testWebhook('article_published')">記事公開をテスト</button>
          <button onclick="testWebhook('category_published')">カテゴリ公開をテスト</button>
          <button onclick="testWebhook('video_published')">動画公開をテスト</button>
        </div>
        
        <div id="status"></div>
        <div id="result"></div>
        
        <script>
          async function testWebhook(testType) {
            const statusDiv = document.getElementById('status');
            const resultDiv = document.getElementById('result');
            const buttons = document.querySelectorAll('button');
            
            // ボタンを無効化
            buttons.forEach(btn => btn.disabled = true);
            
            statusDiv.innerHTML = '<div class="status loading">🔄 テスト実行中...</div>';
            resultDiv.innerHTML = '';
            
            try {
              const response = await fetch('/api/test-webhook', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({ testType })
              });
              
              const result = await response.json();
              
              if (result.success) {
                statusDiv.innerHTML = '<div class="status success">✅ テスト成功!</div>';
                resultDiv.innerHTML = '<div class="result success">' + JSON.stringify(result, null, 2) + '</div>';
              } else {
                statusDiv.innerHTML = '<div class="status error">❌ テスト失敗</div>';
                resultDiv.innerHTML = '<div class="result error">' + JSON.stringify(result, null, 2) + '</div>';
              }
              
            } catch (error) {
              statusDiv.innerHTML = '<div class="status error">❌ エラーが発生しました</div>';
              resultDiv.innerHTML = '<div class="result error">Error: ' + error.message + '</div>';
            }
            
            // ボタンを再有効化
            buttons.forEach(btn => btn.disabled = false);
          }
          
          // ページ読み込み時のステータス表示
          document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('status').innerHTML = '<div class="status">🚀 テスト準備完了</div>';
          });
        </script>
        
        <hr style="margin: 30px 0;">
        
        <h3>📖 使用方法</h3>
        <ol>
          <li>上記のボタンをクリックしてWebhookをテスト</li>
          <li>開発者ツールのコンソールで詳細ログを確認</li>
          <li>Next.jsの開発サーバーログでWebhook処理を確認</li>
          <li>実際のページで更新が反映されているかチェック</li>
        </ol>
        
        <h3>🔗 関連リンク</h3>
        <ul>
          <li><a href="/api/revalidate" target="_blank">Webhook エンドポイント (ヘルスチェック)</a></li>
          <li><a href="/articles" target="_blank">記事一覧ページ</a></li>
          <li><a href="/categories" target="_blank">カテゴリ一覧ページ</a></li>
        </ul>
      </div>
    </body>
    </html>
  `;
  
  return new Response(testInterface, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8'
    }
  });
}

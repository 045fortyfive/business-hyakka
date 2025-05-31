import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function POST(request: NextRequest) {
  console.log('🎯 Webhook received at:', new Date().toISOString());
  
  try {
    // 1. セキュリティ認証
    const authHeader = request.headers.get('authorization');
    const secret = process.env.CONTENTFUL_WEBHOOK_SECRET;
    
    console.log('🔐 Auth check - Header present:', !!authHeader);
    console.log('🔐 Auth check - Secret configured:', !!secret);
    
    if (!secret || authHeader !== `Bearer ${secret}`) {
      console.error('❌ Unauthorized webhook request');
      console.error('Expected:', `Bearer ${secret?.substring(0, 10)}...`);
      console.error('Received:', authHeader?.substring(0, 20) + '...');
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // 2. Webhookペイロードの取得
    const body = await request.json();
    console.log('📦 Webhook payload received:', JSON.stringify(body, null, 2));

    // 3. イベントタイプの確認
    const eventType = request.headers.get('x-contentful-webhook-name');
    console.log('📡 Event type:', eventType);

    // 4. コンテンツタイプとエントリ情報の特定
    const contentType = body.sys?.contentType?.sys?.id;
    const entryId = body.sys?.id;
    const spaceId = body.sys?.space?.sys?.id;

    console.log('📄 Content details:');
    console.log('  - Content Type:', contentType);
    console.log('  - Entry ID:', entryId);
    console.log('  - Space ID:', spaceId);

    if (!contentType) {
      console.error('❌ Content type not found in webhook payload');
      return NextResponse.json({ message: 'Content type not found' }, { status: 400 });
    }

    // 5. コンテンツタイプ別の再検証
    const revalidatedPaths: string[] = [];
    const revalidatedTags: string[] = [];
    
    console.log(`🔄 Processing content type: ${contentType}`);
    
    switch (contentType) {
      case 'content': // 記事コンテンツ
        console.log('📰 Processing article content...');
        
        // 記事一覧ページ
        revalidatePath('/articles');
        revalidatedPaths.push('/articles');
        
        // 記事詳細ページ（スラッグが分かる場合）
        const articleSlug = body.fields?.slug?.['en-US'] || body.fields?.slug;
        if (articleSlug) {
          const articlePath = `/articles/${articleSlug}`;
          revalidatePath(articlePath);
          revalidatedPaths.push(articlePath);
          console.log(`📝 Article slug found: ${articleSlug}`);
        }
        
        // ホームページ（最新記事が表示される可能性）
        revalidatePath('/');
        revalidatedPaths.push('/');
        
        // カテゴリページの再検証
        revalidatePath('/categories');
        revalidatedPaths.push('/categories');
        
        // 検索ページも更新
        revalidatePath('/search');
        revalidatedPaths.push('/search');
        
        // タグベースの再検証
        revalidateTag('articles');
        revalidateTag('content');
        revalidatedTags.push('articles', 'content');
        break;
        
      case 'category': // カテゴリ
        console.log('🏷️ Processing category...');
        revalidatePath('/articles');
        revalidatePath('/categories');
        revalidatePath('/');
        revalidatedPaths.push('/articles', '/categories', '/');
        
        revalidateTag('categories');
        revalidateTag('articles');
        revalidatedTags.push('categories', 'articles');
        break;
        
      case 'tag': // タグ
        console.log('🔖 Processing tag...');
        revalidatePath('/articles');
        revalidatePath('/search');
        revalidatedPaths.push('/articles', '/search');
        
        revalidateTag('tags');
        revalidateTag('articles');
        revalidatedTags.push('tags', 'articles');
        break;
        
      default:
        console.log(`❓ Unknown content type: ${contentType}. Applying default revalidation.`);
        // デフォルトで主要ページを再検証
        revalidatePath('/');
        revalidatePath('/articles');
        revalidatedPaths.push('/', '/articles');
        
        revalidateTag('contentful-content');
        revalidatedTags.push('contentful-content');
    }

    // 6. 共通のキャッシュタグも再検証
    revalidateTag('contentful');
    revalidatedTags.push('contentful');

    const response = {
      success: true,
      revalidated: {
        paths: revalidatedPaths,
        tags: revalidatedTags
      },
      contentType,
      entryId,
      eventType,
      spaceId,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    };

    console.log('✅ Revalidation completed successfully:');
    console.log('  - Paths:', revalidatedPaths);
    console.log('  - Tags:', revalidatedTags);
    
    return NextResponse.json(response);

  } catch (error) {
    console.error('💥 Webhook processing error:', error);
    
    const errorResponse = {
      success: false,
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// GET メソッドでのヘルスチェック
export async function GET() {
  const healthCheck = {
    status: 'OK',
    message: 'Contentful webhook endpoint is ready',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    secretConfigured: !!process.env.CONTENTFUL_WEBHOOK_SECRET
  };
  
  console.log('🩺 Health check requested:', healthCheck);
  
  return NextResponse.json(healthCheck);
}

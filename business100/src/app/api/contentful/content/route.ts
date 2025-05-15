import { NextRequest, NextResponse } from 'next/server';
import { getContentfulClient } from '@/lib/contentful';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = parseInt(searchParams.get('skip') || '0', 10);
    const order = searchParams.get('order') || '-sys.createdAt';
    const includeCategories = searchParams.get('includeCategories') === 'true';

    const client = getContentfulClient();

    // コンテンツエントリを取得
    const entries = await client.getEntries({
      content_type: 'content',
      order,
      limit,
      skip,
      include: 2, // 参照フィールドを2階層まで解決
    });

    // カテゴリー情報を含める場合
    if (includeCategories) {
      // カテゴリーエントリを取得
      const categoryEntries = await client.getEntries({
        content_type: 'category',
        limit: 100,
      });

      // レスポンスオブジェクトを作成
      const response = {
        items: entries.items,
        categories: categoryEntries.items,
      };

      return NextResponse.json(response, { status: 200 });
    }

    // 通常のレスポンス
    return NextResponse.json(entries.items, { status: 200 });
  } catch (error) {
    console.error('Error fetching Contentful data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data from Contentful' },
      { status: 500 }
    );
  }
}

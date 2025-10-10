import CompactCard from '@/components/card-samples/compact-card';
import { getContentfulClient } from '@/lib/contentful';
import { formatDate } from '@/lib/utils';

// Contentfulからデータを取得する関数
async function getContentfulData() {
  const client = getContentfulClient();
  
  // 最新の記事を10件取得
  const entries = await client.getEntries({
    content_type: 'content',
    order: '-sys.createdAt',
    limit: 12,
    include: 2,
  });
  
  return entries.items;
}

export default async function ContentfulCardSamplesPage() {
  const contentfulItems = await getContentfulData();
  
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-12">Contentfulデータを使用したカードサンプル (1:1.6)</h1>
      
      {/* 青紫グラデーションボーダー */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">青紫グラデーションボーダー</h2>
        <p className="text-gray-600 mb-8">
          青から紫へのグラデーションボーダーを持つカードデザイン。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {contentfulItems.slice(0, 3).map((item: any) => (
            <CompactCard
              key={item.sys.id}
              title={item.fields.title || 'タイトルなし'}
              description={item.fields.description || '説明なし'}
              imageUrl={item.fields.thumbnail?.fields?.file?.url ? `https:${item.fields.thumbnail.fields.file.url}` : '/images/hero-business.jpg'}
              category={item.fields.category?.fields?.name || 'カテゴリなし'}
              date={formatDate(item.sys.createdAt)}
              href={`/articles/${item.fields.slug}`}
              variant="rounded"
              shadow="md"
              border="gradient"
              gradientColor="blue-purple"
            />
          ))}
        </div>
      </section>
      
      {/* 緑青グラデーションボーダー */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">緑青グラデーションボーダー</h2>
        <p className="text-gray-600 mb-8">
          緑から青へのグラデーションボーダーを持つカードデザイン。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {contentfulItems.slice(3, 6).map((item: any) => (
            <CompactCard
              key={item.sys.id}
              title={item.fields.title || 'タイトルなし'}
              description={item.fields.description || '説明なし'}
              imageUrl={item.fields.thumbnail?.fields?.file?.url ? `https:${item.fields.thumbnail.fields.file.url}` : '/images/hero-business.jpg'}
              category={item.fields.category?.fields?.name || 'カテゴリなし'}
              date={formatDate(item.sys.createdAt)}
              href={`/articles/${item.fields.slug}`}
              variant="rounded"
              shadow="md"
              border="gradient"
              gradientColor="green-blue"
            />
          ))}
        </div>
      </section>
      
      {/* オレンジ赤グラデーションボーダー */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">オレンジ赤グラデーションボーダー</h2>
        <p className="text-gray-600 mb-8">
          オレンジから赤へのグラデーションボーダーを持つカードデザイン。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {contentfulItems.slice(6, 9).map((item: any) => (
            <CompactCard
              key={item.sys.id}
              title={item.fields.title || 'タイトルなし'}
              description={item.fields.description || '説明なし'}
              imageUrl={item.fields.thumbnail?.fields?.file?.url ? `https:${item.fields.thumbnail.fields.file.url}` : '/images/hero-business.jpg'}
              category={item.fields.category?.fields?.name || 'カテゴリなし'}
              date={formatDate(item.sys.createdAt)}
              href={`/articles/${item.fields.slug}`}
              variant="rounded"
              shadow="md"
              border="gradient"
              gradientColor="orange-red"
            />
          ))}
        </div>
      </section>
      
      {/* ピンク紫グラデーションボーダー */}
      <section className="mb-16">
        <h2 className="text-2xl font-bold mb-6">ピンク紫グラデーションボーダー</h2>
        <p className="text-gray-600 mb-8">
          ピンクから紫へのグラデーションボーダーを持つカードデザイン。
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {contentfulItems.slice(9, 12).map((item: any) => (
            <CompactCard
              key={item.sys.id}
              title={item.fields.title || 'タイトルなし'}
              description={item.fields.description || '説明なし'}
              imageUrl={item.fields.thumbnail?.fields?.file?.url ? `https:${item.fields.thumbnail.fields.file.url}` : '/images/hero-business.jpg'}
              category={item.fields.category?.fields?.name || 'カテゴリなし'}
              date={formatDate(item.sys.createdAt)}
              href={`/articles/${item.fields.slug}`}
              variant="rounded"
              shadow="md"
              border="gradient"
              gradientColor="pink-purple"
            />
          ))}
        </div>
      </section>
    </div>
  );
}

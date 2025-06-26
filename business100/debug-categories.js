// カテゴリデータのデバッグスクリプト
const { createClient } = require('contentful');

// 環境変数から設定を読み込む
const spaceId = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_ACCESS_TOKEN;

console.log('Environment variables:');
console.log('CONTENTFUL_SPACE_ID:', spaceId ? 'Set' : 'Not set');
console.log('CONTENTFUL_ACCESS_TOKEN:', accessToken ? 'Set' : 'Not set');

// Contentfulクライアントの作成
const client = createClient({
  space: spaceId,
  accessToken: accessToken,
});

// カテゴリデータの詳細確認
async function debugCategories() {
  try {
    console.log('=== カテゴリデータの詳細確認 ===');
    
    // カテゴリエントリーを取得
    const categories = await client.getEntries({
      content_type: 'category',
      order: 'fields.name',
    });
    
    console.log(`Found ${categories.total} categories:`);
    
    categories.items.forEach((category, index) => {
      console.log(`\n${index + 1}. Category ID: ${category.sys.id}`);
      console.log(`   Name: ${category.fields.name || 'NO NAME'}`);
      console.log(`   Slug: ${category.fields.slug || 'NO SLUG'}`);
      console.log(`   Description: ${category.fields.description || 'NO DESCRIPTION'}`);
      console.log(`   Fields available:`, Object.keys(category.fields));
    });

    // 特定のslugでカテゴリを検索してみる
    console.log('\n=== 特定のslugでカテゴリを検索 ===');
    
    const testSlugs = ['basic', 'undefined', '基礎ビジネススキル', 'business-basics'];
    
    for (const slug of testSlugs) {
      console.log(`\nSearching for slug: "${slug}"`);
      const result = await client.getEntries({
        content_type: 'category',
        'fields.slug': slug,
        limit: 1,
      });
      
      if (result.items.length > 0) {
        const category = result.items[0];
        console.log(`  Found: ${category.fields.name} (ID: ${category.sys.id})`);
      } else {
        console.log(`  Not found`);
      }
    }

    // コンテンツエントリーのカテゴリ参照を確認
    console.log('\n=== コンテンツのカテゴリ参照確認 ===');
    
    const contents = await client.getEntries({
      content_type: 'content',
      include: 2,
      limit: 5,
    });
    
    contents.items.forEach((content, index) => {
      console.log(`\n${index + 1}. Content: ${content.fields.title || 'NO TITLE'}`);
      console.log(`   Slug: ${content.fields.slug || 'NO SLUG'}`);
      
      if (content.fields.category) {
        if (Array.isArray(content.fields.category)) {
          console.log(`   Categories (${content.fields.category.length}):`);
          content.fields.category.forEach((cat, catIndex) => {
            if (cat && cat.fields) {
              console.log(`     ${catIndex + 1}. ${cat.fields.name} (slug: ${cat.fields.slug})`);
            } else {
              console.log(`     ${catIndex + 1}. INVALID CATEGORY REFERENCE`);
            }
          });
        } else if (content.fields.category.fields) {
          console.log(`   Category: ${content.fields.category.fields.name} (slug: ${content.fields.category.fields.slug})`);
        } else {
          console.log(`   Category: INVALID REFERENCE`);
        }
      } else {
        console.log(`   Category: NONE`);
      }
    });

  } catch (error) {
    console.error('Error debugging categories:');
    console.error(error);
  }
}

// デバッグの実行
debugCategories();

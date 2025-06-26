// Contentful接続テスト
const { createClient } = require('contentful');
const fs = require('fs');
const path = require('path');

// .env.localファイルから環境変数を読み込む
const envPath = path.resolve(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) {
    const key = match[1].trim();
    const value = match[2].trim();
    envVars[key] = value;
  }
});

// 環境変数から設定を読み込む
const spaceId = envVars.CONTENTFUL_SPACE_ID;
const accessToken = envVars.CONTENTFUL_ACCESS_TOKEN;

console.log('Space ID:', spaceId);
console.log('Access Token:', accessToken ? 'Set (not showing for security)' : 'Not set');

// Contentfulクライアントの作成
const client = createClient({
  space: spaceId,
  accessToken: accessToken,
});

// コンテンツの取得テスト
async function testContentful() {
  try {
    // コンテンツタイプの一覧を取得
    console.log('Fetching content types...');
    const contentTypes = await client.getContentTypes();
    console.log(`Found ${contentTypes.items.length} content types:`);
    contentTypes.items.forEach(type => {
      console.log(`- ${type.name} (${type.sys.id})`);
    });

    // カテゴリエントリーの詳細取得
    console.log('\nFetching categories...');
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
    });

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

    // 特定の記事を確認
    console.log('\n=== 特定記事の確認 ===');
    const specificArticle = await client.getEntries({
      content_type: 'content',
      'fields.slug': 'kadaihakkennryoku',
      include: 2,
      limit: 1,
    });

    if (specificArticle.items.length > 0) {
      const article = specificArticle.items[0];
      console.log(`Found article: ${article.fields.title}`);
      console.log(`Slug: ${article.fields.slug}`);
      console.log(`Content Type: ${article.fields.contentType}`);
      console.log(`Has body: ${article.fields.body ? 'Yes' : 'No'}`);
      console.log(`Has mdxContent: ${article.fields.mdxContent ? 'Yes' : 'No'}`);
      console.log(`Last modified: ${article.sys.updatedAt}`);
    } else {
      console.log('Article with slug "kadaihakkennryoku" not found');
    }

    console.log('\nContentful connection test completed successfully!');
  } catch (error) {
    console.error('Error testing Contentful connection:');
    console.error(error);
  }
}

// テストの実行
testContentful();

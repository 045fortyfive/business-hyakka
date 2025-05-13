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

    // エントリーの取得テスト
    console.log('\nFetching entries...');
    const entries = await client.getEntries({
      limit: 5,
    });
    console.log(`Found ${entries.total} entries, showing first ${entries.items.length}:`);
    entries.items.forEach(entry => {
      console.log(`- [${entry.sys.contentType.sys.id}] ${entry.sys.id}`);
    });

    console.log('\nContentful connection test completed successfully!');
  } catch (error) {
    console.error('Error testing Contentful connection:');
    console.error(error);
  }
}

// テストの実行
testContentful();

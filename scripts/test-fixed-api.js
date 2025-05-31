#!/usr/bin/env node

/**
 * 修正版API動作テスト
 */

const https = require('https');

console.log('🧪 修正版API動作テスト');
console.log('='.repeat(50));

// 1. 直接Contentful API呼び出しテスト
async function testDirectAPI() {
  console.log('\n📡 1. 直接Contentful API呼び出しテスト');
  console.log('-'.repeat(40));
  
  return new Promise((resolve) => {
    const options = {
      hostname: 'cdn.contentful.com',
      port: 443,
      path: '/spaces/vxy009lryi3x/environments/master/entries?content_type=content&fields.contentType=%E8%A8%98%E4%BA%8B&limit=3&include=2',
      method: 'GET',
      headers: {
        'Authorization': 'Bearer qLylkb9h2iMqBUPBh6JXy3Wk5WQWHdJ91LaI8SKkb60',
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log(`✅ Direct API: ${result.items.length} articles found`);
          
          if (result.items.length > 0) {
            const article = result.items[0];
            console.log(`   - Title: ${article.fields?.title}`);
            console.log(`   - Slug: ${article.fields?.slug}`);
            console.log(`   - Featured Image: ${article.fields?.featuredImage ? 'YES' : 'NO'}`);
            
            if (article.fields?.featuredImage) {
              const img = article.fields.featuredImage;
              console.log(`   - Image ID: ${img.sys?.id}`);
              
              // includes内で画像データを探す
              if (result.includes?.Asset) {
                const imageAsset = result.includes.Asset.find(asset => asset.sys.id === img.sys.id);
                if (imageAsset && imageAsset.fields?.file?.url) {
                  console.log(`   - Image URL: ${imageAsset.fields.file.url}`);
                } else {
                  console.log(`   - Image Asset: Found in includes but no URL`);
                }
              } else {
                console.log(`   - Image Asset: NOT found in includes`);
              }
            }
          }
          
          resolve(result);
        } catch (error) {
          console.log(`❌ JSON parse error: ${error.message}`);
          resolve(null);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Request error: ${error.message}`);
      resolve(null);
    });
    
    req.end();
  });
}

// 2. Next.js本番API呼び出しテスト
async function testNextJSAPI() {
  console.log('\n🌐 2. Next.js本番API呼び出しテスト');
  console.log('-'.repeat(40));
  
  // Note: Next.jsの本番APIを直接テストはできないため、
  // デプロイ後にブラウザで確認する必要がある
  console.log('⚠️ Next.js APIは本番環境でのみテスト可能');
  console.log('   以下のステップで確認してください:');
  console.log('   1. git add . && git commit -m "Fix API implementation"');
  console.log('   2. git push');
  console.log('   3. Vercelでデプロイ完了を待つ');
  console.log('   4. https://www.skillpedia.jp/ でコンテンツ表示を確認');
}

// メイン実行
async function runTest() {
  await testDirectAPI();
  await testNextJSAPI();
  
  console.log('\n🎯 推奨次ステップ:');
  console.log('='.repeat(40));
  console.log('1. 修正をコミット・プッシュ');
  console.log('2. Vercelでデプロイ完了を確認');
  console.log('3. https://www.skillpedia.jp/ で表示確認');
  console.log('4. Webhookが正常動作することを確認');
  console.log('5. Contentfulでコンテンツ更新テスト');
}

runTest();

#!/usr/bin/env node

/**
 * Contentful データ取得診断ツール
 * 本番環境でのデータ取得問題を特定・解決
 */

const https = require('https');

// 設定
const CONTENTFUL_SPACE_ID = 'vxy009lryi3x';
const CONTENTFUL_ACCESS_TOKEN = 'qLylkb9h2iMqBUPBh6JXy3Wk5WQWHdJ91LaI8SKkb60';
const CONTENTFUL_ENVIRONMENT = 'master';

console.log('🔍 Contentful データ取得診断開始');
console.log('='.repeat(60));
console.log(`Space ID: ${CONTENTFUL_SPACE_ID}`);
console.log(`Environment: ${CONTENTFUL_ENVIRONMENT}`);
console.log(`Token: ${CONTENTFUL_ACCESS_TOKEN.substring(0, 10)}...`);
console.log('='.repeat(60));

// Contentful API呼び出し
function callContentfulAPI(endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    const path = `/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}${endpoint}?${searchParams.toString()}`;
    
    console.log(`📡 Calling: https://cdn.contentful.com${path}`);
    
    const options = {
      hostname: 'cdn.contentful.com',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Diagnostic/1.0'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const result = JSON.parse(data);
            console.log(`✅ Success: ${result.items?.length || 0} items retrieved`);
            resolve(result);
          } else {
            console.log(`❌ HTTP Error: ${res.statusCode}`);
            console.log(`Response: ${data.substring(0, 500)}`);
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        } catch (error) {
          console.log(`❌ JSON Parse Error: ${error.message}`);
          console.log(`Raw response: ${data.substring(0, 500)}`);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`❌ Request Error: ${error.message}`);
      reject(error);
    });
    
    req.end();
  });
}

// 1. コンテンツタイプ確認
async function checkContentTypes() {
  console.log('\n📋 1. コンテンツタイプ確認');
  console.log('-'.repeat(40));
  
  try {
    const result = await callContentfulAPI('/content_types');
    
    console.log(`Found ${result.items.length} content types:`);
    result.items.forEach(ct => {
      console.log(`  - ${ct.sys.id}: ${ct.name} (${ct.fields?.length || 0} fields)`);
    });
    
    return result.items;
  } catch (error) {
    console.error('Content types fetch failed:', error.message);
    return [];
  }
}

// 2. 記事データ確認
async function checkArticles() {
  console.log('\n📄 2. 記事データ確認');
  console.log('-'.repeat(40));
  
  try {
    const result = await callContentfulAPI('/entries', {
      content_type: 'content',
      'fields.contentType': '記事',
      order: '-sys.createdAt',
      limit: 5,
      include: 2
    });
    
    console.log(`Found ${result.items.length} articles (total: ${result.total})`);
    
    result.items.forEach((article, index) => {
      console.log(`\n  📰 Article ${index + 1}:`);
      console.log(`     ID: ${article.sys.id}`);
      console.log(`     Title: ${article.fields?.title || 'NO TITLE'}`);
      console.log(`     Slug: ${article.fields?.slug || 'NO SLUG'}`);
      console.log(`     Content Type: ${article.fields?.contentType || 'NO CONTENT TYPE'}`);
      console.log(`     Description: ${article.fields?.description ? 'YES' : 'NO'}`);
      console.log(`     Featured Image: ${article.fields?.featuredImage ? 'YES' : 'NO'}`);
      
      if (article.fields?.featuredImage) {
        const img = article.fields.featuredImage;
        if (img.fields?.file?.url) {
          console.log(`     Image URL: ${img.fields.file.url}`);
        } else {
          console.log(`     Image: Missing file URL`);
        }
      }
      
      if (article.fields?.category && article.fields.category.length > 0) {
        const cat = article.fields.category[0];
        console.log(`     Category: ${cat.fields?.name || cat.sys?.id || 'UNKNOWN'}`);
      } else {
        console.log(`     Category: NO CATEGORY`);
      }
    });
    
    return result;
  } catch (error) {
    console.error('Articles fetch failed:', error.message);
    return { items: [], total: 0 };
  }
}

// 3. カテゴリデータ確認
async function checkCategories() {
  console.log('\n🏷️ 3. カテゴリデータ確認');
  console.log('-'.repeat(40));
  
  try {
    const result = await callContentfulAPI('/entries', {
      content_type: 'category',
      order: 'fields.name'
    });
    
    console.log(`Found ${result.items.length} categories`);
    
    result.items.forEach((category, index) => {
      console.log(`\n  🔖 Category ${index + 1}:`);
      console.log(`     ID: ${category.sys.id}`);
      console.log(`     Name: ${category.fields?.name || 'NO NAME'}`);
      console.log(`     Slug: ${category.fields?.slug || 'NO SLUG'}`);
      console.log(`     Description: ${category.fields?.description || 'NO DESCRIPTION'}`);
    });
    
    return result;
  } catch (error) {
    console.error('Categories fetch failed:', error.message);
    return { items: [], total: 0 };
  }
}

// 4. 動画・音声データ確認
async function checkVideosAndAudios() {
  console.log('\n🎥 4. 動画・音声データ確認');
  console.log('-'.repeat(40));
  
  // 動画確認
  try {
    const videos = await callContentfulAPI('/entries', {
      content_type: 'content',
      'fields.contentType': '動画',
      limit: 3
    });
    
    console.log(`Found ${videos.items.length} videos (total: ${videos.total})`);
    
    videos.items.forEach((video, index) => {
      console.log(`  🎬 Video ${index + 1}: ${video.fields?.title || 'NO TITLE'}`);
    });
  } catch (error) {
    console.error('Videos fetch failed:', error.message);
  }
  
  // 音声確認
  try {
    const audios = await callContentfulAPI('/entries', {
      content_type: 'content',
      'fields.contentType': '音声',
      limit: 3
    });
    
    console.log(`Found ${audios.items.length} audios (total: ${audios.total})`);
    
    audios.items.forEach((audio, index) => {
      console.log(`  🎧 Audio ${index + 1}: ${audio.fields?.title || 'NO TITLE'}`);
    });
  } catch (error) {
    console.error('Audios fetch failed:', error.message);
  }
}

// 5. 環境・認証確認
async function checkAuthentication() {
  console.log('\n🔐 5. 認証・環境確認');
  console.log('-'.repeat(40));
  
  try {
    const result = await callContentfulAPI('/');
    
    console.log('✅ Authentication successful');
    console.log(`Space Name: ${result.name}`);
    console.log(`Space ID: ${result.sys.id}`);
    console.log(`Default Locale: ${result.defaultLocale}`);
    console.log(`Locales: ${result.locales?.map(l => l.code).join(', ')}`);
    
    return true;
  } catch (error) {
    console.error('❌ Authentication failed:', error.message);
    return false;
  }
}

// 6. 本番環境のNext.js API確認
async function checkNextJSAPI() {
  console.log('\n🌐 6. Next.js API確認');
  console.log('-'.repeat(40));
  
  // Articles API test
  try {
    console.log('Testing articles API...');
    
    // 本番環境のAPIをテスト用エンドポイントで確認
    const testScript = `
const { getArticles } = require('./src/lib/api.ts');

(async () => {
  try {
    const articles = await getArticles(5);
    console.log('Articles API Success:', articles.items.length, 'items');
  } catch (error) {
    console.error('Articles API Error:', error.message);
  }
})();
`;
    
    console.log('⚠️ Next.js API test requires server environment');
    console.log('   Run this test on the actual deployment');
    
  } catch (error) {
    console.error('Next.js API test failed:', error.message);
  }
}

// メイン実行
async function runDiagnosis() {
  console.log('');
  
  const authOK = await checkAuthentication();
  if (!authOK) {
    console.log('\n❌ Authentication failed. Cannot proceed with other tests.');
    return;
  }
  
  await checkContentTypes();
  const articles = await checkArticles();
  await checkCategories();
  await checkVideosAndAudios();
  await checkNextJSAPI();
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 診断結果サマリー');
  console.log('='.repeat(60));
  
  if (articles.items.length === 0) {
    console.log('🚨 CRITICAL: 記事データが取得できていません');
    console.log('');
    console.log('考えられる原因:');
    console.log('1. ❌ contentType フィールドが "記事" ではない');
    console.log('2. ❌ content_type が "content" ではない');
    console.log('3. ❌ データが存在しない');
    console.log('4. ❌ フィールド構造が想定と異なる');
    console.log('');
    console.log('解決策:');
    console.log('1. Contentfulで実際のデータ構造を確認');
    console.log('2. contentType フィールドの値を確認');
    console.log('3. 公開状態を確認');
    console.log('4. Next.js APIのクエリ条件を修正');
  } else {
    console.log('✅ 記事データは正常に取得できています');
    console.log(`   → ${articles.items.length}件の記事を確認`);
    
    // 画像チェック
    const articlesWithImages = articles.items.filter(a => a.fields?.featuredImage?.fields?.file?.url);
    console.log(`   → ${articlesWithImages.length}件に画像が設定済み`);
    
    if (articlesWithImages.length === 0) {
      console.log('⚠️ WARNING: 画像が設定された記事がありません');
    }
  }
  
  console.log('\n🔧 推奨される次のステップ:');
  console.log('1. 上記の結果を基にNext.js APIのクエリを修正');
  console.log('2. 本番環境でのVercelログを確認');
  console.log('3. 環境変数の再確認');
  console.log('4. キャッシュのクリアとWebhookのテスト');
}

runDiagnosis();

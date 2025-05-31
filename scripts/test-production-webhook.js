#!/usr/bin/env node

/**
 * 本番環境 Contentful Webhook テストスクリプト
 * 
 * 使用方法:
 *   node scripts/test-production-webhook.js [test-type]
 */

const https = require('https');

// テスト用のペイロード
const SAMPLE_PAYLOADS = {
  article_published: {
    sys: {
      id: 'prod-test-article-' + Date.now(),
      contentType: { sys: { id: 'content' } },
      space: { sys: { id: 'vxy009lryi3x' } }
    },
    fields: {
      title: { 'en-US': '本番テスト記事: ' + new Date().toLocaleString('ja-JP') },
      slug: { 'en-US': 'production-test-' + Date.now() },
      contentType: { 'en-US': '記事' },
      description: { 'en-US': 'これは本番環境Webhookテスト用のサンプル記事です。' }
    }
  },
  category_published: {
    sys: {
      id: 'prod-test-category-' + Date.now(),
      contentType: { sys: { id: 'category' } },
      space: { sys: { id: 'vxy009lryi3x' } }
    },
    fields: {
      name: { 'en-US': '本番テストカテゴリ: ' + new Date().toLocaleString('ja-JP') },
      slug: { 'en-US': 'production-test-category-' + Date.now() },
      description: { 'en-US': 'これは本番環境Webhookテスト用のサンプルカテゴリです。' }
    }
  }
};

// 設定
const PRODUCTION_URL = 'https://www.skillpedia.jp';
const WEBHOOK_SECRET = 'ouRdtEWBClayl75vda53_B-MDOcqLB1DjiG0lIN-zpDoQ7ahBswgWZVDYycYl4bG';

// コマンドライン引数
const args = process.argv.slice(2);
const testType = args[0] || 'article_published';

console.log('🚀 本番環境 Contentful Webhook テスト');
console.log('='.repeat(60));
console.log(`テストタイプ: ${testType}`);
console.log(`URL: ${PRODUCTION_URL}/api/revalidate`);
console.log(`時刻: ${new Date().toLocaleString('ja-JP')}`);
console.log('='.repeat(60));

// ペイロードを取得
const payload = SAMPLE_PAYLOADS[testType];
if (!payload) {
  console.error(`❌ 不正なテストタイプ: ${testType}`);
  console.log(`利用可能なタイプ: ${Object.keys(SAMPLE_PAYLOADS).join(', ')}`);
  process.exit(1);
}

console.log('📦 送信ペイロード:');
console.log(JSON.stringify(payload, null, 2));
console.log('');

// 1. まずヘルスチェック
function healthCheck() {
  return new Promise((resolve, reject) => {
    console.log('🩺 ヘルスチェック実行中...');
    
    const options = {
      hostname: 'www.skillpedia.jp',
      port: 443,
      path: '/api/revalidate',
      method: 'GET',
      headers: {
        'User-Agent': 'HealthCheck/1.0'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode === 200 && result.status === 'OK') {
            console.log('✅ ヘルスチェック成功');
            console.log(`  - Status: ${result.status}`);
            console.log(`  - Environment: ${result.environment}`);
            console.log(`  - Secret Configured: ${result.secretConfigured}`);
            resolve(result);
          } else {
            console.log('⚠️  ヘルスチェック警告');
            console.log(`  - Status Code: ${res.statusCode}`);
            console.log(`  - Response: ${JSON.stringify(result, null, 2)}`);
            resolve(result);
          }
        } catch (error) {
          console.error('❌ ヘルスチェックのJSON解析エラー:', error.message);
          console.log('Raw response:', data);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ ヘルスチェック失敗:', error.message);
      reject(error);
    });
    
    req.end();
  });
}

// 2. Webhookテスト
function testWebhook() {
  return new Promise((resolve, reject) => {
    console.log('🎯 Webhook送信中...');
    
    const postData = JSON.stringify(payload);
    
    const options = {
      hostname: 'www.skillpedia.jp',
      port: 443,
      path: '/api/revalidate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WEBHOOK_SECRET}`,
        'x-contentful-webhook-name': `production-test-${testType}`,
        'User-Agent': 'Contentful-Webhook/1.0 (Production-Test)',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
    
    const req = https.request(options, (res) => {
      console.log(`📡 レスポンス: ${res.statusCode} ${res.statusMessage}`);
      
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          console.log('✅ レスポンス内容:');
          console.log(JSON.stringify(result, null, 2));
          
          if (res.statusCode === 200 && result.success) {
            console.log('');
            console.log('🎉 本番環境テスト成功! Webhookが正常に動作しています。');
            console.log('');
            
            if (result.revalidated?.paths) {
              console.log('📋 再検証されたページ:');
              result.revalidated.paths.forEach(path => {
                console.log(`  📄 ${PRODUCTION_URL}${path}`);
              });
            }
            
            if (result.revalidated?.tags) {
              console.log('🏷️ 再検証されたキャッシュタグ:');
              result.revalidated.tags.forEach(tag => {
                console.log(`  🔖 ${tag}`);
              });
            }
            
            console.log('');
            console.log('🔍 次の手順:');
            console.log('  1. 上記のURLにアクセスして更新を確認');
            console.log('  2. ブラウザの開発者ツールでキャッシュ状況を確認');
            console.log('  3. 実際のContentfulでコンテンツを更新してテスト');
            
            resolve(result);
          } else {
            console.log('');
            console.log('❌ 本番環境テスト失敗。上記のエラー内容を確認してください。');
            reject(new Error(`HTTP ${res.statusCode}: ${JSON.stringify(result)}`));
          }
        } catch (error) {
          console.log('📄 Raw レスポンス:', data);
          console.error('❌ JSON解析エラー:', error.message);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('💥 リクエストエラー:', error.message);
      console.log('');
      console.log('🔧 トラブルシューティング:');
      console.log('  1. インターネット接続を確認');
      console.log('  2. Vercelのデプロイ状況を確認');
      console.log('  3. 環境変数がVercelに正しく設定されているか確認');
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

// テスト実行
async function runTest() {
  try {
    // ヘルスチェック
    await healthCheck();
    console.log('');
    
    // Webhookテスト
    await testWebhook();
    
  } catch (error) {
    console.error('');
    console.error('💥 テスト失敗:', error.message);
    process.exit(1);
  }
}

runTest();

#!/usr/bin/env node

/**
 * Contentful Webhook テストスクリプト
 * 
 * 使用方法:
 *   node scripts/test-webhook.js [test-type] [url]
 * 
 * 例:
 *   node scripts/test-webhook.js article_published http://localhost:3000
 *   node scripts/test-webhook.js category_published https://www.skillpedia.jp
 */

const https = require('https');
const http = require('http');

// テスト用のペイロード
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

// コマンドライン引数を取得
const args = process.argv.slice(2);
const testType = args[0] || 'article_published';
const baseUrl = args[1] || 'http://localhost:3000';
const webhookSecret = process.env.CONTENTFUL_WEBHOOK_SECRET || 'ouRdtEWBClayl75vda53_B-MDOcqLB1DjiG0lIN-zpDoQ7ahBswgWZVDYycYl4bG';

console.log('🎯 Contentful Webhook テスト');
console.log('='.repeat(50));
console.log(`テストタイプ: ${testType}`);
console.log(`URL: ${baseUrl}/api/revalidate`);
console.log(`シークレット: ${webhookSecret.substring(0, 10)}...`);
console.log('='.repeat(50));

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

// HTTPリクエストを送信
function sendWebhook() {
  const url = new URL(`${baseUrl}/api/revalidate`);
  const isHttps = url.protocol === 'https:';
  const client = isHttps ? https : http;
  
  const postData = JSON.stringify(payload);
  
  const options = {
    hostname: url.hostname,
    port: url.port || (isHttps ? 443 : 80),
    path: url.pathname,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${webhookSecret}`,
      'x-contentful-webhook-name': `test-${testType}`,
      'User-Agent': 'Contentful-Webhook/1.0 (Test)',
      'Content-Length': Buffer.byteLength(postData)
    }
  };
  
  console.log('🚀 Webhook送信中...');
  
  const req = client.request(options, (res) => {
    console.log(`📡 レスポンス: ${res.statusCode} ${res.statusMessage}`);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const result = JSON.parse(data);
        console.log('✅ レスポンス内容:');
        console.log(JSON.stringify(result, null, 2));
        
        if (res.statusCode === 200 && result.success) {
          console.log('');
          console.log('🎉 テスト成功! Webhookが正常に動作しています。');
          console.log('');
          console.log('📋 再検証されたリソース:');
          if (result.revalidated?.paths) {
            result.revalidated.paths.forEach(path => {
              console.log(`  📄 ${baseUrl}${path}`);
            });
          }
          if (result.revalidated?.tags) {
            console.log('🏷️ 再検証されたキャッシュタグ:');
            result.revalidated.tags.forEach(tag => {
              console.log(`  🔖 ${tag}`);
            });
          }
        } else {
          console.log('');
          console.log('❌ テスト失敗。上記のエラー内容を確認してください。');
        }
      } catch (error) {
        console.log('📄 Raw レスポンス:', data);
        console.error('❌ JSON解析エラー:', error.message);
      }
    });
  });
  
  req.on('error', (error) => {
    console.error('💥 リクエストエラー:', error.message);
    console.log('');
    console.log('🔧 トラブルシューティング:');
    console.log('  1. Next.jsの開発サーバーが起動していることを確認');
    console.log('  2. URLが正しいことを確認');
    console.log('  3. 環境変数 CONTENTFUL_WEBHOOK_SECRET が設定されていることを確認');
  });
  
  // データを送信
  req.write(postData);
  req.end();
}

// テスト実行
sendWebhook();

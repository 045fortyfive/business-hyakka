#!/usr/bin/env node

/**
 * Contentful データ内容詳細確認ツール
 */

const https = require('https');

const CONTENTFUL_SPACE_ID = 'vxy009lryi3x';
const CONTENTFUL_ACCESS_TOKEN = 'qLylkb9h2iMqBUPBh6JXy3Wk5WQWHdJ91LaI8SKkb60';
const CONTENTFUL_ENVIRONMENT = 'master';

console.log('🔍 Contentful コンテンツ詳細確認');
console.log('='.repeat(50));

function callContentfulAPI(endpoint, params = {}) {
  return new Promise((resolve, reject) => {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    
    const path = `/spaces/${CONTENTFUL_SPACE_ID}/environments/${CONTENTFUL_ENVIRONMENT}${endpoint}?${searchParams.toString()}`;
    
    const options = {
      hostname: 'cdn.contentful.com',
      port: 443,
      path: path,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            resolve(JSON.parse(data));
          } else {
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        } catch (error) {
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

async function analyzeContent() {
  try {
    // 1. 全コンテンツを取得
    console.log('📋 1. 全コンテンツ取得');
    console.log('-'.repeat(30));
    
    const allContent = await callContentfulAPI('/entries', {
      content_type: 'content',
      limit: 10,
      include: 2
    });
    
    console.log(`Total content entries: ${allContent.total}`);
    console.log(`Retrieved: ${allContent.items.length}`);
    
    // 2. 各エントリの詳細確認
    console.log('\n📄 2. エントリ詳細:');
    console.log('-'.repeat(30));
    
    allContent.items.forEach((item, index) => {
      console.log(`\n[${index + 1}] ${item.sys.id}`);
      console.log(`  Title: ${item.fields?.title || 'NO TITLE'}`);
      console.log(`  Slug: ${item.fields?.slug || 'NO SLUG'}`);
      console.log(`  Content Type Field: "${item.fields?.contentType || 'NO CONTENT TYPE'}"`);
      console.log(`  Featured Image: ${item.fields?.featuredImage ? 'YES' : 'NO'}`);
      
      if (item.fields?.featuredImage) {
        const img = item.fields.featuredImage;
        if (img.fields?.file?.url) {
          console.log(`    Image URL: ${img.fields.file.url}`);
        } else {
          console.log(`    Image: Invalid structure`);
          console.log(`    Image sys.id: ${img.sys?.id}`);
        }
      }
      
      if (item.fields?.category) {
        if (Array.isArray(item.fields.category)) {
          console.log(`  Categories: ${item.fields.category.length} items`);
          item.fields.category.forEach((cat, catIndex) => {
            console.log(`    [${catIndex + 1}] ${cat.fields?.name || cat.sys?.id || 'UNKNOWN'}`);
          });
        } else {
          console.log(`  Category: ${item.fields.category.fields?.name || item.fields.category.sys?.id || 'UNKNOWN'}`);
        }
      } else {
        console.log(`  Category: NO CATEGORY`);
      }
      
      console.log(`  All Fields: ${Object.keys(item.fields || {}).join(', ')}`);
    });
    
    // 3. contentTypeフィールドの値を調査
    console.log('\n🔍 3. contentType フィールド値の分析:');
    console.log('-'.repeat(40));
    
    const contentTypes = {};
    allContent.items.forEach(item => {
      const ctValue = item.fields?.contentType;
      if (ctValue) {
        contentTypes[ctValue] = (contentTypes[ctValue] || 0) + 1;
      } else {
        contentTypes['[EMPTY]'] = (contentTypes['[EMPTY]'] || 0) + 1;
      }
    });
    
    console.log('ContentType field values:');
    Object.entries(contentTypes).forEach(([type, count]) => {
      console.log(`  "${type}": ${count} entries`);
    });
    
    // 4. 特定のcontentTypeでフィルタリングテスト
    console.log('\n🧪 4. フィルタリングテスト:');
    console.log('-'.repeat(30));
    
    for (const [type, count] of Object.entries(contentTypes)) {
      if (type !== '[EMPTY]') {
        try {
          const filtered = await callContentfulAPI('/entries', {
            content_type: 'content',
            'fields.contentType': type,
            limit: 3
          });
          
          console.log(`✅ "${type}": ${filtered.total} total, ${filtered.items.length} retrieved`);
          
          if (filtered.items.length > 0) {
            filtered.items.forEach((item, idx) => {
              console.log(`   [${idx + 1}] ${item.fields?.title || 'NO TITLE'}`);
            });
          }
        } catch (error) {
          console.log(`❌ "${type}": Error - ${error.message}`);
        }
      }
    }
    
    // 5. カテゴリ確認
    console.log('\n🏷️ 5. カテゴリ確認:');
    console.log('-'.repeat(20));
    
    try {
      const categories = await callContentfulAPI('/entries', {
        content_type: 'category',
        limit: 10
      });
      
      console.log(`Found ${categories.total} categories:`);
      categories.items.forEach((cat, index) => {
        console.log(`  [${index + 1}] ${cat.fields?.name || 'NO NAME'} (${cat.sys.id})`);
      });
    } catch (error) {
      console.log(`❌ Categories error: ${error.message}`);
    }
    
    // 6. 修正提案
    console.log('\n💡 6. Next.js API修正提案:');
    console.log('-'.repeat(30));
    
    console.log('現在のCONTENT_TYPES設定を確認が必要:');
    Object.keys(contentTypes).forEach(type => {
      if (type !== '[EMPTY]') {
        console.log(`  ARTICLE: "${type}" // 現在の値`);
      }
    });
    
    console.log('\n推奨修正:');
    console.log('1. src/lib/types.ts でCONTENT_TYPES.ARTICLEの値を確認');
    console.log('2. 実際のcontentTypeフィールド値に合わせて修正');
    console.log('3. 一時的にcontentTypeフィルタを削除してテスト');
    
  } catch (error) {
    console.error('❌ Analysis failed:', error.message);
  }
}

analyzeContent();

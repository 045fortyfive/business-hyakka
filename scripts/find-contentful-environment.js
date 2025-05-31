#!/usr/bin/env node

/**
 * Contentful 設定診断ツール（Environment探索）
 */

const https = require('https');

const CONTENTFUL_SPACE_ID = 'vxy009lryi3x';
const CONTENTFUL_ACCESS_TOKEN = 'qLylkb9h2iMqBUPBh6JXy3Wk5WQWHdJ91LaI8SKkb60';

console.log('🔍 Contentful Environment 診断');
console.log('='.repeat(50));

// Space情報を取得
function getSpaceInfo() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'cdn.contentful.com',
      port: 443,
      path: `/spaces/${CONTENTFUL_SPACE_ID}`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    console.log(`📡 Getting space info: https://cdn.contentful.com/spaces/${CONTENTFUL_SPACE_ID}`);
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const result = JSON.parse(data);
            console.log('✅ Space found:');
            console.log(`   Name: ${result.name}`);
            console.log(`   ID: ${result.sys.id}`);
            console.log(`   Default Locale: ${result.defaultLocale}`);
            resolve(result);
          } else {
            console.log(`❌ HTTP Error: ${res.statusCode}`);
            console.log(`Response: ${data}`);
            reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          }
        } catch (error) {
          console.log(`❌ JSON Parse Error: ${error.message}`);
          reject(error);
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

// Environment一覧を取得
function getEnvironments() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.contentful.com', // Management API
      port: 443,
      path: `/spaces/${CONTENTFUL_SPACE_ID}/environments`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    console.log(`📡 Getting environments: https://api.contentful.com/spaces/${CONTENTFUL_SPACE_ID}/environments`);
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode === 200) {
            const result = JSON.parse(data);
            console.log(`✅ Found ${result.items.length} environments:`);
            result.items.forEach(env => {
              console.log(`   - ${env.sys.id} (${env.name || 'No name'})`);
            });
            resolve(result.items);
          } else {
            console.log(`❌ HTTP Error: ${res.statusCode}`);
            console.log(`Response: ${data}`);
            // CDN APIで直接試す
            resolve([]);
          }
        } catch (error) {
          console.log(`❌ JSON Parse Error: ${error.message}`);
          resolve([]);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`⚠️ Management API failed: ${error.message}`);
      resolve([]);
    });
    
    req.end();
  });
}

// 各environmentでデータ取得を試行
function testEnvironment(envId) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'cdn.contentful.com',
      port: 443,
      path: `/spaces/${CONTENTFUL_SPACE_ID}/environments/${envId}/entries?limit=1`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    console.log(`🧪 Testing environment: ${envId}`);
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            console.log(`   ✅ ${envId}: ${result.total} entries available`);
            resolve({ envId, success: true, total: result.total, items: result.items });
          } catch (error) {
            console.log(`   ❌ ${envId}: JSON parse error`);
            resolve({ envId, success: false, error: 'JSON parse error' });
          }
        } else {
          console.log(`   ❌ ${envId}: HTTP ${res.statusCode}`);
          resolve({ envId, success: false, error: `HTTP ${res.statusCode}` });
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ ${envId}: ${error.message}`);
      resolve({ envId, success: false, error: error.message });
    });
    
    req.end();
  });
}

// 一般的なenvironment名を試行
async function tryCommonEnvironments() {
  console.log('\n🔍 Common environments test:');
  console.log('-'.repeat(30));
  
  const commonEnvs = ['master', 'main', 'production', 'prod', 'staging', 'dev', 'development'];
  const results = [];
  
  for (const env of commonEnvs) {
    const result = await testEnvironment(env);
    results.push(result);
  }
  
  return results.filter(r => r.success);
}

// Content Typeを確認
async function checkContentTypes(envId) {
  return new Promise((resolve) => {
    const options = {
      hostname: 'cdn.contentful.com',
      port: 443,
      path: `/spaces/${CONTENTFUL_SPACE_ID}/environments/${envId}/content_types`,
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${CONTENTFUL_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      }
    };
    
    console.log(`📋 Checking content types in ${envId}:`);
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            console.log(`   Content types (${result.items.length}):`);
            result.items.forEach(ct => {
              console.log(`   - ${ct.sys.id}: ${ct.name}`);
            });
            resolve(result.items);
          } catch (error) {
            console.log(`   ❌ JSON parse error`);
            resolve([]);
          }
        } else {
          console.log(`   ❌ HTTP ${res.statusCode}`);
          resolve([]);
        }
      });
    });
    
    req.on('error', (error) => {
      console.log(`   ❌ ${error.message}`);
      resolve([]);
    });
    
    req.end();
  });
}

// メイン実行
async function runDiagnosis() {
  try {
    // 1. Space情報取得
    const spaceInfo = await getSpaceInfo();
    
    // 2. Environment一覧取得（Management API）
    console.log('\n📁 Environments:');
    console.log('-'.repeat(30));
    const environments = await getEnvironments();
    
    // 3. 一般的なenvironment名で試行
    const workingEnvs = await tryCommonEnvironments();
    
    if (workingEnvs.length === 0) {
      console.log('\n❌ No working environments found!');
      console.log('\n🔧 Troubleshooting steps:');
      console.log('1. Check if the access token has correct permissions');
      console.log('2. Verify the space ID is correct');
      console.log('3. Check if there are any content entries published');
      console.log('4. Try using Management API token instead of Delivery API token');
    } else {
      console.log(`\n✅ Found ${workingEnvs.length} working environment(s):`);
      
      for (const env of workingEnvs) {
        console.log(`\n🌍 Environment: ${env.envId}`);
        console.log(`   Total entries: ${env.total}`);
        
        // Content types確認
        await checkContentTypes(env.envId);
        
        // First entry details
        if (env.items && env.items.length > 0) {
          const firstItem = env.items[0];
          console.log(`   First entry:`);
          console.log(`   - ID: ${firstItem.sys.id}`);
          console.log(`   - Content Type: ${firstItem.sys.contentType.sys.id}`);
          console.log(`   - Fields: ${Object.keys(firstItem.fields || {}).join(', ')}`);
        }
      }
      
      console.log('\n🎯 Recommended .env.local update:');
      console.log('-'.repeat(40));
      const bestEnv = workingEnvs[0];
      console.log(`CONTENTFUL_ENVIRONMENT=${bestEnv.envId}`);
      console.log(`# This environment has ${bestEnv.total} entries`);
    }
    
  } catch (error) {
    console.error('❌ Diagnosis failed:', error.message);
  }
}

runDiagnosis();

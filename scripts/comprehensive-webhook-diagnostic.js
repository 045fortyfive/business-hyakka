#!/usr/bin/env node

/**
 * 包括的Webhook診断ツール
 * 「更新されない場合」の原因特定と解決策提案
 */

const https = require('https');
const fs = require('fs');

const PRODUCTION_URL = 'https://www.skillpedia.jp';
const WEBHOOK_SECRET = 'ouRdtEWBClayl75vda53_B-MDOcqLB1DjiG0lIN-zpDoQ7ahBswgWZVDYycYl4bG';

// 診断結果を保存する配列
const diagnosticResults = [];

function addResult(category, test, status, details, solution = null) {
  diagnosticResults.push({
    category,
    test,
    status, // 'PASS', 'FAIL', 'WARN', 'INFO'
    details,
    solution,
    timestamp: new Date().toISOString()
  });
}

// HTTPリクエストのヘルパー関数
function makeRequest(options, postData = null) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: res.headers['content-type']?.includes('application/json') ? JSON.parse(data) : data
          });
        } catch (error) {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (postData) {
      req.write(postData);
    }
    req.end();
  });
}

// 1. ヘルスチェック診断
async function testHealthCheck() {
  console.log('🩺 ヘルスチェック診断開始...');
  
  try {
    const response = await makeRequest({
      hostname: 'www.skillpedia.jp',
      port: 443,
      path: '/api/revalidate',
      method: 'GET',
      headers: { 'User-Agent': 'Diagnostic/1.0' }
    });
    
    if (response.statusCode === 200 && response.body.status === 'OK') {
      addResult('HealthCheck', 'Endpoint Availability', 'PASS', 
        `Status: ${response.body.status}, Environment: ${response.body.environment}`);
      
      if (response.body.secretConfigured) {
        addResult('HealthCheck', 'Secret Configuration', 'PASS', 'Webhook secret is properly configured');
      } else {
        addResult('HealthCheck', 'Secret Configuration', 'FAIL', 
          'Webhook secret not configured', 
          'Check CONTENTFUL_WEBHOOK_SECRET in Vercel environment variables');
      }
    } else {
      addResult('HealthCheck', 'Endpoint Availability', 'FAIL', 
        `Unexpected response: ${response.statusCode}`, 
        'Check Vercel deployment status and API route implementation');
    }
  } catch (error) {
    addResult('HealthCheck', 'Endpoint Availability', 'FAIL', 
      `Connection failed: ${error.message}`, 
      'Check domain name, network connection, and Vercel deployment');
  }
}

// 2. 認証テスト（正しいトークン）
async function testValidAuth() {
  console.log('🔐 正しい認証でのテスト...');
  
  const testPayload = {
    sys: { id: 'auth-test', contentType: { sys: { id: 'content' } } },
    fields: { title: { 'en-US': 'Auth Test' } }
  };
  
  try {
    const response = await makeRequest({
      hostname: 'www.skillpedia.jp',
      port: 443,
      path: '/api/revalidate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WEBHOOK_SECRET}`,
        'x-contentful-webhook-name': 'auth-test'
      }
    }, JSON.stringify(testPayload));
    
    if (response.statusCode === 200 && response.body.success) {
      addResult('Authentication', 'Valid Token', 'PASS', 
        `Successful authentication and revalidation of ${response.body.revalidated?.paths?.length || 0} paths`);
    } else {
      addResult('Authentication', 'Valid Token', 'FAIL', 
        `Auth failed: ${response.statusCode} - ${JSON.stringify(response.body)}`,
        'Verify webhook secret matches between Contentful and Vercel');
    }
  } catch (error) {
    addResult('Authentication', 'Valid Token', 'FAIL', 
      `Request failed: ${error.message}`, 
      'Check network connection and server availability');
  }
}

// 3. 認証テスト（間違ったトークン）
async function testInvalidAuth() {
  console.log('🚫 間違った認証でのテスト...');
  
  const testPayload = {
    sys: { id: 'auth-test-invalid', contentType: { sys: { id: 'content' } } }
  };
  
  try {
    const response = await makeRequest({
      hostname: 'www.skillpedia.jp',
      port: 443,
      path: '/api/revalidate',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer invalid-token-12345',
        'x-contentful-webhook-name': 'auth-test-invalid'
      }
    }, JSON.stringify(testPayload));
    
    if (response.statusCode === 401) {
      addResult('Authentication', 'Invalid Token Rejection', 'PASS', 
        'Correctly rejected invalid authentication token');
    } else {
      addResult('Authentication', 'Invalid Token Rejection', 'WARN', 
        `Unexpected response to invalid token: ${response.statusCode}`,
        'Security issue: Invalid tokens should be rejected with 401');
    }
  } catch (error) {
    addResult('Authentication', 'Invalid Token Rejection', 'FAIL', 
      `Request failed: ${error.message}`);
  }
}

// 4. 各コンテンツタイプのテスト
async function testContentTypes() {
  console.log('📄 コンテンツタイプ別テスト...');
  
  const contentTypes = [
    { id: 'content', name: '記事', slug: 'test-article' },
    { id: 'category', name: 'カテゴリ', slug: 'test-category' },
    { id: 'tag', name: 'タグ', slug: 'test-tag' }
  ];
  
  for (const contentType of contentTypes) {
    const testPayload = {
      sys: { 
        id: `test-${contentType.id}-${Date.now()}`, 
        contentType: { sys: { id: contentType.id } } 
      },
      fields: { 
        title: { 'en-US': `Test ${contentType.name}` },
        slug: { 'en-US': contentType.slug },
        name: { 'en-US': `Test ${contentType.name}` }
      }
    };
    
    try {
      const response = await makeRequest({
        hostname: 'www.skillpedia.jp',
        port: 443,
        path: '/api/revalidate',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${WEBHOOK_SECRET}`,
          'x-contentful-webhook-name': `test-${contentType.id}-published`
        }
      }, JSON.stringify(testPayload));
      
      if (response.statusCode === 200 && response.body.success) {
        addResult('ContentTypes', `${contentType.name} Revalidation`, 'PASS', 
          `Successfully revalidated ${response.body.revalidated?.paths?.length || 0} paths for ${contentType.name}`);
      } else {
        addResult('ContentTypes', `${contentType.name} Revalidation`, 'FAIL', 
          `Failed to revalidate ${contentType.name}: ${JSON.stringify(response.body)}`,
          `Check content type handling for '${contentType.id}' in /api/revalidate/route.ts`);
      }
    } catch (error) {
      addResult('ContentTypes', `${contentType.name} Revalidation`, 'FAIL', 
        `Request failed: ${error.message}`);
    }
  }
}

// 5. ページアクセス性テスト
async function testPageAccessibility() {
  console.log('🌐 主要ページのアクセス性テスト...');
  
  const pages = [
    { path: '/', name: 'ホームページ' },
    { path: '/articles', name: '記事一覧' },
    { path: '/categories', name: 'カテゴリ一覧' },
    { path: '/search', name: '検索ページ' }
  ];
  
  for (const page of pages) {
    try {
      const response = await makeRequest({
        hostname: 'www.skillpedia.jp',
        port: 443,
        path: page.path,
        method: 'GET',
        headers: { 'User-Agent': 'PageTest/1.0' }
      });
      
      if (response.statusCode === 200) {
        addResult('PageAccess', `${page.name} (${page.path})`, 'PASS', 
          `Page accessible with status ${response.statusCode}`);
      } else {
        addResult('PageAccess', `${page.name} (${page.path})`, 'FAIL', 
          `Page returned status ${response.statusCode}`,
          'Check page implementation and routing');
      }
    } catch (error) {
      addResult('PageAccess', `${page.name} (${page.path})`, 'FAIL', 
        `Page access failed: ${error.message}`);
    }
  }
}

// 6. レスポンス時間テスト
async function testResponseTimes() {
  console.log('⏱️ レスポンス時間テスト...');
  
  const tests = [
    { name: 'Webhook Endpoint', method: 'GET', path: '/api/revalidate' },
    { name: 'Home Page', method: 'GET', path: '/' },
    { name: 'Articles Page', method: 'GET', path: '/articles' }
  ];
  
  for (const test of tests) {
    const startTime = Date.now();
    
    try {
      const response = await makeRequest({
        hostname: 'www.skillpedia.jp',
        port: 443,
        path: test.path,
        method: test.method,
        headers: { 'User-Agent': 'PerformanceTest/1.0' }
      });
      
      const responseTime = Date.now() - startTime;
      
      if (responseTime < 1000) {
        addResult('Performance', `${test.name} Response Time`, 'PASS', 
          `Response time: ${responseTime}ms (excellent)`);
      } else if (responseTime < 3000) {
        addResult('Performance', `${test.name} Response Time`, 'WARN', 
          `Response time: ${responseTime}ms (acceptable but could be improved)`,
          'Consider optimizing server performance or CDN configuration');
      } else {
        addResult('Performance', `${test.name} Response Time`, 'FAIL', 
          `Response time: ${responseTime}ms (too slow)`,
          'Investigate server performance issues, database queries, or network latency');
      }
    } catch (error) {
      addResult('Performance', `${test.name} Response Time`, 'FAIL', 
        `Request failed: ${error.message}`);
    }
  }
}

// 7. Contentful設定確認（模擬）
function checkContentfulConfiguration() {
  console.log('⚙️ Contentful設定確認...');
  
  // 実際のContentful APIは呼ばないが、チェックポイントを提示
  addResult('ContentfulConfig', 'Webhook URL', 'INFO', 
    'Expected: https://www.skillpedia.jp/api/revalidate',
    'Verify in Contentful > Settings > Webhooks');
    
  addResult('ContentfulConfig', 'Authentication Header', 'INFO', 
    'Expected: Authorization: Bearer ouRdt...Y4bG',
    'Verify header name and token value in Contentful webhook settings');
    
  addResult('ContentfulConfig', 'Content Types Filter', 'INFO', 
    'Expected: content, category, tag',
    'Check if webhook is filtered to relevant content types only');
    
  addResult('ContentfulConfig', 'Events Filter', 'INFO', 
    'Expected: Entry published, Entry unpublished, Entry deleted',
    'Verify which events trigger the webhook');
}

// 8. 診断結果のレポート生成
function generateReport() {
  console.log('\n' + '='.repeat(80));
  console.log('📊 詳細診断レポート');
  console.log('='.repeat(80));
  
  const categories = [...new Set(diagnosticResults.map(r => r.category))];
  
  categories.forEach(category => {
    console.log(`\n📂 ${category}`);
    console.log('-'.repeat(50));
    
    const categoryResults = diagnosticResults.filter(r => r.category === category);
    
    categoryResults.forEach(result => {
      const statusIcon = {
        'PASS': '✅',
        'FAIL': '❌',
        'WARN': '⚠️',
        'INFO': 'ℹ️'
      }[result.status];
      
      console.log(`${statusIcon} ${result.test}`);
      console.log(`   ${result.details}`);
      
      if (result.solution) {
        console.log(`   💡 Solution: ${result.solution}`);
      }
      console.log('');
    });
  });
  
  // 統計情報
  const stats = {
    PASS: diagnosticResults.filter(r => r.status === 'PASS').length,
    FAIL: diagnosticResults.filter(r => r.status === 'FAIL').length,
    WARN: diagnosticResults.filter(r => r.status === 'WARN').length,
    INFO: diagnosticResults.filter(r => r.status === 'INFO').length
  };
  
  console.log('\n📈 統計情報');
  console.log('-'.repeat(30));
  console.log(`✅ 成功: ${stats.PASS}`);
  console.log(`❌ 失敗: ${stats.FAIL}`);
  console.log(`⚠️ 警告: ${stats.WARN}`);
  console.log(`ℹ️ 情報: ${stats.INFO}`);
  
  // 総合評価
  console.log('\n🎯 総合評価');
  console.log('-'.repeat(30));
  
  if (stats.FAIL === 0) {
    if (stats.WARN === 0) {
      console.log('🎉 EXCELLENT: すべてのテストが正常に完了しました！');
    } else {
      console.log('🟡 GOOD: 基本機能は正常ですが、改善の余地があります。');
    }
  } else {
    console.log('🔴 NEEDS ATTENTION: 重要な問題が見つかりました。解決策を確認してください。');
  }
  
  // ファイルに保存
  const reportData = {
    timestamp: new Date().toISOString(),
    stats,
    results: diagnosticResults
  };
  
  try {
    fs.writeFileSync('webhook-diagnostic-report.json', JSON.stringify(reportData, null, 2));
    console.log('\n💾 詳細レポートが webhook-diagnostic-report.json に保存されました。');
  } catch (error) {
    console.log(`\n⚠️ レポート保存失敗: ${error.message}`);
  }
}

// メイン実行関数
async function runDiagnostic() {
  console.log('🚀 Contentful Webhook 包括的診断開始');
  console.log('時刻:', new Date().toLocaleString('ja-JP'));
  console.log('対象:', PRODUCTION_URL);
  console.log('');
  
  try {
    await testHealthCheck();
    await testValidAuth();
    await testInvalidAuth();
    await testContentTypes();
    await testPageAccessibility();
    await testResponseTimes();
    checkContentfulConfiguration();
    
    generateReport();
    
  } catch (error) {
    console.error('💥 診断中にエラーが発生しました:', error);
    addResult('System', 'Diagnostic Process', 'FAIL', 
      `Diagnostic failed: ${error.message}`,
      'Check network connection and retry diagnostic');
    generateReport();
  }
}

// 実行
runDiagnostic();

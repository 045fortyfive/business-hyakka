// Contentful Webhook デバッグスクリプト
// Webhookが呼び出されない原因を特定

const WEBHOOK_URL = 'https://www.skillpedia.jp/api/revalidate';
const WEBHOOK_SECRET = 'ouRdtEWBClayl75vda53_B-MDOcqLB1DjiG0lIN-zpDoQ7ahBswgWZVDYycYl4bG';

// 1. Webhook エンドポイントの接続テスト
async function testWebhookConnectivity() {
  console.log('🌐 Webhook エンドポイント接続テスト...');
  
  try {
    // GET リクエストでヘルスチェック
    const response = await fetch(WEBHOOK_URL, {
      method: 'GET'
    });
    
    console.log('📊 接続結果:');
    console.log('  - ステータス:', response.status);
    console.log('  - ステータステキスト:', response.statusText);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ エンドポイント正常:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ エンドポイント異常');
    }
    
  } catch (error) {
    console.error('💥 接続エラー:', error.message);
  }
}

// 2. Webhook 認証テスト
async function testWebhookAuth() {
  console.log('\n🔐 Webhook 認証テスト...');
  
  const testPayload = {
    sys: {
      id: 'auth-test-123',
      contentType: { sys: { id: 'content' } },
      space: { sys: { id: 'vxy009lryi3x' } }
    },
    fields: {
      title: { 'en-US': '認証テスト' },
      slug: { 'en-US': 'auth-test' }
    }
  };
  
  // 正しい認証でテスト
  try {
    console.log('🔑 正しい認証でテスト...');
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WEBHOOK_SECRET}`,
        'X-Contentful-Webhook-Name': 'test-auth'
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log('  - ステータス:', response.status);
    if (response.ok) {
      console.log('✅ 認証成功');
    } else {
      console.log('❌ 認証失敗');
      const errorData = await response.json();
      console.log('  - エラー:', errorData);
    }
    
  } catch (error) {
    console.error('💥 認証テストエラー:', error.message);
  }
  
  // 間違った認証でテスト
  try {
    console.log('🚫 間違った認証でテスト...');
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer wrong-secret',
        'X-Contentful-Webhook-Name': 'test-wrong-auth'
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log('  - ステータス:', response.status);
    if (response.status === 401) {
      console.log('✅ 認証拒否正常（期待される動作）');
    } else {
      console.log('❌ 認証拒否異常');
    }
    
  } catch (error) {
    console.error('💥 間違った認証テストエラー:', error.message);
  }
}

// 3. Contentful からの実際のWebhookペイロード形式テスト
async function testContentfulPayloadFormat() {
  console.log('\n📦 Contentful ペイロード形式テスト...');
  
  // Contentfulが実際に送信する形式に近いペイロード
  const contentfulPayload = {
    metadata: {
      tags: []
    },
    sys: {
      space: {
        sys: {
          type: 'Link',
          linkType: 'Space',
          id: 'vxy009lryi3x'
        }
      },
      id: 'test-contentful-payload',
      type: 'Entry',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      environment: {
        sys: {
          id: 'master',
          type: 'Link',
          linkType: 'Environment'
        }
      },
      revision: 1,
      contentType: {
        sys: {
          type: 'Link',
          linkType: 'ContentType',
          id: 'content'
        }
      }
    },
    fields: {
      title: {
        'en-US': 'テスト記事: Contentful形式'
      },
      slug: {
        'en-US': 'test-contentful-format'
      },
      contentType: {
        'en-US': '記事'
      },
      description: {
        'en-US': 'Contentful実際のペイロード形式でのテスト'
      }
    }
  };
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/vnd.contentful.management.v1+json',
        'Authorization': `Bearer ${WEBHOOK_SECRET}`,
        'X-Contentful-Webhook-Name': 'Entry.publish',
        'X-Contentful-Topic': 'ContentManagement.Entry.publish'
      },
      body: JSON.stringify(contentfulPayload)
    });
    
    console.log('📊 Contentful形式テスト結果:');
    console.log('  - ステータス:', response.status);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Contentful形式成功');
      console.log('  - 再検証パス:', data.revalidated?.paths);
    } else {
      console.log('❌ Contentful形式失敗');
      const errorData = await response.json();
      console.log('  - エラー:', errorData);
    }
    
  } catch (error) {
    console.error('💥 Contentful形式テストエラー:', error.message);
  }
}

// 4. DNS・ネットワーク確認
async function testNetworkConnectivity() {
  console.log('\n🌍 ネットワーク接続確認...');
  
  const testUrls = [
    'https://www.skillpedia.jp',
    'https://www.skillpedia.jp/api/revalidate',
    'https://cdn.contentful.com',
    'https://api.contentful.com'
  ];
  
  for (const url of testUrls) {
    try {
      console.log(`🔗 テスト中: ${url}`);
      const response = await fetch(url, { method: 'HEAD' });
      console.log(`  ✅ ${url} - ${response.status}`);
    } catch (error) {
      console.log(`  ❌ ${url} - ${error.message}`);
    }
  }
}

// 5. Webhook URL の詳細確認
async function analyzeWebhookUrl() {
  console.log('\n🔍 Webhook URL 詳細分析...');
  
  const url = new URL(WEBHOOK_URL);
  console.log('📋 URL詳細:');
  console.log('  - プロトコル:', url.protocol);
  console.log('  - ホスト:', url.hostname);
  console.log('  - ポート:', url.port || '443 (HTTPS default)');
  console.log('  - パス:', url.pathname);
  console.log('  - 完全URL:', url.toString());
  
  // SSL証明書の確認（簡易）
  try {
    const response = await fetch(url.origin, { method: 'HEAD' });
    console.log('✅ SSL接続正常');
  } catch (error) {
    console.log('❌ SSL接続問題:', error.message);
  }
}

// メイン実行
async function main() {
  console.log('🔍 Contentful Webhook 完全デバッグ');
  console.log('==========================================');
  
  await testWebhookConnectivity();
  await testWebhookAuth();
  await testContentfulPayloadFormat();
  await testNetworkConnectivity();
  await analyzeWebhookUrl();
  
  console.log('\n🎯 デバッグ完了');
  console.log('==========================================');
  
  console.log('\n📋 次のステップ:');
  console.log('1. 上記の結果を確認');
  console.log('2. Contentful管理画面でWebhook設定を再確認');
  console.log('3. Contentful側でテストWebhookを実行');
  console.log('4. 実際のコンテンツ更新でテスト');
}

// 実行
main().catch(console.error);

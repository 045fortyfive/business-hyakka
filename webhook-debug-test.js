// Contentful Webhook デバッグテストスクリプト
// 本番環境でWebhookが正常に動作しているかを確認

const WEBHOOK_URL = 'https://www.skillpedia.jp/api/revalidate';
const WEBHOOK_SECRET = 'ouRdtEWBClayl75vda53_B-MDOcqLB1DjiG0lIN-zpDoQ7ahBswgWZVDYycYl4bG';

// テスト用のWebhookペイロード（実際のContentfulから送信されるものと同じ形式）
const testPayload = {
  sys: {
    id: 'test-entry-123',
    contentType: {
      sys: {
        id: 'content'
      }
    },
    space: {
      sys: {
        id: 'vxy009lryi3x'
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  fields: {
    title: {
      'en-US': 'テスト記事: Webhook動作確認'
    },
    slug: {
      'en-US': 'test-webhook-verification'
    },
    contentType: {
      'en-US': '記事'
    },
    description: {
      'en-US': 'Webhookが正常に動作しているかを確認するためのテスト記事です。'
    }
  }
};

async function testWebhook() {
  console.log('🚀 Webhook テスト開始...');
  console.log('📡 URL:', WEBHOOK_URL);
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WEBHOOK_SECRET}`,
        'X-Contentful-Webhook-Name': 'test-entry-published'
      },
      body: JSON.stringify(testPayload)
    });
    
    console.log('📊 レスポンス状況:');
    console.log('  - ステータス:', response.status);
    console.log('  - ステータステキスト:', response.statusText);
    
    const responseData = await response.json();
    console.log('📦 レスポンスデータ:', JSON.stringify(responseData, null, 2));
    
    if (response.ok) {
      console.log('✅ Webhook テスト成功！');
      console.log('🔄 再検証されたパス:', responseData.revalidated?.paths);
      console.log('🏷️ 再検証されたタグ:', responseData.revalidated?.tags);
    } else {
      console.log('❌ Webhook テスト失敗');
      console.log('エラー:', responseData);
    }
    
  } catch (error) {
    console.error('💥 Webhook テスト中にエラーが発生:', error);
  }
}

async function checkWebhookHealth() {
  console.log('🩺 Webhook ヘルスチェック...');
  
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'GET'
    });
    
    const healthData = await response.json();
    console.log('🏥 ヘルスチェック結果:', JSON.stringify(healthData, null, 2));
    
  } catch (error) {
    console.error('💥 ヘルスチェック中にエラーが発生:', error);
  }
}

// メイン実行
async function main() {
  console.log('🔍 Contentful Webhook デバッグテスト');
  console.log('=====================================');
  
  // 1. ヘルスチェック
  await checkWebhookHealth();
  
  console.log('\n');
  
  // 2. Webhookテスト
  await testWebhook();
  
  console.log('\n🎯 テスト完了');
  console.log('=====================================');
}

// Node.js環境で実行
if (typeof window === 'undefined') {
  main().catch(console.error);
}

// ブラウザ環境で実行する場合
if (typeof window !== 'undefined') {
  window.testContentfulWebhook = main;
  console.log('ブラウザのコンソールで window.testContentfulWebhook() を実行してください');
}

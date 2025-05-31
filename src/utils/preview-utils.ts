/**
 * Preview機能用の設定確認ユーティリティ
 */

/**
 * Preview機能の設定状況を確認する
 */
export function checkPreviewConfiguration() {
  const config = {
    previewSecret: {
      configured: !!process.env.CONTENTFUL_PREVIEW_SECRET,
      value: process.env.CONTENTFUL_PREVIEW_SECRET ? 
        `${process.env.CONTENTFUL_PREVIEW_SECRET.substring(0, 10)}...` : 
        'Not configured'
    },
    previewAccessToken: {
      configured: !!process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN,
      value: process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN ? 
        `${process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN.substring(0, 10)}...` : 
        'Not configured'
    },
    spaceId: {
      configured: !!process.env.CONTENTFUL_SPACE_ID,
      value: process.env.CONTENTFUL_SPACE_ID || 'Not configured'
    },
    environment: {
      configured: !!process.env.CONTENTFUL_ENVIRONMENT,
      value: process.env.CONTENTFUL_ENVIRONMENT || 'master'
    },
    webhookSecret: {
      configured: !!process.env.CONTENTFUL_WEBHOOK_SECRET,
      value: process.env.CONTENTFUL_WEBHOOK_SECRET ? 
        `${process.env.CONTENTFUL_WEBHOOK_SECRET.substring(0, 10)}...` : 
        'Not configured'
    }
  };

  const allConfigured = Object.values(config).every(item => item.configured);

  return {
    allConfigured,
    config,
    status: allConfigured ? 'ready' : 'incomplete'
  };
}

/**
 * Contentful Preview URLを生成する
 */
export function generatePreviewUrl(
  baseUrl: string,
  contentType: string,
  slug: string,
  secret?: string
): string {
  const previewSecret = secret || process.env.CONTENTFUL_PREVIEW_SECRET;
  
  if (!previewSecret) {
    throw new Error('Preview secret is not configured');
  }

  const params = new URLSearchParams({
    secret: previewSecret,
    slug,
    type: contentType
  });

  return `${baseUrl}/api/preview?${params.toString()}`;
}

/**
 * 設定状況を表示する（開発用）
 */
export function logPreviewConfiguration() {
  const { allConfigured, config, status } = checkPreviewConfiguration();
  
  console.log('\n🔍=== Preview Configuration Check ===');
  console.log(`📊 Status: ${status.toUpperCase()}`);
  console.log(`✅ All configured: ${allConfigured}`);
  
  Object.entries(config).forEach(([key, value]) => {
    const icon = value.configured ? '✅' : '❌';
    console.log(`${icon} ${key}: ${value.value}`);
  });
  
  if (!allConfigured) {
    console.log('\n⚠️ Missing configuration items detected!');
    console.log('📖 Please check your .env.local file');
  }
  
  console.log('=====================================\n');
  
  return { allConfigured, config, status };
}

/**
 * Preview URLの例を生成する（開発・テスト用）
 */
export function generateExamplePreviewUrls(baseUrl: string = 'https://www.skillpedia.jp') {
  try {
    return {
      article: generatePreviewUrl(baseUrl, 'article', 'seiseiai_gainen'),
      video: generatePreviewUrl(baseUrl, 'video', 'raterarusinking'),
      audio: generatePreviewUrl(baseUrl, 'audio', 'gijirokunokotsu'),
      'mdx-article': generatePreviewUrl(baseUrl, 'mdx-article', 'ai-skills'),
      category: generatePreviewUrl(baseUrl, 'category', 'sikouhou')
    };
  } catch (error) {
    console.error('Failed to generate example URLs:', error);
    return null;
  }
}

/**
 * ContentfulのPreview URL設定用テンプレートを生成
 */
export function generateContentfulPreviewTemplate(baseUrl: string = 'https://www.skillpedia.jp') {
  const secret = process.env.CONTENTFUL_PREVIEW_SECRET;
  
  if (!secret) {
    return {
      error: 'Preview secret not configured',
      template: null
    };
  }

  return {
    error: null,
    template: {
      name: 'Skillpedia Preview',
      description: 'Preview content on Skillpedia website',
      url: `${baseUrl}/api/preview?secret=${secret}&type={entry.contentType.sys.id}&slug={entry.fields.slug}`,
      // Alternative URL patterns for different content types
      patterns: {
        article: `${baseUrl}/api/preview?secret=${secret}&type=article&slug={entry.fields.slug}`,
        video: `${baseUrl}/api/preview?secret=${secret}&type=video&slug={entry.fields.slug}`,
        audio: `${baseUrl}/api/preview?secret=${secret}&type=audio&slug={entry.fields.slug}`,
        category: `${baseUrl}/api/preview?secret=${secret}&type=category&slug={entry.fields.slug}`,
        'mdx-article': `${baseUrl}/api/preview?secret=${secret}&type=mdx-article&slug={entry.fields.slug}`
      }
    }
  };
}

/**
 * Preview機能のヘルスチェック
 */
export async function checkPreviewHealth(baseUrl: string = 'http://localhost:3000') {
  const healthChecks = [];

  try {
    // 1. Preview API endpoint check
    const previewResponse = await fetch(`${baseUrl}/api/preview`, {
      method: 'GET'
    });
    
    healthChecks.push({
      name: 'Preview API Endpoint',
      status: previewResponse.status < 500 ? 'ok' : 'error',
      details: `Status: ${previewResponse.status}`
    });

    // 2. Exit Preview API endpoint check
    const exitResponse = await fetch(`${baseUrl}/api/exit-preview`, {
      method: 'GET'
    });
    
    healthChecks.push({
      name: 'Exit Preview API Endpoint',
      status: exitResponse.status < 500 ? 'ok' : 'error',
      details: `Status: ${exitResponse.status}`
    });

    // 3. Configuration check
    const configCheck = checkPreviewConfiguration();
    healthChecks.push({
      name: 'Configuration',
      status: configCheck.allConfigured ? 'ok' : 'warning',
      details: `${Object.values(configCheck.config).filter(c => c.configured).length}/${Object.keys(configCheck.config).length} items configured`
    });

  } catch (error) {
    healthChecks.push({
      name: 'Network Connection',
      status: 'error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }

  const overallStatus = healthChecks.every(check => check.status === 'ok') ? 'healthy' : 
                       healthChecks.some(check => check.status === 'error') ? 'unhealthy' : 'warning';

  return {
    status: overallStatus,
    checks: healthChecks,
    timestamp: new Date().toISOString()
  };
}

/**
 * 開発者向けPreview設定ガイドを表示
 */
export function showPreviewSetupGuide() {
  const guide = `
🚀 Contentful Preview Setup Guide
==================================

1. Environment Variables (.env.local):
   CONTENTFUL_PREVIEW_SECRET=your_secure_secret_here
   CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token_here
   
2. Contentful Preview URL Configuration:
   Go to Settings > Content preview in your Contentful space
   Add new preview environment:
   
   Name: Skillpedia Preview
   URL: https://www.skillpedia.jp/api/preview?secret={YOUR_SECRET}&type={entry.contentType.sys.id}&slug={entry.fields.slug}
   
3. Content Type Specific URLs:
   Article: ...&type=article&slug={entry.fields.slug}
   Video: ...&type=video&slug={entry.fields.slug}
   Audio: ...&type=audio&slug={entry.fields.slug}
   Category: ...&type=category&slug={entry.fields.slug}
   
4. Testing:
   Visit /api/test-preview for testing tools
   Check logs for detailed debugging information

For more help, see the documentation or check the health status.
`;
  
  console.log(guide);
  return guide;
}

'use client';

import { useState, useEffect, useCallback } from 'react';

/**
 * プレビューモードの状態を検出するカスタムフック（改善版）
 */
export function usePreviewMode() {
  const [isPreview, setIsPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  const checkPreviewMode = useCallback(async () => {
    try {
      setError(null);

      // まずCookieベースの判定を行う（より確実）
      const cookies = document.cookie;
      const isDraftMode = cookies.includes('__prerender_bypass') || cookies.includes('__next_preview_data');

      // URLパラメータからもチェック
      const urlParams = new URLSearchParams(window.location.search);
      const hasPreviewParam = urlParams.has('preview') || urlParams.has('draft');

      const isPreviewMode = isDraftMode || hasPreviewParam;
      setIsPreview(isPreviewMode);
      setLastChecked(new Date());

      // APIが利用可能な場合のみ追加チェック（オプション）
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000); // 3秒でタイムアウト

        const response = await fetch('/api/preview-status', {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Cache-Control': 'no-cache'
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setIsPreview(data.isPreview || isPreviewMode);
        }
      } catch (apiError) {
        // APIエラーは無視して、Cookieベースの判定を使用
        console.debug('Preview status API not available, using cookie-based detection');
      }
    } catch (error) {
      console.error('Preview mode check failed:', error);
      setError(error instanceof Error ? error.message : 'Unknown error');

      // フォールバック: Cookie の存在で判定
      try {
        const cookies = document.cookie;
        const isDraftMode = cookies.includes('__prerender_bypass') || cookies.includes('__next_preview_data');
        setIsPreview(isDraftMode);
        setLastChecked(new Date());
      } catch (fallbackError) {
        console.error('Fallback preview detection failed:', fallbackError);
        setIsPreview(false);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkPreviewMode();
    
    // 30秒ごとにプレビューモードをチェック（リアルタイム性向上）
    const interval = setInterval(checkPreviewMode, 30000);
    
    return () => clearInterval(interval);
  }, [checkPreviewMode]);

  // 手動でプレビューモードを再チェックする関数
  const refreshPreviewStatus = useCallback(() => {
    setIsLoading(true);
    checkPreviewMode();
  }, [checkPreviewMode]);

  return { 
    isPreview, 
    isLoading, 
    lastChecked, 
    error,
    refreshPreviewStatus 
  };
}

/**
 * プレビューモードの状態をチェックするAPI用の簡単な実装（改善版）
 * この関数は主にデバッグ・開発用途
 */
export function isClientSidePreview(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }

  // Next.js のプレビューモード関連のCookieをチェック
  const cookies = document.cookie;
  const hasPreviewCookie = cookies.includes('__prerender_bypass') || cookies.includes('__next_preview_data');
  
  // URLパラメータからもチェック
  const urlParams = new URLSearchParams(window.location.search);
  const hasPreviewParam = urlParams.has('preview') || urlParams.has('draft');
  
  return hasPreviewCookie || hasPreviewParam;
}

/**
 * URL パラメータからプレビュー情報を抽出（改善版）
 */
export function extractPreviewInfo() {
  if (typeof window === 'undefined') {
    return null;
  }

  const url = new URL(window.location.href);
  const searchParams = url.searchParams;

  // プレビューから来た場合の情報を抽出
  return {
    fromPreview: searchParams.has('preview') || searchParams.has('draft'),
    contentType: searchParams.get('type') || searchParams.get('contentType'),
    slug: searchParams.get('slug'),
    entryId: searchParams.get('entryId') || searchParams.get('entry'),
    secret: searchParams.get('secret'),
    timestamp: searchParams.get('ts') || searchParams.get('timestamp'),
    source: searchParams.get('source') || 'unknown'
  };
}

/**
 * プレビュー情報をローカルストレージに保存（改善版）
 * （プレビューセッション中の情報保持用）
 */
export function storePreviewSession(data: {
  contentType?: string;
  slug?: string;
  title?: string;
  entryId?: string;
  lastModified?: string;
  previewUrl?: string;
}) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    const sessionData = {
      ...data,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent.substring(0, 100),
      sessionId: generateSessionId(),
      previewInfo: extractPreviewInfo()
    };

    localStorage.setItem('skillpedia_preview_session', JSON.stringify(sessionData));
    
    // セッション履歴も保存（最大10件）
    const historyKey = 'skillpedia_preview_history';
    const existingHistory = JSON.parse(localStorage.getItem(historyKey) || '[]');
    const newHistory = [sessionData, ...existingHistory.slice(0, 9)];
    localStorage.setItem(historyKey, JSON.stringify(newHistory));
    
  } catch (error) {
    console.warn('Failed to store preview session:', error);
  }
}

/**
 * プレビューセッション情報を取得（改善版）
 */
export function getPreviewSession() {
  if (typeof window === 'undefined') {
    return null;
  }

  try {
    const stored = localStorage.getItem('skillpedia_preview_session');
    if (!stored) return null;

    const sessionData = JSON.parse(stored);
    
    // 24時間以上古いセッションは無効とする
    const isExpired = Date.now() - sessionData.timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      localStorage.removeItem('skillpedia_preview_session');
      return null;
    }

    return sessionData;
  } catch (error) {
    console.warn('Failed to get preview session:', error);
    return null;
  }
}

/**
 * プレビューセッション履歴を取得
 */
export function getPreviewHistory() {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const stored = localStorage.getItem('skillpedia_preview_history');
    if (!stored) return [];

    const history = JSON.parse(stored);
    
    // 7日以上古いセッションを除外
    const validHistory = history.filter((session: any) => {
      return Date.now() - session.timestamp < 7 * 24 * 60 * 60 * 1000;
    });

    // フィルタ後の履歴を保存
    if (validHistory.length !== history.length) {
      localStorage.setItem('skillpedia_preview_history', JSON.stringify(validHistory));
    }

    return validHistory;
  } catch (error) {
    console.warn('Failed to get preview history:', error);
    return [];
  }
}

/**
 * プレビューセッションをクリア（改善版）
 */
export function clearPreviewSession() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem('skillpedia_preview_session');
  } catch (error) {
    console.warn('Failed to clear preview session:', error);
  }
}

/**
 * プレビュー履歴をクリア
 */
export function clearPreviewHistory() {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    localStorage.removeItem('skillpedia_preview_history');
  } catch (error) {
    console.warn('Failed to clear preview history:', error);
  }
}

/**
 * セッションIDを生成
 */
function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * プレビューモードでの特別な操作を提供するフック
 */
export function usePreviewActions() {
  const { isPreview, refreshPreviewStatus } = usePreviewMode();

  const exitPreview = useCallback(async () => {
    if (!isPreview) return;

    try {
      const response = await fetch('/api/exit-preview', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          redirectTo: window.location.pathname
        })
      });

      if (response.ok) {
        clearPreviewSession();
        window.location.reload();
      } else {
        throw new Error('Failed to exit preview');
      }
    } catch (error) {
      console.error('Exit preview error:', error);
      // フォールバック
      window.location.href = `/api/exit-preview?redirect=${encodeURIComponent(window.location.pathname)}`;
    }
  }, [isPreview]);

  const openContentfulEditor = useCallback((entryId?: string) => {
    const spaceId = process.env.CONTENTFUL_SPACE_ID || process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || 'vxy009lryi3x';
    
    const url = entryId 
      ? `https://app.contentful.com/spaces/${spaceId}/entries/${entryId}`
      : `https://app.contentful.com/spaces/${spaceId}`;
    
    window.open(url, '_blank', 'noopener,noreferrer');
  }, []);

  const copyPreviewUrl = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      return true;
    } catch (error) {
      console.error('Failed to copy URL:', error);
      return false;
    }
  }, []);

  const refreshContent = useCallback(() => {
    window.location.reload();
  }, []);

  return {
    isPreview,
    exitPreview,
    openContentfulEditor,
    copyPreviewUrl,
    refreshContent,
    refreshPreviewStatus
  };
}

/**
 * プレビューモードでのリアルタイム更新を提供するフック
 */
export function usePreviewUpdates() {
  const [lastUpdateCheck, setLastUpdateCheck] = useState<Date | null>(null);
  const [hasUpdates, setHasUpdates] = useState(false);
  const { isPreview } = usePreviewMode();

  const checkForUpdates = useCallback(async () => {
    if (!isPreview) return;

    try {
      // プレビューモードでの更新チェック実装
      // 実際のContentful APIを使用して最新の更新時間をチェック
      const session = getPreviewSession();
      if (!session?.entryId) return;

      // ここで実際のContentful APIを呼び出して更新をチェック
      // 実装例は省略
      
      setLastUpdateCheck(new Date());
    } catch (error) {
      console.error('Update check failed:', error);
    }
  }, [isPreview]);

  useEffect(() => {
    if (!isPreview) return;

    // 初回チェック
    checkForUpdates();

    // 2分ごとに更新をチェック
    const interval = setInterval(checkForUpdates, 120000);

    return () => clearInterval(interval);
  }, [isPreview, checkForUpdates]);

  return {
    lastUpdateCheck,
    hasUpdates,
    checkForUpdates
  };
}

/**
 * プレビューモードでのパフォーマンス監視フック
 */
export function usePreviewPerformance() {
  const [metrics, setMetrics] = useState<{
    loadTime?: number;
    renderTime?: number;
    apiCalls?: number;
  }>({});

  const { isPreview } = usePreviewMode();

  useEffect(() => {
    if (!isPreview) return;

    const startTime = performance.now();

    // ページ読み込み完了時にメトリクスを記録
    const handleLoad = () => {
      const loadTime = performance.now() - startTime;
      setMetrics(prev => ({ ...prev, loadTime }));
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
      return () => window.removeEventListener('load', handleLoad);
    }
  }, [isPreview]);

  return metrics;
}

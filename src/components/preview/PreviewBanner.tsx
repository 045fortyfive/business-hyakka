'use client';

import { useState, useEffect } from 'react';
import { ExternalLink, Eye, EyeOff, Edit, X, RefreshCw, Share2, Clock, Copy, CheckCircle } from 'lucide-react';

/**
 * プレビューモード用のトップバナー（改善版）
 * 編集者がプレビューモードにいることを明確に表示
 */
interface PreviewBannerProps {
  contentType?: string;
  slug?: string;
  title?: string;
  contentfulEntryId?: string;
  lastModified?: string;
  showUpdateTime?: boolean;
}

export function PreviewBanner({
  contentType = 'content',
  slug,
  title,
  contentfulEntryId,
  lastModified,
  showUpdateTime = true
}: PreviewBannerProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 現在時刻を1分ごとに更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000);

    return () => clearInterval(timer);
  }, []);

  const handleExitPreview = async () => {
    if (isExiting) return;
    
    setIsExiting(true);
    
    try {
      // Ajax経由でプレビューを終了
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
        // ページをリロードして通常モードに戻る
        window.location.reload();
      } else {
        // フォールバック: 直接GETリクエスト
        window.location.href = `/api/exit-preview?redirect=${encodeURIComponent(window.location.pathname)}`;
      }
    } catch (error) {
      console.error('Failed to exit preview mode:', error);
      // エラー時のフォールバック
      window.location.href = `/api/exit-preview?redirect=${encodeURIComponent(window.location.pathname)}`;
    } finally {
      setIsExiting(false);
    }
  };

  const handleEditInContentful = () => {
    const spaceId = process.env.CONTENTFUL_SPACE_ID || process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || 'vxy009lryi3x';
    
    if (contentfulEntryId) {
      // 直接エントリ編集ページを開く
      const contentfulUrl = `https://app.contentful.com/spaces/${spaceId}/entries/${contentfulEntryId}`;
      window.open(contentfulUrl, '_blank', 'noopener,noreferrer');
    } else {
      // Contentful管理画面のトップを開く
      const contentfulUrl = `https://app.contentful.com/spaces/${spaceId}`;
      window.open(contentfulUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (error) {
      console.error('Failed to copy URL:', error);
      // フォールバック: 選択可能なテキストとして表示
      prompt('プレビューURLをコピーしてください:', window.location.href);
    }
  };

  const formatTime = (dateString?: string) => {
    if (!dateString) return null;
    
    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMinutes / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMinutes < 1) return '今更新';
      if (diffMinutes < 60) return `${diffMinutes}分前`;
      if (diffHours < 24) return `${diffHours}時間前`;
      if (diffDays < 7) return `${diffDays}日前`;
      
      return date.toLocaleDateString('ja-JP', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return null;
    }
  };

  if (isMinimized) {
    return (
      <div className="fixed top-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white p-3 rounded-full shadow-2xl transition-all duration-300 transform hover:scale-110 animate-pulse"
          title="プレビューバナーを表示"
        >
          <Eye className="w-5 h-5" />
        </button>
      </div>
    );
  }

  return (
    <>
      {/* プレビューモードの視覚的インジケーター */}
      <div className="fixed inset-0 pointer-events-none z-40">
        <div className="absolute inset-0 border-4 border-orange-400 opacity-60 animate-pulse"></div>
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-orange-400 via-red-400 to-orange-400 animate-pulse"></div>
      </div>

      {/* メインバナー */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-orange-600 via-red-600 to-orange-600 text-white shadow-2xl border-b-4 border-orange-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-3">
            {/* 左側: プレビュー情報 */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Eye className="w-6 h-6 animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-lg">プレビューモード</span>
                  <span className="text-xs text-orange-100">編集者専用表示</span>
                </div>
              </div>
              
              {title && (
                <div className="hidden sm:block bg-black bg-opacity-20 px-3 py-1 rounded-lg">
                  <div className="text-orange-100 text-xs">プレビュー中:</div>
                  <div className="font-medium text-sm max-w-md truncate">{title}</div>
                </div>
              )}
              
              {slug && (
                <div className="hidden md:block text-xs text-orange-200 bg-orange-800 bg-opacity-50 px-2 py-1 rounded-md font-mono">
                  /{contentType}/{slug}
                </div>
              )}

              {/* 最終更新時間 */}
              {showUpdateTime && lastModified && (
                <div className="hidden lg:flex items-center space-x-1 text-xs text-orange-200">
                  <Clock className="w-3 h-3" />
                  <span>更新: {formatTime(lastModified)}</span>
                </div>
              )}
            </div>

            {/* 右側: アクションボタン */}
            <div className="flex items-center space-x-2">
              {/* URL共有ボタン */}
              <button
                onClick={handleCopyUrl}
                className="p-2 text-orange-100 hover:text-white hover:bg-orange-600 hover:bg-opacity-50 rounded-lg transition-all duration-200"
                title="プレビューURLをコピー"
              >
                {copySuccess ? (
                  <CheckCircle className="w-4 h-4 text-green-300" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>

              {/* リフレッシュボタン */}
              <button
                onClick={handleRefresh}
                className="p-2 text-orange-100 hover:text-white hover:bg-orange-600 hover:bg-opacity-50 rounded-lg transition-all duration-200"
                title="ページを更新"
              >
                <RefreshCw className="w-4 h-4" />
              </button>

              {/* Contentfulで編集ボタン */}
              <button
                onClick={handleEditInContentful}
                className="flex items-center space-x-1 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105"
                title="Contentfulで編集"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">編集</span>
              </button>

              {/* プレビュー終了ボタン */}
              <button
                onClick={handleExitPreview}
                disabled={isExiting}
                className={`flex items-center space-x-1 px-4 py-2 text-white text-sm font-medium rounded-lg transition-all duration-200 transform hover:scale-105 ${
                  isExiting 
                    ? 'bg-gray-600 cursor-not-allowed opacity-75' 
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
                title="プレビューを終了"
              >
                <EyeOff className="w-4 h-4" />
                <span className="hidden sm:inline">
                  {isExiting ? '終了中...' : '終了'}
                </span>
              </button>

              {/* 最小化ボタン */}
              <button
                onClick={() => setIsMinimized(true)}
                className="p-2 text-orange-100 hover:text-white hover:bg-orange-600 hover:bg-opacity-50 rounded-lg transition-all duration-200"
                title="バナーを最小化"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* URL共有成功通知 */}
      {copySuccess && (
        <div className="fixed top-20 right-4 z-40 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4" />
            <span className="text-sm">URLをコピーしました</span>
          </div>
        </div>
      )}
    </>
  );
}

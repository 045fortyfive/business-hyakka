'use client';

import { useEffect, useState } from 'react';
import { usePreviewMode, storePreviewSession } from '@/hooks/usePreview';
import { PreviewBanner } from './PreviewBanner';
import { PreviewIndicator } from './PreviewIndicator';

/**
 * プレビューモード用のラッパーコンポーネント（改善版）
 * プレビュー時のみバナーを表示し、通常時は何も表示しない
 */
interface PreviewWrapperProps {
  children: React.ReactNode;
  contentType?: string;
  slug?: string;
  title?: string;
  contentfulEntryId?: string;
  lastModified?: string;
  showUpdateTime?: boolean;
  showMeta?: boolean;
}

export function PreviewWrapper({
  children,
  contentType,
  slug,
  title,
  contentfulEntryId,
  lastModified,
  showUpdateTime = true,
  showMeta = true
}: PreviewWrapperProps) {
  const { isPreview, isLoading } = usePreviewMode();
  const [mounted, setMounted] = useState(false);

  // クライアントサイドでのマウント状態を管理
  useEffect(() => {
    setMounted(true);
  }, []);

  // プレビューセッション情報を保存
  useEffect(() => {
    if (isPreview && mounted && (contentType || slug || title || contentfulEntryId)) {
      storePreviewSession({
        contentType,
        slug,
        title,
        entryId: contentfulEntryId,
        lastModified
      });
    }
  }, [isPreview, mounted, contentType, slug, title, contentfulEntryId, lastModified]);

  // ローディング中またはマウント前は通常表示
  if (isLoading || !mounted) {
    return <>{children}</>;
  }

  // プレビューモードでない場合は通常表示
  if (!isPreview) {
    return <>{children}</>;
  }

  // プレビューモードの場合はバナー付きで表示
  return (
    <>
      <PreviewBanner
        contentType={contentType}
        slug={slug}
        title={title}
        contentfulEntryId={contentfulEntryId}
        lastModified={lastModified}
        showUpdateTime={showUpdateTime}
      />
      
      {/* プレビューインジケーター */}
      <PreviewIndicator />
      
      {/* プレビューバナーの高さ分のスペースを確保 */}
      <div style={{ paddingTop: '68px' }} className="preview-content">
        {children}
      </div>

      {/* プレビューモード専用のメタ情報 */}
      {showMeta && (
        <PreviewMeta 
          data={{
            entryId: contentfulEntryId,
            contentType,
            slug,
            lastModified,
            previewUrl: typeof window !== 'undefined' ? window.location.href : undefined
          }} 
        />
      )}

      {/* プレビューモード用のCSS */}
      <style jsx global>{`
        .preview-content {
          position: relative;
        }
        
        .preview-content::before {
          content: '';
          position: fixed;
          top: 68px;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
          background: 
            linear-gradient(90deg, rgba(251, 146, 60, 0.1) 0%, transparent 10%),
            linear-gradient(0deg, rgba(251, 146, 60, 0.1) 0%, transparent 10%);
          background-size: 20px 20px;
          z-index: 1;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }

        /* プレビューモード時のスクロールバーをカスタマイズ */
        .preview-content ::-webkit-scrollbar {
          width: 8px;
        }

        .preview-content ::-webkit-scrollbar-track {
          background: rgba(251, 146, 60, 0.1);
        }

        .preview-content ::-webkit-scrollbar-thumb {
          background: rgba(251, 146, 60, 0.5);
          border-radius: 4px;
        }

        .preview-content ::-webkit-scrollbar-thumb:hover {
          background: rgba(251, 146, 60, 0.7);
        }
      `}</style>
    </>
  );
}

/**
 * プレビューモード専用のメタ情報表示コンポーネント（改善版）
 * 開発者・編集者向けのデバッグ情報
 */
interface PreviewMetaProps {
  data: {
    entryId?: string;
    contentType?: string;
    slug?: string;
    lastModified?: string;
    version?: number;
    previewUrl?: string;
  };
}

export function PreviewMeta({ data }: PreviewMetaProps) {
  const { isPreview } = usePreviewMode();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!isPreview) {
    return null;
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch(console.error);
  };

  return (
    <div className={`fixed bottom-4 left-4 bg-black bg-opacity-90 text-white text-xs rounded-lg shadow-2xl z-40 transition-all duration-300 ${
      isExpanded ? 'max-w-md' : 'max-w-xs'
    }`}>
      <div 
        className="p-3 cursor-pointer border-b border-gray-600"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="font-semibold text-yellow-300 flex items-center space-x-2">
            <span>🔍</span>
            <span>プレビュー情報</span>
          </div>
          <span className="text-gray-400 text-xs">
            {isExpanded ? '▼' : '▶'}
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-3 space-y-2">
          {data.entryId && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Entry ID:</span>
              <div className="flex items-center space-x-1">
                <span className="font-mono text-xs bg-gray-800 px-1 rounded">
                  {data.entryId.substring(0, 8)}...
                </span>
                <button 
                  onClick={() => copyToClipboard(data.entryId!)}
                  className="text-blue-400 hover:text-blue-300 text-xs"
                  title="コピー"
                >
                  📋
                </button>
              </div>
            </div>
          )}
          
          {data.contentType && (
            <div className="flex justify-between">
              <span className="text-gray-300">Type:</span>
              <span className="bg-blue-800 text-blue-100 px-1 rounded text-xs">
                {data.contentType}
              </span>
            </div>
          )}
          
          {data.slug && (
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Slug:</span>
              <div className="flex items-center space-x-1">
                <span className="font-mono text-xs bg-gray-800 px-1 rounded max-w-24 truncate">
                  {data.slug}
                </span>
                <button 
                  onClick={() => copyToClipboard(data.slug!)}
                  className="text-blue-400 hover:text-blue-300 text-xs"
                  title="コピー"
                >
                  📋
                </button>
              </div>
            </div>
          )}
          
          {data.lastModified && (
            <div className="flex justify-between">
              <span className="text-gray-300">Modified:</span>
              <span className="text-xs text-gray-400">
                {new Date(data.lastModified).toLocaleString('ja-JP')}
              </span>
            </div>
          )}
          
          {data.version && (
            <div className="flex justify-between">
              <span className="text-gray-300">Version:</span>
              <span className="bg-green-800 text-green-100 px-1 rounded text-xs">
                v{data.version}
              </span>
            </div>
          )}

          {data.previewUrl && (
            <div className="pt-2 border-t border-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Preview URL:</span>
                <button 
                  onClick={() => copyToClipboard(data.previewUrl!)}
                  className="text-blue-400 hover:text-blue-300 text-xs"
                  title="URLをコピー"
                >
                  🔗 コピー
                </button>
              </div>
              <div className="text-xs text-gray-400 mt-1 break-all">
                {data.previewUrl.length > 50 
                  ? `${data.previewUrl.substring(0, 50)}...` 
                  : data.previewUrl}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * プレビューモード用の通知コンポーネント（改善版）
 * プレビュー開始時や重要な情報を表示
 */
interface PreviewNotificationProps {
  message: string;
  type?: 'info' | 'success' | 'warning' | 'error';
  duration?: number;
  onClose?: () => void;
  autoClose?: boolean;
}

export function PreviewNotification({
  message,
  type = 'info',
  duration = 5000,
  onClose,
  autoClose = true
}: PreviewNotificationProps) {
  const { isPreview } = usePreviewMode();

  useEffect(() => {
    if (autoClose && duration > 0) {
      const timer = setTimeout(() => {
        onClose?.();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose, autoClose]);

  if (!isPreview) {
    return null;
  }

  const typeStyles = {
    info: 'bg-blue-600 border-blue-400',
    success: 'bg-green-600 border-green-400',
    warning: 'bg-yellow-600 border-yellow-400',
    error: 'bg-red-600 border-red-400'
  };

  const typeIcons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  return (
    <div className="fixed top-20 right-4 z-40 max-w-sm animate-fade-in">
      <div className={`${typeStyles[type]} text-white p-4 rounded-lg shadow-2xl border-l-4`}>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-2 flex-1">
            <span className="text-lg">{typeIcons[type]}</span>
            <div>
              <p className="text-sm font-medium">{message}</p>
              {autoClose && duration > 0 && (
                <div className="mt-2 w-full bg-white bg-opacity-20 rounded-full h-1">
                  <div 
                    className="bg-white h-1 rounded-full transition-all linear"
                    style={{
                      animation: `shrink ${duration}ms linear forwards`
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>
          
          {onClose && (
            <button
              onClick={onClose}
              className="ml-2 text-white hover:text-gray-200 transition-colors text-lg leading-none"
            >
              ×
            </button>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes shrink {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
}

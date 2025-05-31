'use client';

import { useState, useEffect } from 'react';
import { Eye, Wifi, WifiOff } from 'lucide-react';

/**
 * プレビューモード専用の視覚的インジケーター
 * ページがプレビューモードであることを常に明確に示す
 */
export function PreviewIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());

  // オンライン状態の監視
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // 現在時刻の更新
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <>
      {/* 角の視覚的インジケーター */}
      <div className="fixed top-0 left-0 w-0 h-0 z-30 border-t-[50px] border-t-orange-500 border-r-[50px] border-r-transparent">
        <div className="absolute -top-12 left-1 text-white text-xs font-bold transform rotate-45">
          PREVIEW
        </div>
      </div>

      <div className="fixed top-0 right-0 w-0 h-0 z-30 border-t-[50px] border-t-red-500 border-l-[50px] border-l-transparent">
        <div className="absolute -top-12 -left-8 text-white text-xs font-bold transform -rotate-45">
          DRAFT
        </div>
      </div>

      {/* 下部のステータスバー */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1">
              <Eye className="w-3 h-3 animate-pulse" />
              <span className="font-semibold">PREVIEW MODE</span>
            </div>
            
            <div className="hidden sm:flex items-center space-x-1">
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3 text-green-300" />
                  <span className="text-green-300">オンライン</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-red-300" />
                  <span className="text-red-300">オフライン</span>
                </>
              )}
            </div>
          </div>

          <div className="hidden md:flex items-center space-x-4 text-xs text-orange-100">
            <div>
              {currentTime.toLocaleTimeString('ja-JP', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
              })}
            </div>
            <div className="bg-orange-600 px-2 py-0.5 rounded text-white font-mono">
              編集者専用表示
            </div>
          </div>
        </div>
      </div>

      {/* サイドの視覚的境界線 */}
      <div className="fixed left-0 top-16 bottom-6 w-1 bg-gradient-to-b from-orange-400 via-red-400 to-orange-400 z-20 opacity-60"></div>
      <div className="fixed right-0 top-16 bottom-6 w-1 bg-gradient-to-b from-red-400 via-orange-400 to-red-400 z-20 opacity-60"></div>

      {/* 点滅するドット */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '0s' }}></div>
          <div className="w-2 h-2 bg-red-400 rounded-full animate-ping" style={{ animationDelay: '0.5s' }}></div>
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-ping" style={{ animationDelay: '1s' }}></div>
        </div>
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes pulse-border {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}

/**
 * プレビューモード用のフローティングタグ
 * 特定の要素にプレビュー専用の情報を表示
 */
interface PreviewFloatingTagProps {
  content: string;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  color?: 'orange' | 'red' | 'blue' | 'green';
}

export function PreviewFloatingTag({ 
  content, 
  position = 'top-right',
  color = 'orange'
}: PreviewFloatingTagProps) {
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0'
  };

  const colorClasses = {
    orange: 'bg-orange-500 border-orange-400',
    red: 'bg-red-500 border-red-400',
    blue: 'bg-blue-500 border-blue-400',
    green: 'bg-green-500 border-green-400'
  };

  return (
    <div className={`absolute ${positionClasses[position]} z-30 transform -translate-y-1 translate-x-1`}>
      <div className={`${colorClasses[color]} text-white text-xs px-2 py-1 rounded-md border-2 shadow-lg animate-pulse`}>
        <div className="flex items-center space-x-1">
          <Eye className="w-3 h-3" />
          <span className="font-semibold">{content}</span>
        </div>
      </div>
    </div>
  );
}

/**
 * プレビューモード専用のツールチップ
 * 要素にホバー時にプレビュー情報を表示
 */
interface PreviewTooltipProps {
  children: React.ReactNode;
  content: string;
  entryId?: string;
  lastModified?: string;
}

export function PreviewTooltip({ children, content, entryId, lastModified }: PreviewTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
          <div className="bg-black bg-opacity-90 text-white text-xs rounded-lg p-3 shadow-2xl max-w-xs">
            <div className="font-semibold text-yellow-300 mb-2 flex items-center space-x-1">
              <Eye className="w-3 h-3" />
              <span>プレビュー情報</span>
            </div>
            
            <div className="space-y-1">
              <div className="text-gray-300">{content}</div>
              
              {entryId && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">Entry:</span>
                  <span className="font-mono">{entryId.substring(0, 8)}...</span>
                </div>
              )}
              
              {lastModified && (
                <div className="flex justify-between text-xs">
                  <span className="text-gray-400">更新:</span>
                  <span>{new Date(lastModified).toLocaleString('ja-JP')}</span>
                </div>
              )}
            </div>
            
            {/* 三角形の矢印 */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black"></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

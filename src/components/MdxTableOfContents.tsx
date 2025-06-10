'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { TocItem } from '@/utils/toc-utils';

interface MdxTableOfContentsProps {
  tocItems: TocItem[];
  className?: string;
}

export default function MdxTableOfContents({ tocItems, className = "" }: MdxTableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const headingElementsRef = useRef<Element[]>([]);

  // モバイル判定
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // より正確なアクティブ見出し検出のためのIntersection Observer
  useEffect(() => {
    // 見出し要素を収集
    const headingElements = Array.from(document.querySelectorAll('h2[id], h3[id]'));
    headingElementsRef.current = headingElements;

    if (headingElements.length === 0) return;

    // Intersection Observer のコールバック
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      // ビューポート内にある見出しを取得
      const visibleEntries = entries.filter(entry => entry.isIntersecting);
      
      if (visibleEntries.length > 0) {
        // 最も上にある見出しをアクティブとする
        const topEntry = visibleEntries.reduce((top, entry) => {
          return entry.boundingClientRect.top < top.boundingClientRect.top ? entry : top;
        });
        setActiveId(topEntry.target.id);
      }
    };

    // Observer を作成
    observerRef.current = new IntersectionObserver(observerCallback, {
      rootMargin: '-20px 0px -80% 0px', // 上部20pxマージン、下部80%マージン
      threshold: [0, 0.25, 0.5, 0.75, 1]
    });

    // 各見出し要素を監視
    headingElements.forEach(heading => {
      observerRef.current?.observe(heading);
    });

    // クリーンアップ
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [tocItems]); // tocItemsが変更されたら再実行

  // 見出しクリック時のスムーズスクロール（改良版）
  const handleHeadingClick = useCallback((id: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault();
    }

    // URLエンコードされたIDをデコード
    const decodedId = decodeURIComponent(id);
    let element = document.getElementById(decodedId);
    
    // デコードしたIDで見つからない場合は、元のIDで試す
    if (!element) {
      element = document.getElementById(id);
    }
    
    if (element) {
      // より正確なスクロール位置計算
      const headerOffset = 80; // ヘッダーの高さを考慮
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // アクティブIDを即座に更新
      setActiveId(decodedId);

      // URL ハッシュを更新（履歴には追加しない）
      const url = new URL(window.location.href);
      url.hash = decodedId;
      window.history.replaceState(null, '', url.toString());

      // モバイルでクリック後にアコーディオンを閉じる
      if (isMobile) {
        setTimeout(() => setIsOpen(false), 300); // スムーズな閉じ方
      }
    } else {
      console.warn('Element not found for ID:', id, 'decoded:', decodedId);
    }
  }, [isMobile]);

  // アコーディオンのトグル
  const handleToggle = useCallback(() => {
    setIsOpen(!isOpen);
  }, [isOpen]);

  // 初期状態の設定（デスクトップでは開いた状態）
  useEffect(() => {
    if (!isMobile) {
      setIsOpen(true);
    }
  }, [isMobile]);

  // URLハッシュから初期アクティブアイテムを設定
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash && tocItems.some(item => 
      item.id === hash || (item.children && item.children.some(child => child.id === hash))
    )) {
      setActiveId(hash);
    }
  }, [tocItems]);

  if (!tocItems || tocItems.length === 0) {
    return null;
  }

  const renderTocItem = (item: TocItem, index: number) => {
    const isActive = activeId === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <li key={`${item.id}-${index}`} className="mb-1">
        <a
          href={`#${item.id}`}
          onClick={(e) => handleHeadingClick(item.id, e)}
          className={`
            block w-full text-left px-3 py-2 rounded-md transition-all duration-200 cursor-pointer
            ${isActive
              ? 'bg-blue-100 text-blue-800 font-medium border-l-2 border-blue-500'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-l-2 hover:border-gray-300'
            }
            ${item.level === 3 ? 'ml-4 text-sm pl-6' : 'text-base'}
            ${hasChildren ? 'font-medium' : ''}
          `}
          title={`「${item.title}」セクションへ移動`}
        >
          <span className="flex items-center">
            {item.level === 2 && (
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 flex-shrink-0" />
            )}
            {item.level === 3 && (
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2 flex-shrink-0" />
            )}
            <span className="line-clamp-2">{item.title}</span>
          </span>
        </a>

        {hasChildren && (
          <ul className="ml-2 mt-1 space-y-1">
            {item.children!.map((child, childIndex) => renderTocItem(child, childIndex))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* ヘッダー（アコーディオン対応） */}
      <div className="border-b border-gray-200">
        <button
          onClick={handleToggle}
          className="w-full px-4 py-3 text-left flex items-center justify-between text-base font-medium text-gray-900 transition-colors hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
          aria-expanded={isOpen}
          aria-controls="toc-content"
        >
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            目次
            <span className="ml-2 text-xs text-gray-500">({tocItems.length}項目)</span>
          </span>
          <svg
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* 目次リスト */}
      <div
        id="toc-content"
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
        style={{
          maxHeight: isOpen ? '24rem' : '0'
        }}
      >
        <nav className="p-4">
          <ul className="space-y-1 max-h-80 overflow-y-auto">
            {tocItems.map((item, index) => renderTocItem(item, index))}
          </ul>
          
          {/* 目次下部の情報 */}
          <div className="mt-4 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center">
              クリックで該当セクションにジャンプします
            </p>
          </div>
        </nav>
      </div>
    </div>
  );
}

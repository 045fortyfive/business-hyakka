'use client';

import React, { useState, useEffect } from 'react';
import { TocItem } from '@/utils/toc-utils';

interface MdxTableOfContentsProps {
  tocItems: TocItem[];
  className?: string;
}

export default function MdxTableOfContents({ tocItems, className = "" }: MdxTableOfContentsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeId, setActiveId] = useState<string>('');
  const [isMobile, setIsMobile] = useState(false);

  // モバイル判定
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // スクロール位置に基づいてアクティブな見出しを更新
  useEffect(() => {
    const handleScroll = () => {
      const headings = document.querySelectorAll('h2[id], h3[id]');
      const scrollPosition = window.scrollY + 100; // オフセット

      let currentActiveId = '';
      
      headings.forEach((heading) => {
        const element = heading as HTMLElement;
        if (element.offsetTop <= scrollPosition) {
          currentActiveId = element.id;
        }
      });

      setActiveId(currentActiveId);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初期実行

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 見出しクリック時のスムーズスクロール
  const handleHeadingClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      // モバイルでクリック後にアコーディオンを閉じる
      if (isMobile) {
        setIsOpen(false);
      }
    }
  };

  // アコーディオンのトグル（モバイルのみ）
  const handleToggle = () => {
    if (isMobile) {
      setIsOpen(!isOpen);
    }
  };

  if (!tocItems || tocItems.length === 0) {
    return null;
  }

  const renderTocItem = (item: TocItem, index: number) => {
    const isActive = activeId === item.id;
    const hasChildren = item.children && item.children.length > 0;

    return (
      <li key={`${item.id}-${index}`} className="mb-1">
        <button
          onClick={() => handleHeadingClick(item.id)}
          className={`
            block w-full text-left px-3 py-2 rounded-md transition-colors
            ${isActive
              ? 'bg-blue-100 text-blue-800 font-medium'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
            }
            ${item.level === 3 ? 'ml-4 text-sm' : 'text-base'}
          `}
        >
          {item.title}
        </button>

        {hasChildren && (
          <ul className="ml-2 mt-1">
            {item.children!.map((child, childIndex) => renderTocItem(child, childIndex))}
          </ul>
        )}
      </li>
    );
  };

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-sm ${className}`}>
      {/* ヘッダー（モバイル用アコーディオン） */}
      <div className="border-b border-gray-200 md:border-b-0">
        <button
          onClick={handleToggle}
          className={`w-full px-4 py-3 text-left flex items-center justify-between text-base font-medium text-gray-900 transition-colors ${
            isMobile ? 'hover:bg-gray-50' : 'cursor-default'
          }`}
        >
          <span className="flex items-center">
            <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
            目次
          </span>
          {isMobile && (
            <svg
              className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          )}
        </button>
      </div>

      {/* 目次リスト */}
      <div className={`transition-all duration-200 ${
        isMobile
          ? (isOpen ? 'block' : 'hidden')
          : 'block'
      }`}>
        <nav className="p-4">
          <ul className="space-y-1">
            {tocItems.map((item, index) => renderTocItem(item, index))}
          </ul>
        </nav>
      </div>
    </div>
  );
}

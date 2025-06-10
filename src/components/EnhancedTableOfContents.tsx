'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { extractTocFromContent, type TocItem } from '@/utils/heading-utils';

interface EnhancedTableOfContentsProps {
  content?: any; // Contentfulのリッチテキストドキュメントまたは生成されたTOC
  toc?: TocItem[]; // 直接TocItemの配列を渡す場合
  type?: 'main' | 'sidebar'; // 表示タイプ（メインまたはサイドバー）
  className?: string;
  enableDynamicToc?: boolean; // DOM要素から動的にTOCを生成するかどうか
}

export default function EnhancedTableOfContents({
  content,
  toc: initialToc,
  type = 'main',
  className = '',
  enableDynamicToc = true
}: EnhancedTableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(type === 'main');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainTocRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isClient, setIsClient] = useState(false);

  // クライアントサイドでのマウント確認
  useEffect(() => {
    setIsClient(true);
  }, []);

  // DOM要素から動的にTOCを生成する関数
  const generateDynamicToc = useCallback(() => {
    if (!isClient || !enableDynamicToc) return [];

    // 記事コンテンツのコンテナを探す
    const contentSelectors = [
      'article',
      '[role="main"] .prose',
      '.prose',
      '.article-content',
      '.content'
    ];

    let contentContainer: Element | null = null;
    for (const selector of contentSelectors) {
      contentContainer = document.querySelector(selector);
      if (contentContainer) break;
    }

    if (!contentContainer) {
      console.log('Content container not found for dynamic TOC generation');
      return [];
    }

    console.log('Generating dynamic TOC from DOM elements');
    
    // DOM要素から見出しを抽出（インライン実装）
    const headingSelectors = 'h1, h2, h3, h4, h5, h6';
    const headingElements = contentContainer.querySelectorAll(headingSelectors);
    
    const headings: Array<{id: string, text: string, level: number}> = [];
    const existingIds: string[] = [];
    
    headingElements.forEach((element, index) => {
      const tagName = element.tagName.toLowerCase();
      const level = parseInt(tagName.charAt(1));
      const text = element.textContent?.trim() || '';
      
      if (text) {
        // 既存のIDがある場合はそれを使用、なければ生成
        let id = element.id;
        if (!id) {
          // generateHeadingIdをインラインで実装（簡略版）
          const baseSlug = text
            .toLowerCase()
            .replace(/[^\w\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-+|-+$/g, '') || `heading-${index}`;
          
          let finalId = baseSlug;
          let counter = 1;
          
          while (existingIds.includes(finalId)) {
            finalId = `${baseSlug}-${counter}`;
            counter++;
          }
          
          id = finalId;
          element.id = id; // DOM要素にIDを設定
        }
        
        existingIds.push(id);
        
        headings.push({
          id,
          text,
          level
        });
      }
    });
    
    // 階層構造を構築
    const buildHierarchy = (headings: Array<{id: string, text: string, level: number}>): TocItem[] => {
      const result: TocItem[] = [];
      const stack: TocItem[] = [];

      headings.forEach(heading => {
        const tocItem: TocItem = {
          id: heading.id,
          text: heading.text,
          level: heading.level,
          children: []
        };

        // 階層構造を構築
        while (stack.length > 0 && stack[stack.length - 1].level >= heading.level) {
          stack.pop();
        }

        if (stack.length === 0) {
          result.push(tocItem);
        } else {
          stack[stack.length - 1].children.push(tocItem);
        }

        stack.push(tocItem);
      });

      return result;
    };

    return buildHierarchy(headings);
  }, [isClient, enableDynamicToc]);

  // 目次を生成・更新
  useEffect(() => {
    if (initialToc && initialToc.length > 0) {
      // 直接TocItemの配列が渡された場合
      console.log('Using provided TOC items:', initialToc.length);
      setToc(initialToc);
    } else if (content) {
      // contentから目次を生成
      console.log('Generating TOC from content');
      const tocItems = extractTocFromContent(content);
      setToc(tocItems);
    } else if (enableDynamicToc && isClient) {
      // DOM要素から動的に生成
      console.log('Attempting dynamic TOC generation');
      // 少し遅延してDOMが完全にレンダリングされるのを待つ
      const timer = setTimeout(() => {
        const dynamicToc = generateDynamicToc();
        if (dynamicToc.length > 0) {
          console.log('Dynamic TOC generated:', dynamicToc.length, 'items');
          setToc(dynamicToc);
        }
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [content, initialToc, enableDynamicToc, isClient, generateDynamicToc]);

  // IntersectionObserverでアクティブな見出しを追跡
  useEffect(() => {
    if (!isClient || toc.length === 0) return;

    // 既存のオブザーバーをクリーンアップ
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    // 見出し要素を取得
    const headingElements = toc.flatMap(function getAllHeadings(item: TocItem): Element[] {
      const element = document.getElementById(item.id);
      const elements = element ? [element] : [];
      item.children.forEach(child => {
        elements.push(...getAllHeadings(child));
      });
      return elements;
    }).filter(Boolean);

    if (headingElements.length === 0) {
      console.log('No heading elements found for intersection observer');
      return;
    }

    console.log('Setting up intersection observer for', headingElements.length, 'headings');

    // IntersectionObserverを設定
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries.filter(entry => entry.isIntersecting);
        
        if (visibleEntries.length > 0) {
          // 最も上に近い見出しをアクティブにする
          const topMostEntry = visibleEntries.reduce((prev, curr) => 
            curr.boundingClientRect.top < prev.boundingClientRect.top ? curr : prev
          );
          
          setActiveId(topMostEntry.target.id);
        }
      },
      {
        rootMargin: '-100px 0px -80% 0px',
        threshold: 0
      }
    );

    // 見出し要素を監視
    headingElements.forEach(element => {
      observerRef.current?.observe(element);
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [toc, isClient]);

  // サイドバーの表示/非表示を制御
  useEffect(() => {
    if (type !== 'sidebar' || !isClient) return;

    const handleScroll = () => {
      if (mainTocRef.current) {
        const mainTocBottom = mainTocRef.current.getBoundingClientRect().bottom;
        setIsVisible(mainTocBottom < 0);
      } else {
        // メインTOCが見つからない場合は、スクロール位置で判定
        setIsVisible(window.scrollY > 300);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // 初期状態を設定

    return () => window.removeEventListener('scroll', handleScroll);
  }, [type, isClient]);

  // 目次項目をクリックしたときの処理
  const handleClick = useCallback((id: string, event: React.MouseEvent) => {
    event.preventDefault();
    
    const element = document.getElementById(id);
    if (element) {
      // スムーズスクロール
      element.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      
      // URLのハッシュを更新（ブラウザ履歴には追加しない）
      if (typeof window !== 'undefined') {
        window.history.replaceState(null, '', `#${id}`);
      }
    }
  }, []);

  // 目次項目をレンダリング
  const renderTocItems = useCallback((items: TocItem[]): React.ReactNode => {
    if (items.length === 0) return null;

    return (
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className="border-b border-gray-100 last:border-b-0">
            <a
              href={`#${item.id}`}
              onClick={(e) => handleClick(item.id, e)}
              className={`
                block py-2 px-2 hover:bg-gray-50 transition-colors flex items-center rounded text-sm
                ${activeId === item.id ? 'text-blue-600 font-medium bg-blue-50' : 'text-gray-700 hover:text-gray-900'}
              `}
              style={{ paddingLeft: `${(item.level - 1) * 12 + 8}px` }}
            >
              <span className="mr-2 opacity-50">›</span>
              <span className="truncate">{item.text}</span>
            </a>
            {item.children.length > 0 && (
              <div className="ml-2">
                {renderTocItems(item.children)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  }, [activeId, handleClick]);

  // TOCが空の場合
  if (toc.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-sm p-4 ${className}`}>
        <h2 className="text-base font-bold mb-3 pb-2 border-b border-gray-200">目次</h2>
        <p className="text-gray-500 italic text-sm">
          {enableDynamicToc ? '目次を生成中...' : '目次がありません'}
        </p>
      </div>
    );
  }

  // メインの目次
  if (type === 'main') {
    return (
      <div
        ref={mainTocRef}
        className={`bg-white rounded-lg shadow-sm p-4 mb-6 ${className}`}
        id="main-toc"
      >
        <h2 className="text-base font-bold mb-3 pb-2 border-b border-gray-200">目次</h2>
        <nav className="toc max-h-96 overflow-y-auto">
          {renderTocItems(toc)}
        </nav>
      </div>
    );
  }

  // サイドバーの目次
  return (
    <div
      ref={sidebarRef}
      className={`
        fixed top-4 right-4 z-10 w-64 transition-all duration-300
        ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}
        ${className}
      `}
    >
      <div className="bg-white rounded-lg shadow-lg p-4 max-h-[80vh] overflow-hidden">
        <h2 className="text-base font-bold mb-3 pb-2 border-b border-gray-200">目次</h2>
        <nav className="toc overflow-y-auto max-h-[calc(80vh-5rem)]">
          {renderTocItems(toc)}
        </nav>
      </div>
    </div>
  );
}

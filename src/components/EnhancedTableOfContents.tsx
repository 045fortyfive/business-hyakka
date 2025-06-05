'use client';

import { useEffect, useState, useRef } from 'react';
import { generateTableOfContents } from '@/utils/toc-generator';

interface TocItem {
  id: string;
  text: string;
  level: number;
  children: TocItem[];
}

interface EnhancedTableOfContentsProps {
  content?: any; // Contentfulのリッチテキストドキュメントまたは生成されたTOC
  toc?: TocItem[]; // 直接TocItemの配列を渡す場合
  type?: 'main' | 'sidebar'; // 表示タイプ（メインまたはサイドバー）
}

export default function EnhancedTableOfContents({
  content,
  toc: initialToc,
  type = 'main'
}: EnhancedTableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');
  const [isVisible, setIsVisible] = useState(type === 'main');
  const sidebarRef = useRef<HTMLDivElement>(null);
  const mainTocRef = useRef<HTMLDivElement>(null);

  // 目次を生成
  useEffect(() => {
    if (initialToc) {
      // 直接TocItemの配列が渡された場合はそれを使用
      setToc(initialToc);
    } else if (content) {
      // contentから目次を生成
      const tocItems = generateTableOfContents(content);
      setToc(tocItems);
    }
  }, [content, initialToc]);

  // スクロール時にアクティブな見出しを更新
  useEffect(() => {
    if (toc.length === 0) return;

    const headingElements = Array.from(document.querySelectorAll('h1, h2, h3, h4'));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-100px 0px -80% 0px' }
    );

    headingElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      headingElements.forEach((element) => {
        observer.unobserve(element);
      });
    };
  }, [toc]);

  // サイドバーの表示/非表示を制御
  useEffect(() => {
    if (type !== 'sidebar' || !mainTocRef.current) return;

    const handleScroll = () => {
      if (!mainTocRef.current) return;

      const mainTocBottom = mainTocRef.current.getBoundingClientRect().bottom;

      // メインの目次が画面外に出たらサイドバーを表示
      if (mainTocBottom < 0) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [type]);

  // 目次項目をクリックしたときの処理
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 目次項目をレンダリング
  const renderTocItems = (items: TocItem[]) => {
    if (items.length === 0) return null;

    return (
      <ul className="space-y-1">
        {items.map((item) => (
          <li key={item.id} className="border-b border-gray-100 last:border-b-0">
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleClick(item.id);
              }}
              className={`
                block py-2 px-2 hover:bg-gray-50 transition-colors flex items-center
                ${activeId === item.id ? 'text-gray-900 font-medium' : 'text-gray-700'}
              `}
            >
              <span className="mr-2">›</span>
              {item.text}
            </a>
            {item.children.length > 0 && (
              <div className="ml-4">
                {renderTocItems(item.children)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  if (toc.length === 0) {
    return null;
  }

  // メインの目次（PCの場合は左カラムに収める）
  if (type === 'main') {
    return (
      <div
        ref={mainTocRef}
        className="bg-white rounded-lg shadow-sm p-4 mb-6 w-full"
      >
        <h2 className="text-xl font-bold mb-3 pb-2 border-b border-gray-200">目次</h2>
        <nav className="toc overflow-x-auto">
          {toc.length > 0 ? (
            renderTocItems(toc)
          ) : (
            <p className="text-gray-500 italic">目次を生成できませんでした</p>
          )}
        </nav>
      </div>
    );
  }

  // サイドバーの目次
  return (
    <div
      ref={sidebarRef}
      className={`
        sticky top-4 transition-opacity duration-300 w-full
        ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}
      `}
    >
      <div className="bg-white rounded-lg shadow-sm p-4 w-full">
        <h2 className="text-xl font-bold mb-3 pb-2 border-b border-gray-200">目次</h2>
        <nav className="toc overflow-x-auto">
          {toc.length > 0 ? (
            renderTocItems(toc)
          ) : (
            <p className="text-gray-500 italic">目次を生成できませんでした</p>
          )}
        </nav>
      </div>
    </div>
  );
}

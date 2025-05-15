'use client';

import { useEffect, useState } from 'react';
import { generateTableOfContents } from '@/utils/toc-generator';

interface TocItem {
  id: string;
  text: string;
  level: number;
  children: TocItem[];
}

interface TableOfContentsProps {
  content: any; // Contentfulのリッチテキストドキュメント
}

export default function TableOfContents({ content }: TableOfContentsProps) {
  const [toc, setToc] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>('');

  // 目次を生成
  useEffect(() => {
    if (content) {
      const tocItems = generateTableOfContents(content);
      setToc(tocItems);
    }
  }, [content]);

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

  // 目次項目をクリックしたときの処理
  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 目次項目をレンダリング
  const renderTocItems = (items: TocItem[], level = 0) => {
    if (items.length === 0) return null;

    return (
      <ul className={`${level > 0 ? 'ml-4 mt-1' : ''} space-y-2`}>
        {items.map((item) => (
          <li key={item.id} className={`${level === 0 ? 'mb-2' : ''}`}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleClick(item.id);
              }}
              className={`
                block py-1 hover:text-blue-600 transition-colors
                ${activeId === item.id ? 'text-blue-600 font-medium' : 'text-gray-700'}
                ${level === 0 ? 'font-medium' : 'text-sm'}
                ${level > 1 ? 'text-gray-500' : ''}
              `}
            >
              {item.text}
            </a>
            {item.children.length > 0 && renderTocItems(item.children, level + 1)}
          </li>
        ))}
      </ul>
    );
  };

  if (toc.length === 0) {
    return null;
  }

  return (
    <div className="sticky top-4">
      <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
        <h2 className="text-lg font-bold mb-4 text-gray-800 border-b pb-2">目次</h2>
        <nav className="toc">{renderTocItems(toc)}</nav>
      </div>
    </div>
  );
}

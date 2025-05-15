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
      <ul className={`pl-${level > 0 ? 4 : 0} space-y-1`}>
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              onClick={(e) => {
                e.preventDefault();
                handleClick(item.id);
              }}
              className={`block py-1 text-sm hover:text-blue-600 transition-colors ${
                activeId === item.id
                  ? 'text-blue-600 font-medium'
                  : 'text-gray-700'
              }`}
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
    <div className="bg-white rounded-xl p-4 sticky top-4 border-2 border-transparent bg-gradient-to-br from-blue-400 via-sky-500 to-indigo-600 bg-clip-padding">
      <div className="bg-white rounded-lg p-4">
        <h2 className="text-lg font-bold mb-3 text-gray-800">目次</h2>
        <nav className="toc">{renderTocItems(toc)}</nav>
      </div>
    </div>
  );
}

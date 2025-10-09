'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import SearchBar from './SearchBar';
import { SKILL_CATEGORIES, SKILL_TO_CATEGORY_SLUG } from '@/lib/types';
import { isCategoryVisible } from '@/config/categories';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-2 sm:py-4 md:py-6">
        <div className="flex items-center justify-between">
          {/* ロゴ */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="https://njazjixymhdfjiag.public.blob.vercel-storage.com/Header%20main%20edited-FrhGP5sX6hYOJRQvZkASlfnkkjvQAP.png"
                alt="Skillpedia - 20代のビジネススキル百科"
                width={400}
                height={134}
                className="h-12 sm:h-16 md:h-24 w-auto"
                priority
                unoptimized
              />
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex space-x-6">
            {Object.entries(SKILL_CATEGORIES)
              .filter(([key, category]) => isCategoryVisible(category.name))
              .map(([key, category]) => {
                const mapped = SKILL_TO_CATEGORY_SLUG[category.slug] ?? category.slug;
                return (
                  <Link
                    key={key}
                    href={`/categories/${mapped}`}
                    className="text-gray-600 hover:text-gray-900 text-sm font-medium whitespace-nowrap"
                  >
                    {category.name}
                  </Link>
                );
              })}
          </nav>

          {/* 検索バー */}
          <div className="hidden md:block">
            <SearchBar />
          </div>

          {/* モバイルメニューボタン */}
          <div className="md:hidden">
            <button
              type="button"
              className="text-gray-600 hover:text-gray-900 focus:outline-none"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? 'メニューを閉じる' : 'メニューを開く'}
            >
              <svg
                className="h-5 w-5 sm:h-6 sm:w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <div className="md:hidden mt-2 pb-2">
            <nav className="flex flex-col space-y-2">
              {Object.entries(SKILL_CATEGORIES)
                .filter(([key, category]) => isCategoryVisible(category.name))
                .map(([key, category]) => {
                  const mapped = SKILL_TO_CATEGORY_SLUG[category.slug] ?? category.slug;
                  return (
                    <Link
                      key={key}
                      href={`/categories/${mapped}`}
                      className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {category.name}
                    </Link>
                  );
                })}
            </nav>
            <div className="mt-2">
              <SearchBar />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

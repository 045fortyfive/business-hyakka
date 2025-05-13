'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import SearchBar from './SearchBar';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          {/* ロゴ */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <Image
                src="https://njazjixymhdfjiag.public.blob.vercel-storage.com/Header%20main%20edited-FrhGP5sX6hYOJRQvZkASlfnkkjvQAP.png"
                alt="Skillpedia - 20代のビジネススキル百科"
                width={400}
                height={134}
                className="h-24 w-auto"
                priority
                unoptimized
              />
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/articles" className="text-gray-600 hover:text-gray-900">
              記事
            </Link>
            <Link href="/videos" className="text-gray-600 hover:text-gray-900">
              動画
            </Link>
            <Link href="/audios" className="text-gray-600 hover:text-gray-900">
              音声
            </Link>
            <Link href="/categories" className="text-gray-600 hover:text-gray-900">
              カテゴリ
            </Link>
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
                className="h-6 w-6"
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
          <div className="md:hidden mt-4 pb-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/articles"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                記事
              </Link>
              <Link
                href="/videos"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                動画
              </Link>
              <Link
                href="/audios"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                音声
              </Link>
              <Link
                href="/categories"
                className="text-gray-600 hover:text-gray-900"
                onClick={() => setIsMenuOpen(false)}
              >
                カテゴリ
              </Link>
            </nav>
            <div className="mt-4">
              <SearchBar />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

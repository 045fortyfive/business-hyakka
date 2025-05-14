'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // 検索クエリをURLエンコードして検索ページに遷移
      const encodedQuery = encodeURIComponent(searchQuery.trim());
      router.push(`/search?q=${encodedQuery}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xs">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="キーワードを入力"
        className="w-full px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 text-sm border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        aria-label="検索キーワード"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        aria-label="検索"
      >
        <svg
          className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </button>
    </form>
  );
}

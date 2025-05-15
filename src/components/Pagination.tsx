'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
}

export default function Pagination({
  totalItems,
  itemsPerPage,
  currentPage,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // 総ページ数を計算
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  // 表示するページ番号の範囲を決定
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // 表示するページ番号の最大数
    
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;
    
    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    return pageNumbers;
  };
  
  // ページURLを生成
  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', page.toString());
    return `${pathname}?${params.toString()}`;
  };
  
  // ページネーションが不要な場合は表示しない
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <nav className="flex justify-center my-8" aria-label="ページネーション">
      <ul className="flex space-x-1">
        {/* 前のページへのリンク */}
        {currentPage > 1 && (
          <li>
            <Link
              href={createPageUrl(currentPage - 1)}
              className="px-3 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
              aria-label="前のページ"
            >
              &laquo;
            </Link>
          </li>
        )}
        
        {/* ページ番号 */}
        {getPageNumbers().map((page) => (
          <li key={page}>
            <Link
              href={createPageUrl(page)}
              className={`px-3 py-2 border rounded-md ${
                page === currentPage
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              aria-current={page === currentPage ? 'page' : undefined}
            >
              {page}
            </Link>
          </li>
        ))}
        
        {/* 次のページへのリンク */}
        {currentPage < totalPages && (
          <li>
            <Link
              href={createPageUrl(currentPage + 1)}
              className="px-3 py-2 border rounded-md text-gray-600 hover:bg-gray-50"
              aria-label="次のページ"
            >
              &raquo;
            </Link>
          </li>
        )}
      </ul>
    </nav>
  );
}

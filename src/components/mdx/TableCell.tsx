"use client";

import React from 'react';

interface TableCellProps {
  children: React.ReactNode;
  [key: string]: any;
}

export function TableHeader({ children, ...props }: TableCellProps) {
  return (
    <th
      className="px-6 py-4 bg-gray-50 text-left text-sm font-semibold text-gray-700 border-b border-gray-200 align-top"
      {...props}
    >
      {children}
    </th>
  );
}

export function TableData({ children, ...props }: TableCellProps) {
  return (
    <td
      className="px-6 py-4 text-sm text-gray-900 border-b border-gray-200 align-top"
      {...props}
    >
      {children}
    </td>
  );
}

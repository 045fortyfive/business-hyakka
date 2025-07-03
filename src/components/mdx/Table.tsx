"use client";

import React from 'react';

interface TableProps {
  children: React.ReactNode;
}

export default function Table({ children }: TableProps) {
  return (
    <div className="my-8 mx-8 overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 border border-gray-200 rounded-lg shadow-sm">
        {children}
      </table>
    </div>
  );
}

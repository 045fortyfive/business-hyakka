import React from 'react';

// カスタムinsタグ（アンダーライン + 薄青背景）
export const CustomIns = ({ children, ...props }: any) => {
  // 安全性チェック
  if (children === null || children === undefined) {
    return null;
  }

  return (
    <ins className="underline decoration-2 decoration-blue-500 bg-blue-50 px-1 rounded" {...props}>
      {children}
    </ins>
  );
};

// 赤文字ハイライト
export const RedText = ({ children, ...props }: any) => {
  // 安全性チェック
  if (children === null || children === undefined) {
    return null;
  }

  return (
    <span className="text-red-600 font-medium" {...props}>
      {children}
    </span>
  );
};

// 黄色背景マーカー
export const YellowHighlight = ({ children, ...props }: any) => {
  // 安全性チェック
  if (children === null || children === undefined) {
    return null;
  }

  return (
    <mark className="bg-yellow-200 px-1 rounded" {...props}>
      {children}
    </mark>
  );
};

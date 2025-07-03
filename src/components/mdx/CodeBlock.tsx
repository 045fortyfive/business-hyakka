"use client";

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
  language?: string;
  children: any; // より柔軟な型定義
}

// 入力値を安全な文字列に正規化する関数
function normalizeCodeContent(content: any): string {
  if (content === null || content === undefined) {
    return '';
  }

  if (typeof content === 'string') {
    return content;
  }

  if (typeof content === 'number' || typeof content === 'boolean') {
    return String(content);
  }

  if (Array.isArray(content)) {
    return content.map(item => normalizeCodeContent(item)).join('');
  }

  if (typeof content === 'object') {
    // React要素の場合
    if (content.props && content.props.children) {
      return normalizeCodeContent(content.props.children);
    }

    // その他のオブジェクトの場合
    try {
      return JSON.stringify(content, null, 2);
    } catch {
      return '[Object]';
    }
  }

  return String(content);
}

// 言語名を正規化する関数
function normalizeLanguage(language: any): string {
  if (!language || typeof language !== 'string') {
    return 'text';
  }

  // 一般的な言語名のマッピング
  const languageMap: Record<string, string> = {
    'js': 'javascript',
    'ts': 'typescript',
    'jsx': 'javascript',
    'tsx': 'typescript',
    'py': 'python',
    'rb': 'ruby',
    'sh': 'bash',
    'yml': 'yaml',
  };

  const normalizedLang = language.toLowerCase().trim();
  return languageMap[normalizedLang] || normalizedLang;
}

// エラーバウンダリコンポーネント
class CodeBlockErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.warn('CodeBlock rendering error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default function CodeBlock({ language, children }: CodeBlockProps) {
  const normalizedContent = normalizeCodeContent(children);
  const normalizedLanguage = normalizeLanguage(language);

  // フォールバック表示コンポーネント
  const FallbackDisplay = () => (
    <div className="my-6 p-4 bg-gray-100 border border-gray-300 rounded-lg">
      <div className="flex items-center mb-2">
        <span className="text-sm text-gray-600 font-medium">
          コードブロック ({normalizedLanguage})
        </span>
      </div>
      <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto">
        {normalizedContent || '// コードの内容を表示できませんでした'}
      </pre>
    </div>
  );

  // 内容が空の場合のチェック
  if (!normalizedContent.trim()) {
    return (
      <div className="my-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <span className="text-sm text-yellow-700">
          空のコードブロックです
        </span>
      </div>
    );
  }

  return (
    <CodeBlockErrorBoundary fallback={<FallbackDisplay />}>
      <div className="my-6">
        <SyntaxHighlighter
          language={normalizedLanguage}
          style={vscDarkPlus}
          className="rounded-lg overflow-hidden"
          showLineNumbers={normalizedContent.split('\n').length > 5}
          wrapLines={true}
          customStyle={{
            margin: 0,
            borderRadius: '0.5rem',
          }}
        >
          {normalizedContent}
        </SyntaxHighlighter>
      </div>
    </CodeBlockErrorBoundary>
  );
}

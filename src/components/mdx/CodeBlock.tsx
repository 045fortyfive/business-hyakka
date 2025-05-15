"use client";

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/cjs/styles/prism';

interface CodeBlockProps {
  language: string;
  children: string;
}

export default function CodeBlock({ language, children }: CodeBlockProps) {
  return (
    <div className="my-6">
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        className="rounded-lg overflow-hidden"
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
}

'use client';

import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import Image from 'next/image';
import Link from 'next/link';

interface ContentfulRichTextProps {
  content: any;
}

// Rich text rendering options
const renderOptions = {
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => <strong className="font-bold">{text}</strong>,
    [MARKS.ITALIC]: (text: React.ReactNode) => <em className="italic">{text}</em>,
    [MARKS.UNDERLINE]: (text: React.ReactNode) => <u className="underline">{text}</u>,
    [MARKS.CODE]: (text: React.ReactNode) => (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{text}</code>
    ),
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => (
      <p className="mb-4 leading-relaxed">{children}</p>
    ),
    [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => (
      <h1 className="text-3xl font-bold mb-6 mt-8 first:mt-0">{children}</h1>
    ),
    [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => (
      <h2 className="text-2xl font-bold mb-4 mt-6 first:mt-0">{children}</h2>
    ),
    [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => (
      <h3 className="text-xl font-bold mb-3 mt-5 first:mt-0">{children}</h3>
    ),
    [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => (
      <h4 className="text-lg font-bold mb-2 mt-4 first:mt-0">{children}</h4>
    ),
    [BLOCKS.HEADING_5]: (node: any, children: React.ReactNode) => (
      <h5 className="text-base font-bold mb-2 mt-3 first:mt-0">{children}</h5>
    ),
    [BLOCKS.HEADING_6]: (node: any, children: React.ReactNode) => (
      <h6 className="text-sm font-bold mb-2 mt-3 first:mt-0">{children}</h6>
    ),
    [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
      <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
      <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => (
      <li className="ml-4">{children}</li>
    ),
    [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
      <blockquote className="border-l-4 border-blue-500 pl-4 py-2 mb-4 bg-blue-50 italic">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-8 border-gray-300" />,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { title, description, file } = node.data.target.fields;
      const { url, details } = file;
      
      if (details.image) {
        return (
          <div className="my-6">
            <Image
              src={`https:${url}`}
              alt={title || description || ''}
              width={details.image.width}
              height={details.image.height}
              className="rounded-lg max-w-full h-auto"
            />
            {(title || description) && (
              <p className="text-sm text-gray-600 mt-2 text-center italic">
                {title || description}
              </p>
            )}
          </div>
        );
      }
      
      // For non-image assets, show as download link
      return (
        <div className="my-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <Link
            href={`https:${url}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {title || file.fileName || 'ダウンロード'}
          </Link>
          {description && (
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          )}
        </div>
      );
    },
    [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
      <Link
        href={node.data.uri}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        {children}
      </Link>
    ),
    [INLINES.ENTRY_HYPERLINK]: (node: any, children: React.ReactNode) => {
      // Handle internal content links
      const entry = node.data.target;
      if (entry && entry.fields && entry.fields.slug) {
        return (
          <Link
            href={`/articles/${entry.fields.slug}`}
            className="text-blue-600 hover:text-blue-800 underline"
          >
            {children}
          </Link>
        );
      }
      return <span>{children}</span>;
    },
  },
};

export default function ContentfulRichText({ content }: ContentfulRichTextProps) {
  if (!content) {
    return null;
  }

  try {
    // If content is a string, try to parse it as JSON
    let parsedContent = content;
    if (typeof content === 'string') {
      try {
        parsedContent = JSON.parse(content);
      } catch (e) {
        // If parsing fails, treat as plain text
        return (
          <div className="prose prose-base md:prose-lg max-w-none">
            <p>{content}</p>
          </div>
        );
      }
    }

    // Render the rich text content
    return (
      <div className="prose prose-base md:prose-lg max-w-none">
        {documentToReactComponents(parsedContent, renderOptions)}
      </div>
    );
  } catch (error) {
    console.error('Error rendering Contentful rich text:', error);
    return (
      <div className="prose prose-base md:prose-lg max-w-none">
        <p className="text-gray-600 italic">コンテンツの表示中にエラーが発生しました。</p>
      </div>
    );
  }
}

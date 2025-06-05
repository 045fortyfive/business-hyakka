'use client';

import React from 'react';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import Image from 'next/image';
import Link from 'next/link';

interface ContentfulRichTextProps {
  content: any;
}

// YouTube URL detection and embedding
function isYouTubeUrl(url: string): boolean {
  const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
  return youtubeRegex.test(url);
}

function getYouTubeEmbedUrl(url: string): string {
  // Handle different YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/watch\?.*v=([^&\n?#]+)/
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1`;
    }
  }

  return url; // Return original if no match
}

// YouTube embed component
function YouTubeEmbed({ url, title }: { url: string; title?: string }) {
  const embedUrl = getYouTubeEmbedUrl(url);

  return (
    <div className="my-6">
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
        <iframe
          src={embedUrl}
          title={title || 'YouTube video'}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      {title && (
        <p className="text-sm text-gray-600 mt-2 text-center italic">
          {title}
        </p>
      )}
    </div>
  );
}

// Enhanced text rendering with proper line break handling
function renderTextWithLineBreaks(text: string): React.ReactNode {
  if (!text) return null;

  // Split by line breaks and create proper paragraph structure
  const lines = text.split('\n');
  const elements: React.ReactNode[] = [];

  let currentParagraph: string[] = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (trimmedLine === '') {
      // Empty line - end current paragraph if it has content
      if (currentParagraph.length > 0) {
        elements.push(
          <p key={`p-${elements.length}`} className="mb-4 leading-relaxed">
            {currentParagraph.join(' ')}
          </p>
        );
        currentParagraph = [];
      }
    } else {
      // Non-empty line - add to current paragraph
      currentParagraph.push(trimmedLine);
    }
  });

  // Add final paragraph if it has content
  if (currentParagraph.length > 0) {
    elements.push(
      <p key={`p-${elements.length}`} className="mb-4 leading-relaxed">
        {currentParagraph.join(' ')}
      </p>
    );
  }

  return elements.length > 0 ? <>{elements}</> : <p className="mb-4 leading-relaxed">{text}</p>;
}

// Enhanced rich text rendering options
const renderOptions = {
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => <strong className="font-bold">{text}</strong>,
    [MARKS.ITALIC]: (text: React.ReactNode) => <em className="italic">{text}</em>,
    [MARKS.UNDERLINE]: (text: React.ReactNode) => <u className="underline decoration-2 underline-offset-2">{text}</u>,
    [MARKS.CODE]: (text: React.ReactNode) => (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">{text}</code>
    ),
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => {
      // Enhanced paragraph rendering with better line break handling
      if (typeof children === 'string') {
        return renderTextWithLineBreaks(children);
      }
      return <p className="mb-4 leading-relaxed whitespace-pre-line">{children}</p>;
    },
    [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => {
      const headingId = `heading-1-${Math.random().toString(36).substr(2, 9)}`;
      return (
        <h1 id={headingId} className="text-3xl font-bold mb-6 mt-8 first:mt-0 scroll-mt-4">
          {children}
        </h1>
      );
    },
    [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => {
      const headingId = `heading-2-${Math.random().toString(36).substr(2, 9)}`;
      return (
        <h2 id={headingId} className="text-2xl font-bold mb-4 mt-6 first:mt-0 scroll-mt-4">
          {children}
        </h2>
      );
    },
    [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => {
      const headingId = `heading-3-${Math.random().toString(36).substr(2, 9)}`;
      return (
        <h3 id={headingId} className="text-xl font-bold mb-3 mt-5 first:mt-0 scroll-mt-4">
          {children}
        </h3>
      );
    },
    [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => {
      const headingId = `heading-4-${Math.random().toString(36).substr(2, 9)}`;
      return (
        <h4 id={headingId} className="text-lg font-bold mb-2 mt-4 first:mt-0 scroll-mt-4">
          {children}
        </h4>
      );
    },
    [BLOCKS.HEADING_5]: (node: any, children: React.ReactNode) => {
      const headingId = `heading-5-${Math.random().toString(36).substr(2, 9)}`;
      return (
        <h5 id={headingId} className="text-base font-bold mb-2 mt-3 first:mt-0 scroll-mt-4">
          {children}
        </h5>
      );
    },
    [BLOCKS.HEADING_6]: (node: any, children: React.ReactNode) => {
      const headingId = `heading-6-${Math.random().toString(36).substr(2, 9)}`;
      return (
        <h6 id={headingId} className="text-sm font-bold mb-2 mt-3 first:mt-0 scroll-mt-4">
          {children}
        </h6>
      );
    },
    [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
      <ul className="list-disc list-outside mb-6 space-y-2 pl-6">{children}</ul>
    ),
    [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
      <ol className="list-decimal list-outside mb-6 space-y-2 pl-6">{children}</ol>
    ),
    [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => (
      <li className="leading-relaxed">{children}</li>
    ),
    [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
      <blockquote className="border-l-4 border-blue-500 pl-6 py-4 mb-6 bg-blue-50 italic text-gray-700 rounded-r-lg">
        {children}
      </blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-8 border-gray-300" />,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      try {
        const { title, description, file } = node.data.target.fields;
        const { url, details } = file;

        if (details?.image) {
          return (
            <div className="my-8">
              <Image
                src={`https:${url}`}
                alt={title || description || ''}
                width={details.image.width}
                height={details.image.height}
                className="rounded-lg max-w-full h-auto mx-auto shadow-md"
              />
              {(title || description) && (
                <p className="text-sm text-gray-600 mt-3 text-center italic">
                  {title || description}
                </p>
              )}
            </div>
          );
        }

        // For non-image assets, show as enhanced download link
        return (
          <div className="my-6 p-4 border border-gray-200 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <Link
              href={`https:${url}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 text-blue-600 hover:text-blue-800"
            >
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <div>
                <div className="font-medium">{title || file.fileName || 'ダウンロード'}</div>
                {description && (
                  <div className="text-sm text-gray-600 mt-1">{description}</div>
                )}
              </div>
            </Link>
          </div>
        );
      } catch (error) {
        console.error('Error rendering embedded asset:', error);
        return (
          <div className="my-4 p-4 border border-red-200 rounded-lg bg-red-50">
            <p className="text-red-600 text-sm">埋め込みアセットの表示中にエラーが発生しました。</p>
          </div>
        );
      }
    },
    [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => {
      const url = node.data.uri;

      // Check if it's a YouTube URL and render as embedded video
      if (isYouTubeUrl(url)) {
        return <YouTubeEmbed url={url} title={children?.toString()} />;
      }

      // Regular hyperlink
      return (
        <Link
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 transition-colors"
        >
          {children}
        </Link>
      );
    },
    [INLINES.ENTRY_HYPERLINK]: (node: any, children: React.ReactNode) => {
      try {
        // Handle internal content links with improved routing
        const entry = node.data.target;
        if (entry?.fields?.slug) {
          // Determine the correct route based on content type
          let basePath = '/articles';
          if (entry.fields.contentType) {
            const contentType = Array.isArray(entry.fields.contentType)
              ? entry.fields.contentType[0]
              : entry.fields.contentType;

            switch (contentType) {
              case '動画':
                basePath = '/videos';
                break;
              case '音声':
                basePath = '/audios';
                break;
              default:
                basePath = '/articles';
            }
          }

          return (
            <Link
              href={`${basePath}/${entry.fields.slug}`}
              className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 transition-colors"
            >
              {children}
            </Link>
          );
        }
        return <span className="text-gray-600">{children}</span>;
      } catch (error) {
        console.error('Error rendering entry hyperlink:', error);
        return <span className="text-gray-600">{children}</span>;
      }
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
        // If parsing fails, treat as plain text with proper line break handling
        return (
          <div className="prose prose-base md:prose-lg max-w-none">
            {renderTextWithLineBreaks(content)}
          </div>
        );
      }
    }

    // Validate that parsedContent has the expected structure
    if (!parsedContent || typeof parsedContent !== 'object') {
      return (
        <div className="prose prose-base md:prose-lg max-w-none">
          <p className="text-gray-600 italic">コンテンツの形式が正しくありません。</p>
        </div>
      );
    }

    // Render the rich text content with enhanced styling
    return (
      <div className="prose prose-base md:prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-strong:text-gray-900">
        {documentToReactComponents(parsedContent, renderOptions)}
      </div>
    );
  } catch (error) {
    console.error('Error rendering Contentful rich text:', error);
    console.error('Content that caused error:', content);
    return (
      <div className="prose prose-base md:prose-lg max-w-none">
        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
          <p className="text-red-600 font-medium">コンテンツの表示中にエラーが発生しました。</p>
          <p className="text-red-500 text-sm mt-1">
            管理者にお問い合わせください。
          </p>
        </div>
      </div>
    );
  }
}

// Export helper function for TOC generation
export function extractHeadingsFromRichText(content: any): Array<{level: number, text: string, id: string}> {
  const headings: Array<{level: number, text: string, id: string}> = [];

  function traverseContent(nodes: any[]) {
    if (!Array.isArray(nodes)) return;

    nodes.forEach((node) => {
      if (node.nodeType && node.nodeType.startsWith('heading-')) {
        const level = parseInt(node.nodeType.split('-')[1]);
        const text = node.content
          ?.map((textNode: any) => textNode.value || '')
          .join('')
          .trim();

        if (text) {
          const id = `heading-${level}-${Math.random().toString(36).substr(2, 9)}`;
          headings.push({ level, text, id });
        }
      }

      // Recursively traverse child content
      if (node.content && Array.isArray(node.content)) {
        traverseContent(node.content);
      }
    });
  }

  try {
    let parsedContent = content;
    if (typeof content === 'string') {
      parsedContent = JSON.parse(content);
    }

    if (parsedContent?.content && Array.isArray(parsedContent.content)) {
      traverseContent(parsedContent.content);
    }
  } catch (error) {
    console.error('Error extracting headings from rich text:', error);
  }

  return headings;
}

import React from 'react';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import Link from 'next/link';
import Image from 'next/image';

// リッチテキストのレンダリングオプション
const options = {
  renderMark: {
    [MARKS.BOLD]: (text: React.ReactNode) => <strong>{text}</strong>,
    [MARKS.ITALIC]: (text: React.ReactNode) => <em>{text}</em>,
    [MARKS.UNDERLINE]: (text: React.ReactNode) => <u>{text}</u>,
    [MARKS.CODE]: (text: React.ReactNode) => <code className="bg-gray-100 p-1 rounded">{text}</code>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => <p className="mb-4">{children}</p>,
    [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => <h1 className="text-3xl font-bold mb-4 mt-6">{children}</h1>,
    [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => <h2 className="text-2xl font-bold mb-3 mt-5">{children}</h2>,
    [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => <h3 className="text-xl font-bold mb-2 mt-4">{children}</h3>,
    [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => <h4 className="text-lg font-bold mb-2 mt-4">{children}</h4>,
    [BLOCKS.HEADING_5]: (node: any, children: React.ReactNode) => <h5 className="text-base font-bold mb-2 mt-3">{children}</h5>,
    [BLOCKS.HEADING_6]: (node: any, children: React.ReactNode) => <h6 className="text-sm font-bold mb-2 mt-3">{children}</h6>,
    [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
    [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
    [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => <li className="mb-1">{children}</li>,
    [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
      <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4">{children}</blockquote>
    ),
    [BLOCKS.HR]: () => <hr className="my-6 border-t border-gray-300" />,
    [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
      const { title, description, file } = node.data.target.fields;
      const { url, details } = file;
      const { image } = details;
      const { width, height } = image || { width: 800, height: 600 };

      return (
        <div className="my-4">
          <div className="relative" style={{ width: '100%', height: 'auto', aspectRatio: `${width}/${height}` }}>
            <Image
              src={url}
              alt={description || title || 'Embedded Asset'}
              fill
              className="object-contain"
            />
          </div>
          {title && <p className="text-sm text-center text-gray-500 mt-1">{title}</p>}
        </div>
      );
    },
    [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => {
      const { uri } = node.data;
      const isInternal = uri.startsWith('/');

      if (isInternal) {
        return (
          <Link href={uri} className="text-primary hover:underline">
            {children}
          </Link>
        );
      }

      return (
        <a href={uri} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
          {children}
        </a>
      );
    },
    [INLINES.ENTRY_HYPERLINK]: (node: any, children: React.ReactNode) => {
      const { slug } = node.data.target.fields;
      return (
        <Link href={`/content/${slug}`} className="text-primary hover:underline">
          {children}
        </Link>
      );
    },
  },
};

// リッチテキストをReactコンポーネントに変換する関数
export function renderRichText(richText: any) {
  if (!richText) {
    return null;
  }

  try {
    return documentToReactComponents(richText, options);
  } catch (error) {
    console.error('Error rendering rich text:', error);
    return <p>コンテンツの表示中にエラーが発生しました。</p>;
  }
}

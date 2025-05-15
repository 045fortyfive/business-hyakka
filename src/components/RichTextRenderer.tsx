import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import Image from 'next/image';
import Link from 'next/link';
import VideoPlayer from './VideoPlayer';
import AudioPlayer from './AudioPlayer';
import { generateHeadingId } from '@/utils/toc-generator';

interface RichTextRendererProps {
  content: any; // Contentfulのリッチテキストドキュメント
  assets?: any[]; // 埋め込みアセット（画像など）
  entries?: any[]; // 埋め込みエントリー（他のコンテンツへの参照）
}

export default function RichTextRenderer({
  content,
  assets = [],
  entries = [],
}: RichTextRendererProps) {
  // アセットとエントリーのマップを作成
  const assetMap = assets.reduce((map, asset) => {
    map[asset.sys.id] = asset;
    return map;
  }, {});

  const entryMap = entries.reduce((map, entry) => {
    map[entry.sys.id] = entry;
    return map;
  }, {});

  // 見出しのカウンター
  let headingCounter = 0;

  // リッチテキストのレンダリングオプション
  const options = {
    renderMark: {
      [MARKS.BOLD]: (text: React.ReactNode) => <strong className="font-bold">{text}</strong>,
      [MARKS.ITALIC]: (text: React.ReactNode) => <em className="italic">{text}</em>,
      [MARKS.UNDERLINE]: (text: React.ReactNode) => <u className="underline">{text}</u>,
      [MARKS.CODE]: (text: React.ReactNode) => (
        <code className="bg-gray-100 rounded px-2 py-1 font-mono text-sm">
          {text}
        </code>
      ),
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => (
        <p className="mb-6 leading-relaxed text-gray-800">{children}</p>
      ),
      [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => {
        const text = node.content.map((content: any) => content.value || '').join('');
        const id = generateHeadingId(text, headingCounter++);
        return (
          <h1 id={id} className="text-3xl font-bold mt-10 mb-6 scroll-mt-16 border-b pb-2 border-gray-200">
            {children}
          </h1>
        );
      },
      [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => {
        const text = node.content.map((content: any) => content.value || '').join('');
        const id = generateHeadingId(text, headingCounter++);
        return (
          <h2 id={id} className="text-2xl font-bold mt-8 mb-4 scroll-mt-16 border-b pb-1 border-gray-200">
            {children}
          </h2>
        );
      },
      [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => {
        const text = node.content.map((content: any) => content.value || '').join('');
        const id = generateHeadingId(text, headingCounter++);
        return (
          <h3 id={id} className="text-xl font-bold mt-6 mb-3 scroll-mt-16">
            {children}
          </h3>
        );
      },
      [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => {
        const text = node.content.map((content: any) => content.value || '').join('');
        const id = generateHeadingId(text, headingCounter++);
        return (
          <h4 id={id} className="text-lg font-bold mt-5 mb-2 scroll-mt-16">
            {children}
          </h4>
        );
      },
      [BLOCKS.HEADING_5]: (node: any, children: React.ReactNode) => (
        <h5 className="text-base font-bold mt-4 mb-2">{children}</h5>
      ),
      [BLOCKS.HEADING_6]: (node: any, children: React.ReactNode) => (
        <h6 className="text-sm font-bold mt-3 mb-1">{children}</h6>
      ),
      [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => (
        <ul className="list-disc pl-8 mb-6 space-y-2">{children}</ul>
      ),
      [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => (
        <ol className="list-decimal pl-8 mb-6 space-y-2">{children}</ol>
      ),
      [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => (
        <li className="mb-1 text-gray-800">{children}</li>
      ),
      [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
        <blockquote className="border-l-4 border-gray-300 pl-6 py-2 mb-6 italic bg-gray-50 rounded-r-lg">
          {children}
        </blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="my-8 border-gray-200" />,
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const assetId = node.data.target.sys.id;
        const asset = assetMap[assetId];

        if (!asset) {
          return <p className="text-red-500">アセットが見つかりません</p>;
        }

        const { title, description, file } = asset.fields;
        const url = `https:${file.url}`;
        const mimeType = file.contentType;

        // 画像の場合
        if (mimeType.startsWith('image/')) {
          const { width, height } = file.details.image || { width: 800, height: 600 };
          return (
            <figure className="my-8">
              <div className="overflow-hidden rounded-lg shadow-md">
                <Image
                  src={url}
                  alt={description || title || ''}
                  width={width}
                  height={height}
                  className="w-full mx-auto"
                />
              </div>
              {title && (
                <figcaption className="text-center text-sm text-gray-500 mt-3">{title}</figcaption>
              )}
            </figure>
          );
        }

        // 動画の場合
        if (mimeType.startsWith('video/')) {
          return (
            <figure className="my-8">
              <div className="overflow-hidden rounded-lg shadow-md">
                <VideoPlayer videoUrl={url} title={title || ''} />
              </div>
              {title && (
                <figcaption className="text-center text-sm text-gray-500 mt-3">{title}</figcaption>
              )}
            </figure>
          );
        }

        // 音声の場合
        if (mimeType.startsWith('audio/')) {
          return (
            <figure className="my-8 bg-gray-50 p-4 rounded-lg">
              <AudioPlayer audioUrl={url} title={title || ''} />
              {title && (
                <figcaption className="text-center text-sm text-gray-500 mt-3">{title}</figcaption>
              )}
            </figure>
          );
        }

        // その他のファイルの場合
        return (
          <div className="my-6 flex justify-center">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <svg
                className="h-5 w-5 mr-2 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              {title || 'ファイルをダウンロード'}
            </a>
          </div>
        );
      },
      [BLOCKS.EMBEDDED_ENTRY]: (node: any) => {
        const entryId = node.data.target.sys.id;
        const entry = entryMap[entryId];

        if (!entry) {
          return <p className="text-red-500">エントリーが見つかりません</p>;
        }

        // エントリーのタイプに応じたレンダリング
        const contentType = entry.sys.contentType.sys.id;

        switch (contentType) {
          // 記事の場合
          case 'article':
            return (
              <div className="my-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <h3 className="text-lg font-semibold mb-2">
                  <Link
                    href={`/articles/${entry.fields.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {entry.fields.title}
                  </Link>
                </h3>
                {entry.fields.seoDescription && (
                  <p className="text-gray-600">{entry.fields.seoDescription}</p>
                )}
              </div>
            );

          // 動画の場合
          case 'video':
            return (
              <div className="my-6">
                <VideoPlayer
                  videoUrl={entry.fields.videoUrlEmbed}
                  title={entry.fields.title}
                />
                <h3 className="text-lg font-semibold mt-2">
                  <Link
                    href={`/videos/${entry.fields.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {entry.fields.title}
                  </Link>
                </h3>
              </div>
            );

          // 音声の場合
          case 'audio':
            return (
              <div className="my-6">
                <AudioPlayer
                  audioUrl={entry.fields.audioUrl}
                  title={entry.fields.title}
                />
                <h3 className="text-lg font-semibold mt-2">
                  <Link
                    href={`/audios/${entry.fields.slug}`}
                    className="text-blue-600 hover:underline"
                  >
                    {entry.fields.title}
                  </Link>
                </h3>
              </div>
            );

          // その他のエントリータイプの場合
          default:
            return (
              <div className="my-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                <p className="text-gray-600">
                  埋め込みコンテンツ: {entry.fields.title || 'タイトルなし'}
                </p>
              </div>
            );
        }
      },
      [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => {
        const { uri } = node.data;
        const isInternal = uri.startsWith('/');

        return (
          <Link
            href={uri}
            className="text-blue-600 hover:underline"
            {...(isInternal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
          >
            {children}
          </Link>
        );
      },
      [INLINES.ENTRY_HYPERLINK]: (node: any, children: React.ReactNode) => {
        const entryId = node.data.target.sys.id;
        const entry = entryMap[entryId];

        if (!entry) {
          return <span className="text-red-500">{children}</span>;
        }

        const contentType = entry.sys.contentType.sys.id;
        let href = '/';

        switch (contentType) {
          case 'article':
            href = `/articles/${entry.fields.slug}`;
            break;
          case 'video':
            href = `/videos/${entry.fields.slug}`;
            break;
          case 'audio':
            href = `/audios/${entry.fields.slug}`;
            break;
          case 'category':
            href = `/categories/${entry.fields.slug}`;
            break;
          default:
            break;
        }

        return (
          <Link href={href} className="text-blue-600 hover:underline">
            {children}
          </Link>
        );
      },
    },
  };

  return (
    <div className="rich-text">
      {documentToReactComponents(content, options)}
    </div>
  );
}

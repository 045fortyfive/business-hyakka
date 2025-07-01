import React from 'react';
import { Download, Play, FileText, File } from 'lucide-react';

interface MediaRendererProps {
  src: string;
  alt?: string;
  title?: string;
  width?: number;
  height?: number;
  className?: string;
}

// ファイル拡張子を取得（ContentfulのURL構造に対応）
function getFileExtension(url: string): string {
  // 入力値の検証
  if (!url || typeof url !== 'string') {
    console.warn('getFileExtension: Invalid URL provided:', url);
    return '';
  }

  try {
    // ContentfulのURLからファイル名部分を抽出
    // 例: https://videos.ctfassets.net/vxy009lryi3x/7pZnG2cON7JSHXPcC7LTz4/84d4a503b833bd827ca3dceba091a865/IMG_4618.MOV
    const parts = url.split('/');
    const lastPart = parts[parts.length - 1];

    // ファイル名に拡張子が含まれている場合
    if (lastPart && typeof lastPart === 'string' && lastPart.includes('.')) {
      const extension = lastPart.split('.').pop();
      return extension ? extension.toLowerCase() : '';
    }

    // URLパラメータから推測
    try {
      const urlObj = new URL(url.startsWith('//') ? `https:${url}` : url);
      const pathname = urlObj.pathname;
      if (pathname && typeof pathname === 'string') {
        const pathParts = pathname.split('.');
        if (pathParts.length > 1) {
          return pathParts[pathParts.length - 1].toLowerCase();
        }
      }
    } catch (e) {
      console.warn('URL parsing failed:', e);
    }

    return '';
  } catch (error) {
    console.error('Error in getFileExtension:', error, 'URL:', url);
    return '';
  }
}

// ファイルタイプを判定
function getFileType(url: string): 'image' | 'video' | 'audio' | 'document' | 'download' {
  // 入力値の検証
  if (!url || typeof url !== 'string') {
    console.warn('getFileType: Invalid URL provided:', url);
    return 'download';
  }

  try {
    const extension = getFileExtension(url);

    // 拡張子がない場合はContentfulのURLドメインから推測
    if (!extension) {
      if (url.includes('videos.ctfassets.net')) {
        return 'video';
      }
      if (url.includes('images.ctfassets.net')) {
        return 'image';
      }
      if (url.includes('assets.ctfassets.net')) {
        // ファイル名から推測
        try {
          const urlParts = url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          if (fileName && typeof fileName === 'string') {
            const lowerFileName = fileName.toLowerCase();
            if (lowerFileName.includes('video') || lowerFileName.includes('mov') || lowerFileName.includes('mp4')) {
              return 'video';
            }
            if (lowerFileName.includes('audio') || lowerFileName.includes('mp3') || lowerFileName.includes('wav')) {
              return 'audio';
            }
            if (lowerFileName.includes('image') || lowerFileName.includes('img') || lowerFileName.includes('photo')) {
              return 'image';
            }
          }
        } catch (error) {
          console.warn('Error parsing filename from URL:', error);
        }
      }
    }

    if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(extension)) {
      return 'image';
    }
    if (['mp4', 'avi', 'mov', 'wmv', 'webm', 'mkv'].includes(extension)) {
      return 'video';
    }
    if (['mp3', 'wav', 'flac', 'aac', 'ogg'].includes(extension)) {
      return 'audio';
    }
    if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'].includes(extension)) {
      return 'document';
    }
    return 'download';
  } catch (error) {
    console.error('Error in getFileType:', error, 'URL:', url);
    return 'download';
  }
}

// ファイルアイコンを取得
function getFileIcon(extension: string) {
  switch (extension) {
    case 'pdf':
      return <FileText className="w-5 h-5 text-red-500" />;
    case 'doc':
    case 'docx':
      return <FileText className="w-5 h-5 text-blue-500" />;
    case 'xls':
    case 'xlsx':
      return <FileText className="w-5 h-5 text-green-500" />;
    case 'ppt':
    case 'pptx':
      return <FileText className="w-5 h-5 text-orange-500" />;
    case 'zip':
    case 'rar':
    case '7z':
      return <File className="w-5 h-5 text-purple-500" />;
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'webm':
      return <Play className="w-5 h-5 text-indigo-500" />;
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
      return <File className="w-5 h-5 text-yellow-500" />;
    default:
      return <File className="w-5 h-5 text-gray-500" />;
  }
}

export default function MediaRenderer({
  src,
  alt,
  title,
  width,
  height,
  className = ""
}: MediaRendererProps) {
  // 入力値の検証
  if (!src || typeof src !== 'string') {
    console.warn('MediaRenderer: Invalid src provided:', src);
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 my-4">
        <span className="text-gray-500 text-sm">メディアファイルが指定されていません</span>
      </div>
    );
  }

  try {
    // URL正規化：//で始まる場合はhttps:を追加
    const normalizedSrc = src.startsWith('//') ? `https:${src}` : src;
    const fileType = getFileType(normalizedSrc);
    const extension = getFileExtension(normalizedSrc);

    // ファイル名を安全に取得
    let fileName = 'download';
    try {
      const urlParts = normalizedSrc.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      if (lastPart && typeof lastPart === 'string') {
        fileName = lastPart;
      }
    } catch (error) {
      console.warn('Error extracting filename:', error);
    }

    // デバッグ用ログ
    console.log('MediaRenderer Debug:', {
      src,
      normalizedSrc,
      extension,
      fileType,
      fileName
    });

    switch (fileType) {
    case 'image':
      return (
        <img
          src={normalizedSrc}
          alt={alt || title || '画像'}
          title={title}
          width={width}
          height={height}
          className={`max-w-full h-auto ${className}`}
          loading="lazy"
        />
      );

    case 'video':
      // videoタグは<p>内でも使用可能
      return (
        <video
          src={normalizedSrc}
          controls
          width={width || '100%'}
          height={height}
          className={`max-w-full h-auto rounded-lg shadow-sm ${className}`}
          title={title || alt || '動画'}
        >
          お使いのブラウザは動画再生に対応していません。
        </video>
      );

    case 'audio':
      // audioタグも<p>内で使用可能
      return (
        <audio
          src={normalizedSrc}
          controls
          className={`w-full max-w-md ${className}`}
          title={title || alt || '音声'}
        >
          お使いのブラウザは音声再生に対応していません。
        </audio>
      );

    case 'document':
    case 'download':
    default:
      // ダウンロードリンクはaタグのみで構成（<p>内でも問題なし）
      return (
        <a
          href={normalizedSrc}
          target="_blank"
          rel="noopener noreferrer"
          download
          className={`inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap ${className}`}
          title={title || alt || fileName}
        >
          {getFileIcon(extension)}
          <span>
            {title || alt || fileName} をダウンロード
          </span>
          <Download className="w-4 h-4" />
        </a>
      );
    }
  } catch (error) {
    console.error('Error in MediaRenderer:', error);
    return (
      <div className="flex items-center justify-center bg-gray-100 rounded-lg p-4 my-4">
        <span className="text-gray-500 text-sm">メディアファイルの読み込み中にエラーが発生しました</span>
      </div>
    );
  }
}

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
  // ContentfulのURLからファイル名部分を抽出
  // 例: https://videos.ctfassets.net/vxy009lryi3x/7pZnG2cON7JSHXPcC7LTz4/84d4a503b833bd827ca3dceba091a865/IMG_4618.MOV
  const parts = url.split('/');
  const lastPart = parts[parts.length - 1];
  
  // ファイル名に拡張子が含まれている場合
  if (lastPart && lastPart.includes('.')) {
    return lastPart.split('.').pop()?.toLowerCase() || '';
  }
  
  // URLパラメータから推測
  try {
    const urlObj = new URL(url.startsWith('//') ? `https:${url}` : url);
    const pathname = urlObj.pathname;
    const pathParts = pathname.split('.');
    if (pathParts.length > 1) {
      return pathParts[pathParts.length - 1].toLowerCase();
    }
  } catch (e) {
    console.warn('URL parsing failed:', e);
  }
  
  return '';
}

// ファイルタイプを判定
function getFileType(url: string): 'image' | 'video' | 'audio' | 'document' | 'download' {
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
      const fileName = url.split('/').pop()?.toLowerCase() || '';
      if (fileName.includes('video') || fileName.includes('mov') || fileName.includes('mp4')) {
        return 'video';
      }
      if (fileName.includes('audio') || fileName.includes('mp3') || fileName.includes('wav')) {
        return 'audio';
      }
      if (fileName.includes('image') || fileName.includes('img') || fileName.includes('photo')) {
        return 'image';
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
  // URL正規化：//で始まる場合はhttps:を追加
  const normalizedSrc = src.startsWith('//') ? `https:${src}` : src;
  const fileType = getFileType(normalizedSrc);
  const extension = getFileExtension(normalizedSrc);
  const fileName = normalizedSrc.split('/').pop() || 'download';

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
}

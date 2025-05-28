'use client';

import React from 'react';
import Link from 'next/link';
import { Download, FileText, File } from 'lucide-react';

interface DownloadFile {
  url: string;
  title: string;
  filename: string;
}

interface DownloadSectionProps {
  files: DownloadFile[];
  title?: string;
}

// Helper function to get file icon based on extension
function getFileIcon(filename: string) {
  const extension = filename.split('.').pop()?.toLowerCase();
  
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
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'webp':
      return <File className="w-5 h-5 text-pink-500" />;
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
      return <File className="w-5 h-5 text-indigo-500" />;
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
      return <File className="w-5 h-5 text-yellow-500" />;
    default:
      return <File className="w-5 h-5 text-gray-500" />;
  }
}

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Helper function to get file extension
function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toUpperCase() || '';
}

export default function DownloadSection({ files, title = 'ダウンロード' }: DownloadSectionProps) {
  if (!files || files.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-8">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Download className="w-5 h-5 text-blue-600" />
        {title}
      </h2>
      
      <div className="space-y-3">
        {files.map((file, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              {getFileIcon(file.filename)}
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-gray-900 truncate">
                  {file.title}
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span>{file.filename}</span>
                  <span>•</span>
                  <span className="uppercase font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {getFileExtension(file.filename)}
                  </span>
                </div>
              </div>
            </div>
            
            <Link
              href={file.url}
              target="_blank"
              rel="noopener noreferrer"
              download
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
            >
              <Download className="w-4 h-4" />
              ダウンロード
            </Link>
          </div>
        ))}
      </div>
      
      {files.length > 1 && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {files.length}個のファイルが利用可能です
          </p>
        </div>
      )}
    </div>
  );
}

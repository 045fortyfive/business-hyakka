'use client';

import { useEffect, useState, useRef } from 'react';

interface AudioPlayerProps {
  src: string;
  title: string;
  className?: string;
}

export default function AudioPlayer({ src, title, className = "" }: AudioPlayerProps) {
  const [isClient, setIsClient] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // 再生/一時停止を切り替える
  const togglePlay = async () => {
    if (audioRef.current && !hasError) {
      try {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          await audioRef.current.play();
        }
        setIsPlaying(!isPlaying);
      } catch (error) {
        console.error('Audio playback error:', error);
        setHasError(true);
        setErrorMessage('音声の再生に失敗しました');
      }
    }
  };
  
  // シークバーの値が変更されたときの処理
  const handleTimeUpdate = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value;
      setCurrentTime(value);
    }
  };
  
  // 時間を「分:秒」形式にフォーマット
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  // オーディオの読み込みが完了したときの処理
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
      setIsLoading(false);
      setHasError(false);
    }
  };

  // オーディオの読み込みエラー処理
  const handleError = (error: any) => {
    console.error('Audio loading error:', error);
    setIsLoading(false);
    setHasError(true);
    setErrorMessage('音声ファイルの読み込みに失敗しました');
    setIsPlaying(false);
  };

  // オーディオの読み込み開始処理
  const handleLoadStart = () => {
    setIsLoading(true);
    setHasError(false);
  };
  
  // 再生時間が更新されたときの処理
  const handleTimeUpdateEvent = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };
  
  // 再生が終了したときの処理
  const handleEnded = () => {
    setIsPlaying(false);
    setCurrentTime(0);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }
  };
  
  // クライアントサイドでのみレンダリングするために使用
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  // サーバーサイドレンダリング時は何も表示しない
  if (!isClient) {
    return (
      <div className={`bg-gray-100 rounded-lg p-4 flex items-center justify-center ${className}`}>
        <p className="text-gray-500">音声プレーヤーを読み込んでいます...</p>
      </div>
    );
  }

  // エラー状態の表示
  if (hasError) {
    return (
      <div className={`bg-red-50 border border-red-200 rounded-lg p-4 ${className}`}>
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <h3 className="text-red-800 font-medium">{title}</h3>
        </div>
        <p className="text-red-600 text-sm">{errorMessage}</p>
        <p className="text-red-500 text-xs mt-1">音声ファイルのURLを確認してください</p>
      </div>
    );
  }
  
  return (
    <div className={`bg-gray-100 rounded-lg p-4 ${className}`}>
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdateEvent}
        onEnded={handleEnded}
        onError={handleError}
        onLoadStart={handleLoadStart}
        className="hidden"
        preload="metadata"
      />
      
      <div className="flex items-center mb-2">
        <button
          onClick={togglePlay}
          disabled={isLoading || hasError}
          className={`rounded-full w-10 h-10 flex items-center justify-center focus:outline-none transition-colors ${
            isLoading || hasError
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
          aria-label={isLoading ? '読み込み中' : isPlaying ? '一時停止' : '再生'}
        >
          {isLoading ? (
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          ) : isPlaying ? (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                clipRule="evenodd"
              />
            </svg>
          )}
        </button>
        
        <div className="ml-4 flex-grow">
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          {isLoading && <p className="text-sm text-gray-500">音声を読み込んでいます...</p>}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <span className="text-sm text-gray-500 w-10 text-right">
          {formatTime(currentTime)}
        </span>
        
        <input
          type="range"
          min="0"
          max={duration || 0}
          value={currentTime}
          onChange={(e) => handleTimeUpdate(Number(e.target.value))}
          className="flex-grow h-2 bg-gray-300 rounded-full appearance-none cursor-pointer"
          aria-label="シークバー"
        />
        
        <span className="text-sm text-gray-500 w-10">
          {formatTime(duration)}
        </span>
      </div>
    </div>
  );
}

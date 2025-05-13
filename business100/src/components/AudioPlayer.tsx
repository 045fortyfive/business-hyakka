'use client';

import { useEffect, useState, useRef } from 'react';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
}

export default function AudioPlayer({ audioUrl, title }: AudioPlayerProps) {
  const [isClient, setIsClient] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  
  // 再生/一時停止を切り替える
  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
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
    }
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
      <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-center">
        <p className="text-gray-500">音声プレーヤーを読み込んでいます...</p>
      </div>
    );
  }
  
  return (
    <div className="bg-gray-100 rounded-lg p-4">
      <audio
        ref={audioRef}
        src={audioUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdateEvent}
        onEnded={handleEnded}
        className="hidden"
      />
      
      <div className="flex items-center mb-2">
        <button
          onClick={togglePlay}
          className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center focus:outline-none hover:bg-blue-700"
          aria-label={isPlaying ? '一時停止' : '再生'}
        >
          {isPlaying ? (
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

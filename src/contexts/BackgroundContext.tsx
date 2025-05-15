'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// 背景色の選択肢
export type BackgroundColor =
  | 'white'
  | 'gray'
  | 'black'
  | 'blue'
  | 'purple'
  | 'green';

// 背景設定の型定義
interface BackgroundSettings {
  color: BackgroundColor;
  useAurora: boolean;
  auroraSpeed: number;
  auroraBlend: number;
}

// コンテキストの型定義
interface BackgroundContextType {
  settings: BackgroundSettings;
  updateColor: (color: BackgroundColor) => void;
  toggleAurora: () => void;
  updateAuroraSpeed: (speed: number) => void;
  updateAuroraBlend: (blend: number) => void;
}

// デフォルト設定
const defaultSettings: BackgroundSettings = {
  color: 'white',
  useAurora: false,
  auroraSpeed: 0.9,
  auroraBlend: 0.72,
};

// コンテキストの作成
const BackgroundContext = createContext<BackgroundContextType | undefined>(undefined);

// 背景色に対応するTailwindクラス
export const backgroundColorClasses: Record<BackgroundColor, string> = {
  white: 'bg-white text-gray-900',
  gray: 'bg-gray-100 text-gray-900',
  black: 'bg-black text-white',
  blue: 'bg-blue-900 text-white',
  purple: 'bg-purple-900 text-white',
  green: 'bg-green-900 text-white',
};

// プロバイダーコンポーネント
export function BackgroundProvider({ children }: { children: React.ReactNode }) {
  // サーバーサイドレンダリング時の初期値を統一するため、
  // 最初はデフォルト設定を使用し、useEffectでクライアントサイドの設定を読み込む
  const [settings, setSettings] = useState<BackgroundSettings>(defaultSettings);

  // クライアントサイドでのみローカルストレージから設定を読み込む
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedSettings = localStorage.getItem('backgroundSettings');
      if (savedSettings) {
        setSettings(JSON.parse(savedSettings));
      }
    }
  }, []);

  // 設定が変更されたらローカルストレージに保存
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('backgroundSettings', JSON.stringify(settings));
    }
  }, [settings]);

  // 背景色を更新
  const updateColor = (color: BackgroundColor) => {
    setSettings(prev => ({ ...prev, color }));
  };

  // オーロラエフェクトの有効/無効を切り替え
  const toggleAurora = () => {
    setSettings(prev => ({ ...prev, useAurora: !prev.useAurora }));
  };

  // オーロラの速度を更新
  const updateAuroraSpeed = (speed: number) => {
    setSettings(prev => ({ ...prev, auroraSpeed: speed }));
  };

  // オーロラのブレンド値を更新
  const updateAuroraBlend = (blend: number) => {
    setSettings(prev => ({ ...prev, auroraBlend: blend }));
  };

  // コンテキスト値
  const value = {
    settings,
    updateColor,
    toggleAurora,
    updateAuroraSpeed,
    updateAuroraBlend,
  };

  return (
    <BackgroundContext.Provider value={value}>
      {children}
    </BackgroundContext.Provider>
  );
}

// カスタムフック
export function useBackground() {
  const context = useContext(BackgroundContext);
  if (context === undefined) {
    throw new Error('useBackground must be used within a BackgroundProvider');
  }
  return context;
}

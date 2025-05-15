'use client';

import { useState } from 'react';
import { useBackground, BackgroundColor, backgroundColorClasses } from '@/contexts/BackgroundContext';
import { Settings, X } from 'lucide-react';

export default function BackgroundControl() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateColor, toggleAurora, updateAuroraSpeed, updateAuroraBlend } = useBackground();

  // 背景色の選択肢
  const colorOptions: { value: BackgroundColor; label: string; previewClass: string }[] = [
    { value: 'white', label: '白', previewClass: 'bg-white border border-gray-200' },
    { value: 'gray', label: 'グレー', previewClass: 'bg-gray-100' },
    { value: 'black', label: '黒', previewClass: 'bg-black' },
    { value: 'blue', label: '青', previewClass: 'bg-blue-900' },
    { value: 'purple', label: '紫', previewClass: 'bg-purple-900' },
    { value: 'green', label: '緑', previewClass: 'bg-green-900' },
  ];

  return (
    <>
      {/* 設定ボタン */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 z-50 p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors"
        aria-label="背景設定"
      >
        <Settings className="w-6 h-6 text-gray-700" />
      </button>

      {/* 設定パネル */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h2 className="text-lg font-bold">背景設定</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-gray-100"
                aria-label="閉じる"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 space-y-6">
              {/* 背景色の選択 */}
              <div>
                <h3 className="text-sm font-medium mb-3">背景色</h3>
                <div className="grid grid-cols-3 gap-3">
                  {colorOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => updateColor(option.value)}
                      className={`
                        h-12 rounded-md flex items-center justify-center
                        ${option.previewClass}
                        ${settings.color === option.value ? 'ring-2 ring-blue-500' : ''}
                      `}
                    >
                      <span className={`text-sm font-medium ${option.value === 'white' || option.value === 'gray' ? 'text-gray-900' : 'text-white'}`}>
                        {option.label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* オーロラエフェクト */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">オーロラエフェクト</h3>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.useAurora}
                      onChange={toggleAurora}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                {settings.useAurora && (
                  <div className="space-y-4 mt-4">
                    {/* オーロラの速度 */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs text-gray-600">速度: {settings.auroraSpeed.toFixed(1)}</label>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="2"
                        step="0.1"
                        value={settings.auroraSpeed}
                        onChange={(e) => updateAuroraSpeed(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>

                    {/* オーロラのブレンド */}
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-xs text-gray-600">ブレンド: {settings.auroraBlend.toFixed(2)}</label>
                      </div>
                      <input
                        type="range"
                        min="0.1"
                        max="1"
                        step="0.01"
                        value={settings.auroraBlend}
                        onChange={(e) => updateAuroraBlend(parseFloat(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t flex justify-end">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                完了
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

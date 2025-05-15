'use client';

import { useEffect, useRef } from 'react';

interface AuroraBackgroundProps {
  speed?: number;
  blend?: number;
  className?: string;
}

export default function AuroraBackground({
  speed = 0.9,
  blend = 0.72,
  className = '',
}: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    // キャンバスのサイズをウィンドウに合わせる
    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.offsetWidth;
        canvas.height = parent.offsetHeight;
      }
    };

    // 初期サイズ設定
    resizeCanvas();

    // リサイズイベントリスナー
    window.addEventListener('resize', resizeCanvas);

    // オーロラアニメーションの描画
    const drawAurora = () => {
      if (!ctx || !canvas) return;

      // 時間を進める
      time += 0.003 * speed;

      // キャンバスをクリア
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // グラデーションの色
      const colors = [
        [62, 84, 221],   // 青
        [120, 52, 232],  // 紫
        [220, 92, 199],  // ピンク
        [85, 197, 238],  // 水色
        [45, 226, 230],  // シアン
      ];

      // 各色のグラデーションを描画
      for (let i = 0; i < colors.length; i++) {
        const [r, g, b] = colors[i];
        
        // グラデーションの位置を時間とともに変化させる
        const x = Math.sin(time * 0.5 + i * 0.8) * 0.5 + 0.5;
        const y = Math.cos(time * 0.3 + i * 0.2) * 0.5 + 0.5;
        
        // グラデーションの大きさを時間とともに変化させる
        const size = Math.sin(time * 0.2 + i * 0.5) * 0.3 + 0.7;
        
        // 円形グラデーションを作成
        const gradient = ctx.createRadialGradient(
          canvas.width * x,
          canvas.height * y,
          0,
          canvas.width * x,
          canvas.height * y,
          canvas.width * size
        );
        
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${blend})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        // グラデーションを描画
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      // アニメーションを継続
      animationFrameId = requestAnimationFrame(drawAurora);
    };

    // アニメーション開始
    drawAurora();

    // クリーンアップ
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [speed, blend]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 -z-10 ${className}`}
    />
  );
}

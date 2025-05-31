import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BackgroundProvider } from "@/contexts/BackgroundContext";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import BackgroundControl from "@/components/BackgroundControl";
import { PreviewWrapper } from "@/components/preview";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ビジネススキル百科 | 若手ビジネスパーソンのためのスキルアップ情報サイト",
  description: "若手ビジネスパーソンのためのビジネススキル向上を支援するメディアサイト。記事、動画、音声でビジネススキルを学べます。",
  keywords: "ビジネススキル, ビジネスマナー, コミュニケーション, マネジメント, 業務改善",
  icons: {
    icon: '/favicon-32x32.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja" className={notoSansJP.variable}>
      <head>
        {/* Next.js標準のプレビューバナーを無効化 */}
        <style dangerouslySetInnerHTML={{
          __html: `
            [data-nextjs-preview-indicator] {
              display: none !important;
            }
            .__next-preview-indicator {
              display: none !important;
            }
          `
        }} />
      </head>
      <BackgroundProvider>
        <body className="font-sans antialiased min-h-screen flex flex-col" suppressHydrationWarning={true}>
          <BackgroundWrapper>
            {/* 独自のプレビューラッパーで全体をラップ */}
            <PreviewWrapper>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <BackgroundControl />
            </PreviewWrapper>
          </BackgroundWrapper>
        </body>
      </BackgroundProvider>
    </html>
  );
}

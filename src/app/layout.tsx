import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BackgroundProvider } from "@/contexts/BackgroundContext";
import BackgroundWrapper from "@/components/BackgroundWrapper";
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
              {/* Google Tag Manager */}
        <Script id="gtm" strategy="beforeInteractive">
          {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KKJMQ5TC');`}
        </Script>
        {/* End Google Tag Manager */}
      </head>
      <BackgroundProvider>
        <body className="font-sans antialiased min-h-screen flex flex-col" suppressHydrationWarning={true}>
          {/* Google Tag Manager (noscript) */}
          <noscript>
            <iframe
              src="https://www.googletagmanager.com/ns.html?id=GTM-KKJMQ5TC"
              height="0"
              width="0"
              style={{ display: 'none', visibility: 'hidden' }}
            />
          </noscript>
          {/* End Google Tag Manager (noscript) */}
          <BackgroundWrapper>
            {/* 独自のプレビューラッパーで全体をラップ */}
            <PreviewWrapper>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              {/* BackgroundControl（画面右下の設定UI）を非表示化 */}
              {/* <BackgroundControl /> */}
            </PreviewWrapper>
          </BackgroundWrapper>
        </body>
      </BackgroundProvider>
    </html>
  );
}

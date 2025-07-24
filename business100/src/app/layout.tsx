import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BackgroundProvider } from "@/contexts/BackgroundContext";
import BackgroundWrapper from "@/components/BackgroundWrapper";
import BackgroundControl from "@/components/BackgroundControl";

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
    icon: '/favicon.ico',
    apple: '/favicon.ico',
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
        {/* Google Analytics */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-SW7KLEVEGE"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-SW7KLEVEGE');
          `}
        </Script>
      </head>
      <BackgroundProvider>
        <body className="font-sans antialiased min-h-screen flex flex-col" suppressHydrationWarning={true}>
          <BackgroundWrapper>
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <BackgroundControl />
          </BackgroundWrapper>
        </body>
      </BackgroundProvider>
    </html>
  );
}

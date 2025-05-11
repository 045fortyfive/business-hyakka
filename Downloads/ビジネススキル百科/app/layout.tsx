import type React from "react"
import "@/app/globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import Image from "next/image"
import Link from "next/link"
import { MobileMenu } from "@/components/mobile-menu"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "ビジネススキル百科事典",
  description: "ビジネスに必要なスキルを効率的に学べるオンラインプラットフォーム",
  icons: {
    icon: "/favicon.png",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <header className="border-b py-2">
            <div className="container mx-auto px-4 flex items-center justify-between h-14">
              <Link href="/" className="flex items-center">
                <Image
                  src="/header-logo.png"
                  alt="ビジネススキル百科事典"
                  width={216}
                  height={54}
                  className="w-auto h-10"
                  priority
                />
              </Link>
              <div className="flex items-center">
                <nav className="hidden md:flex space-x-6">
                  <a href="/" className="text-sm font-medium hover:text-primary">
                    ホーム
                  </a>
                  <a href="/categories" className="text-sm font-medium hover:text-primary">
                    カテゴリ
                  </a>
                  <a href="/content" className="text-sm font-medium hover:text-primary">
                    コンテンツ一覧
                  </a>
                </nav>
                <MobileMenu />
              </div>
            </div>
          </header>
          <main>{children}</main>
          <footer className="border-t py-6 mt-10 bg-gray-50">
            <div className="container mx-auto px-4 text-center text-sm text-gray-600">
              &copy; 2023 ビジネススキル百科事典. All rights reserved.
            </div>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="md:hidden">
      <Button variant="ghost" size="icon" aria-label="メニューを開く" className="h-8 w-8 p-0" onClick={toggleMenu}>
        <Menu className="h-5 w-5" />
      </Button>

      {/* オーバーレイメニュー */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50" onClick={toggleMenu}>
          <div className="fixed right-0 top-0 h-full w-64 bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b p-4">
              <span className="font-medium">メニュー</span>
              <Button
                variant="ghost"
                size="icon"
                aria-label="メニューを閉じる"
                className="h-8 w-8 p-0"
                onClick={toggleMenu}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="p-4">
              <ul className="space-y-4">
                <li>
                  <Link href="/" className="block py-2 text-sm font-medium hover:text-primary" onClick={toggleMenu}>
                    ホーム
                  </Link>
                </li>
                <li>
                  <Link
                    href="/categories"
                    className="block py-2 text-sm font-medium hover:text-primary"
                    onClick={toggleMenu}
                  >
                    カテゴリ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/content"
                    className="block py-2 text-sm font-medium hover:text-primary"
                    onClick={toggleMenu}
                  >
                    コンテンツ一覧
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}
    </div>
  )
}

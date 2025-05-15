"use client"

import { useEffect, useState } from "react"

export function EnvDebug() {
  const [envVars, setEnvVars] = useState<Record<string, string>>({})

  useEffect(() => {
    // クライアントサイドで利用可能な環境変数のみを表示
    setEnvVars({
      NEXT_PUBLIC_USE_MOCK_DATA: process.env.NEXT_PUBLIC_USE_MOCK_DATA || "未設定",
      NEXT_PUBLIC_CONTENTFUL_SPACE_ID: process.env.NEXT_PUBLIC_CONTENTFUL_SPACE_ID || "未設定",
    })
  }, [])

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white p-2 rounded-lg text-xs z-50 max-w-xs shadow-lg">
      <h3 className="font-bold mb-1 text-xs">環境変数 (クライアント)</h3>
      <ul className="space-y-1">
        {Object.entries(envVars).map(([key, value]) => (
          <li key={key} className="flex justify-between">
            <strong className="mr-2">{key}:</strong> <span>{value}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

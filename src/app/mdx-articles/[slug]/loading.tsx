export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="animate-pulse">
        {/* パンくずリスト */}
        <div className="flex items-center mb-4">
          <div className="h-4 w-16 bg-gray-200 rounded"></div>
          <div className="mx-2 h-4 w-4 bg-gray-200 rounded"></div>
          <div className="h-4 w-24 bg-gray-200 rounded"></div>
        </div>

        {/* 2カラムレイアウト */}
        <div className="flex flex-col md:flex-row gap-8">
          {/* メインコンテンツ - 左カラム */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-sm p-6">
              {/* タイトル */}
              <div className="h-8 w-3/4 bg-gray-200 rounded mb-6"></div>
              
              {/* 段落 */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
              
              {/* 見出し */}
              <div className="h-6 w-1/2 bg-gray-200 rounded my-6"></div>
              
              {/* 段落 */}
              <div className="space-y-4">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
              </div>
            </div>
          </div>

          {/* サイドバー - 右カラム */}
          <div className="hidden md:block md:w-1/4">
            <div className="bg-white rounded-lg p-5 shadow-sm border border-gray-100">
              <div className="h-6 w-1/2 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-3">
                <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                <div className="h-4 bg-gray-200 rounded w-3/6"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { BookOpen, MessageSquare, Users, TrendingUp, Lightbulb, Briefcase, PenTool, BarChart } from "lucide-react"

type CategoryIconProps = {
  category: string
  size?: number
  className?: string
}

export function CategoryIcon({ category, size = 24, className = "" }: CategoryIconProps) {
  // カテゴリ名に基づいてアイコンを選択
  const getIcon = () => {
    switch (category.toLowerCase()) {
      case "基本ビジネススキル":
        return <Briefcase size={size} className={className} />
      case "コミュニケーション":
        return <MessageSquare size={size} className={className} />
      case "マネジメント":
        return <Users size={size} className={className} />
      case "業務改善":
        return <TrendingUp size={size} className={className} />
      case "プレゼンテーション":
        return <PenTool size={size} className={className} />
      case "データ分析":
        return <BarChart size={size} className={className} />
      case "アイデア発想":
        return <Lightbulb size={size} className={className} />
      default:
        return <BookOpen size={size} className={className} />
    }
  }

  return getIcon()
}

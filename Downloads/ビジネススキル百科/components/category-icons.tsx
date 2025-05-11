import { BookOpen, MessageSquare, Users, TrendingUp, Lightbulb, Briefcase, PenTool, BarChart } from "lucide-react"

type CategoryIconProps = {
  category?: string
  categorySlug?: string
  size?: number
  className?: string
}

export function CategoryIcon({ category, categorySlug, size = 24, className = "" }: CategoryIconProps) {
  // カテゴリ名またはスラッグに基づいてアイコンを選択
  const getIcon = () => {
    // カテゴリスラッグがある場合はそれを使用
    if (categorySlug) {
      switch (categorySlug.toLowerCase()) {
        case "basic":
        case "basic-business-skills":
          return <Briefcase size={size} className={className} />
        case "communication":
          return <MessageSquare size={size} className={className} />
        case "management":
          return <Users size={size} className={className} />
        case "process-improvement":
          return <TrendingUp size={size} className={className} />
        case "presentation":
          return <PenTool size={size} className={className} />
        case "data-analysis":
          return <BarChart size={size} className={className} />
        case "idea-generation":
          return <Lightbulb size={size} className={className} />
        default:
          return <BookOpen size={size} className={className} />
      }
    }

    // カテゴリ名がある場合はそれを使用
    if (category) {
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

    // どちらもない場合はデフォルトアイコン
    return <BookOpen size={size} className={className} />
  }

  return getIcon()
}

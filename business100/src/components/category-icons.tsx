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
          return <Briefcase className={className} />
        case "communication":
          return <MessageSquare className={className} />
        case "management":
          return <Users className={className} />
        case "process-improvement":
        case "business-improvement":
          return <TrendingUp className={className} />
        case "presentation":
          return <PenTool className={className} />
        case "data-analysis":
          return <BarChart className={className} />
        case "idea-generation":
          return <Lightbulb className={className} />
        default:
          return <BookOpen className={className} />
      }
    }

    // カテゴリ名がある場合はそれを使用
    if (category) {
      switch (category.toLowerCase()) {
        case "基本ビジネススキル":
        case "マネジメントスキル":
          return <Briefcase className={className} />
        case "コミュニケーション":
          return <MessageSquare className={className} />
        case "マネジメント":
          return <Users className={className} />
        case "業務改善":
          return <TrendingUp className={className} />
        case "プレゼンテーション":
          return <PenTool className={className} />
        case "データ分析":
          return <BarChart className={className} />
        case "アイデア発想":
        case "思考法":
          return <Lightbulb className={className} />
        default:
          return <BookOpen className={className} />
      }
    }

    // どちらもない場合はデフォルトアイコン
    return <BookOpen className={className} />
  }

  return getIcon()
}

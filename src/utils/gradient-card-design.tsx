// グラデーションカードデザインを生成する関数
export function generateGradientCardDesign(categoryName: string, title: string, contentType?: string) {
  // カテゴリに基づいたグラデーション色を決定
  const getGradientByCategory = (category: string) => {
    const categoryLower = category.toLowerCase();
    
    if (categoryLower.includes('ビジネス') || categoryLower.includes('business')) {
      return {
        gradient: 'from-blue-700 via-blue-800 to-indigo-900',
        textColor: 'text-white',
        shadowColor: 'shadow-blue-700/30'
      };
    }
    
    if (categoryLower.includes('思考') || categoryLower.includes('考え') || categoryLower.includes('think')) {
      return {
        gradient: 'from-purple-500 via-violet-600 to-purple-700',
        textColor: 'text-white',
        shadowColor: 'shadow-purple-500/30'
      };
    }
    
    if (categoryLower.includes('コミュニケーション') || categoryLower.includes('communication')) {
      return {
        gradient: 'from-teal-500 via-cyan-600 to-blue-600',
        textColor: 'text-white',
        shadowColor: 'shadow-teal-500/30'
      };
    }
    
    if (categoryLower.includes('マネジメント') || categoryLower.includes('management')) {
      return {
        gradient: 'from-orange-500 via-red-500 to-pink-600',
        textColor: 'text-white',
        shadowColor: 'shadow-orange-500/30'
      };
    }
    
    if (categoryLower.includes('技術') || categoryLower.includes('tech') || categoryLower.includes('テクノロジー')) {
      return {
        gradient: 'from-green-500 via-emerald-600 to-teal-700',
        textColor: 'text-white',
        shadowColor: 'shadow-green-500/30'
      };
    }
    
    // デフォルト
    return {
      gradient: 'from-gray-500 via-slate-600 to-gray-700',
      textColor: 'text-white',
      shadowColor: 'shadow-gray-500/30'
    };
  };

  const design = getGradientByCategory(categoryName);
  
  return {
    ...design,
    title: title.length > 50 ? title.substring(0, 50) + '...' : title,
    contentType: contentType || 'コンテンツ'
  };
}

// グラデーション背景カードコンポーネント用のプロパティを生成
export function generateGradientCardProps(categoryName: string, title: string, contentType?: string) {
  const design = generateGradientCardDesign(categoryName, title, contentType);
  
  return {
    backgroundGradient: `bg-gradient-to-br ${design.gradient}`,
    textColor: design.textColor,
    shadowClass: design.shadowColor,
    displayTitle: design.title,
    displayContentType: design.contentType
  };
}

// グラデーション背景のプレースホルダーコンポーネント
export interface GradientPlaceholderProps {
  title: string;
  categoryName: string;
  contentType?: string;
  className?: string;
}

export function GradientPlaceholder({ 
  title, 
  categoryName, 
  contentType, 
  className = "" 
}: GradientPlaceholderProps) {
  const props = generateGradientCardProps(categoryName, title, contentType);
  
  return (
    <div className={`${props.backgroundGradient} ${props.shadowClass} ${className} relative overflow-hidden flex items-center justify-center`}>
      {/* 装飾的な背景パターン */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full -translate-x-16 -translate-y-16"></div>
        <div className="absolute bottom-0 right-0 w-24 h-24 bg-white rounded-full translate-x-12 translate-y-12"></div>
        <div className="absolute top-1/2 left-1/2 w-16 h-16 bg-white rounded-full -translate-x-8 -translate-y-8"></div>
      </div>
      
      {/* コンテンツ */}
      <div className="relative z-10 text-center p-2 sm:p-3 md:p-4 flex flex-col justify-center h-full">
        <h3 className={`${props.textColor} font-bold text-xs sm:text-sm md:text-base leading-tight line-clamp-3 mb-1 sm:mb-2`}>
          {props.displayTitle}
        </h3>
        <span className={`${props.textColor} opacity-80 text-[10px] sm:text-xs md:text-sm font-medium`}>
          {props.displayContentType}
        </span>
      </div>
    </div>
  );
}

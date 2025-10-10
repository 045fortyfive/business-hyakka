import { getArticles, getVideos, getAudios, getCategories } from "@/lib/api";
import { SimpleCardCarousel } from "@/components/SimpleCardCarousel";
import { ContentSection } from "@/components/content-section";
import { CategorySection } from "@/components/category-section";
import { CategoryTags } from "@/components/category-tags";
import { CategoryCarousel } from "@/components/category-carousel";
import { CategoryName } from "@/utils/category-colors";
import { generateUnsplashImageUrl } from "@/utils/image-utils";
import Link from "next/link";

// Webhookからの再検証で即座更新、フォールバックとして毎日再検証
export const revalidate = 86400; // 24時間（フォールバック）

// 環境変数の確認（デバッグ用）
console.log('=== 環境変数の確認（トップページ） ===');
console.log('CONTENTFUL_SPACE_ID:', process.env.CONTENTFUL_SPACE_ID);
console.log('CONTENTFUL_ACCESS_TOKEN:', process.env.CONTENTFUL_ACCESS_TOKEN ? '設定済み' : '未設定');
console.log('NEXT_PUBLIC_USE_MOCK_DATA:', process.env.NEXT_PUBLIC_USE_MOCK_DATA);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('==============================');

export default async function Home() {
  try {
    console.log('データ取得開始...');

    // 最新の記事、動画、音声を取得（業務改善カテゴリのコンテンツも含めるため数を増加）
    const articlesPromise = getArticles(25).catch(error => {
      console.error('記事の取得に失敗:', error);
      return { items: [], total: 0, skip: 0, limit: 25, includes: {} };
    });

    const videosPromise = getVideos(10).catch(error => {
      console.error('動画の取得に失敗:', error);
      return { items: [], total: 0, skip: 0, limit: 10, includes: {} };
    });

    const audiosPromise = getAudios(15).catch(error => {
      console.error('音声の取得に失敗:', error);
      return { items: [], total: 0, skip: 0, limit: 15, includes: {} };
    });

    const categoriesPromise = getCategories().catch(error => {
      console.error('カテゴリの取得に失敗:', error);
      return { items: [], total: 0, skip: 0, limit: 100, includes: {} };
    });

    const [articlesData, videosData, audiosData, categoriesData] = await Promise.all([
      articlesPromise,
      videosPromise,
      audiosPromise,
      categoriesPromise
    ]);

    console.log(`取得結果: 記事=${articlesData.items.length}, 動画=${videosData.items.length}, 音声=${audiosData.items.length}, カテゴリ=${categoriesData.items.length}`);

    // 重複除去のヘルパー関数
    const deduplicateContent = (contents: Array<{sys: {id: string}, type: string, fields: any}>) => {
      const contentMap = new Map();
      const typePriority = { 'article': 1, 'video': 2, 'audio': 3 };

      contents.forEach(content => {
        const id = content.sys.id;
        const currentPriority = typePriority[content.type as keyof typeof typePriority] || 999;

        if (!contentMap.has(id)) {
          contentMap.set(id, content);
        } else {
          const existingContent = contentMap.get(id);
          const existingPriority = typePriority[existingContent.type as keyof typeof typePriority] || 999;

          // より高い優先度（数値が小さい）のものを採用
          if (currentPriority < existingPriority) {
            contentMap.set(id, content);
          }
        }
      });

      return Array.from(contentMap.values());
    };

    // ヒーローカルーセル用のスライドを作成
    const heroSlides: Array<{
      id: string;
      title: string;
      description: string;
      imageUrl: string | null;
      linkUrl: string;
      linkText: string;
      category: string;
      useGradientCard?: boolean;
      gradientClass?: string;
      iconSvg?: string;
    }> = [];

    // すべてのコンテンツを統合（重複除去前）
    const allContentWithDuplicates = [
      ...articlesData.items.map(item => ({ ...item, type: 'article' as const })),
      ...videosData.items.map(item => ({ ...item, type: 'video' as const })),
      ...audiosData.items.map(item => ({ ...item, type: 'audio' as const }))
    ];

    // 重複を除去
    const allContent = deduplicateContent(allContentWithDuplicates);

    console.log(`重複除去後: ${allContent.length}件（除去前: ${allContentWithDuplicates.length}件）`);

    // displayOrderで並び替え（displayOrderがない場合は最後に配置）
    allContent.sort((a, b) => {
      const orderA = (a.fields as any)?.displayOrder || 9999;
      const orderB = (b.fields as any)?.displayOrder || 9999;
      return orderA - orderB;
    });

    // 並び替えられたコンテンツをヒーローカルーセルに追加
    allContent.forEach(content => {
      if (content.fields && (content.fields as any).title) {
        const fields = content.fields as any;

        // カテゴリー情報の取得
        const category = fields.category && fields.category.length > 0
          ? fields.category[0]?.fields?.name
          : "ビジネススキル";

        // 画像URLの取得と改善されたフォールバック
        let imageUrl = null;
        let useGradientCard = false;
        let gradientClass = '';
        let iconSvg = '';

        if (fields.featuredImage && fields.featuredImage.fields && fields.featuredImage.fields.file) {
          const fileUrl = fields.featuredImage.fields.file.url;
          // 画像URLの形式に応じて適切に処理
          if (fileUrl.startsWith('//')) {
            imageUrl = `https:${fileUrl}`;
          } else if (fileUrl.startsWith('/')) {
            imageUrl = fileUrl;
          } else if (fileUrl.startsWith('http')) {
            imageUrl = fileUrl;
          } else {
            imageUrl = `https://${fileUrl}`;
          }
        } else {
          // 画像がない場合は、Unsplash画像またはグラデーションカードを使用
          const shouldUseUnsplash = Math.random() > 0.8; // 20%の確率でUnsplash画像を使用（グラデーションカードを80%表示）

          if (shouldUseUnsplash) {
            imageUrl = generateUnsplashImageUrl(category, 800, 450);
          } else {
            useGradientCard = true;

            // カテゴリに応じたグラデーションクラスとアイコンを設定
            switch (category) {
              case '基礎ビジネススキル':
                gradientClass = 'from-blue-500 via-sky-600 to-indigo-700';
                iconSvg = '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
                break;
              case '思考法':
                gradientClass = 'from-violet-500 via-purple-600 to-indigo-700';
                iconSvg = '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';
                break;
              case '業務改善':
                gradientClass = 'from-teal-500 via-cyan-600 to-sky-700';
                iconSvg = '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M9 16.2L4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z"/></svg>';
                break;
              case 'マネジメントスキル':
                gradientClass = 'from-orange-500 via-red-600 to-rose-700';
                iconSvg = '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M16 4c0-1.11.89-2 2-2s2 .89 2 2-.89 2-2 2-2-.89-2-2zm4 18v-6h2.5l-2.54-7.63A1.5 1.5 0 0 0 18.54 7H16c-.8 0-1.54.37-2.01.99L12 10l-1.99-2.01A2.5 2.5 0 0 0 8 7H5.46c-.8 0-1.54.37-2.01.99L1 12h2.5v10h3v-3h11v3h3z"/></svg>';
                break;
              default:
                gradientClass = 'from-blue-500 via-sky-600 to-indigo-700';
                iconSvg = '<svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
            }
          }
        }

        // コンテンツタイプに応じたリンクURLとテキストを設定
        let linkUrl = '';
        let linkText = '';

        switch (content.type) {
          case 'article':
            linkUrl = `/articles/${fields.slug}`;
            linkText = "記事を読む";
            break;
          case 'video':
            linkUrl = `/videos/${fields.slug}`;
            linkText = "動画を見る";
            break;
          case 'audio':
            linkUrl = `/audios/${fields.slug}`;
            linkText = "音声を聴く";
            break;
        }



        heroSlides.push({
          id: content.sys.id,
          title: fields.title,
          description: fields.description || `${category}に関する${content.type === 'article' ? '記事' : content.type === 'video' ? '動画' : '音声'}です。`,
          imageUrl: imageUrl,
          linkUrl: linkUrl,
          linkText: linkText,
          category: category,
          useGradientCard: useGradientCard,
          gradientClass: gradientClass,
          iconSvg: iconSvg
        });
      }
    });

    // カテゴリー別にコンテンツを分類
    const categorizeContent = (items: any[], categoryName: CategoryName) => {
      return items.filter(item => {
        if (item.fields.category && item.fields.category.length > 0) {
          const itemCategory = item.fields.category[0]?.fields?.name;
          return itemCategory === categoryName;
        }
        return false;
      });
    };

    // カテゴリー情報を取得
    const categories = categoriesData.items.map(category => {
      if (category.fields) {
        return {
          id: category.sys.id,
          name: category.fields.name as string,
          slug: category.fields.slug as string,
          description: category.fields.description as string | undefined
        };
      }
      return null;
    }).filter(Boolean) as Array<{
      id: string;
      name: string;
      slug: string;
      description?: string;
    }>;

    // 各カテゴリーのコンテンツを取得（重複除去）
    const categoryContents = categories.map(category => {
      // カテゴリー別のコンテンツを取得（重複除去前）
      const categoryContentWithDuplicates = [
        ...categorizeContent(articlesData.items.map(item => ({ ...item, type: 'article' as const })), category.name),
        ...categorizeContent(videosData.items.map(item => ({ ...item, type: 'video' as const })), category.name),
        ...categorizeContent(audiosData.items.map(item => ({ ...item, type: 'audio' as const })), category.name)
      ];

      // 重複を除去
      const content = deduplicateContent(categoryContentWithDuplicates);

      return {
        ...category,
        content
      };
    });

    // 優先表示するカテゴリ（コンテンツがなくても表示）
    const priorityCategories = ['基礎ビジネススキル', '思考法', '業務改善'];

    // 優先カテゴリを先に表示し、その後コンテンツがある他のカテゴリを表示
    const priorityCategoryContents = categoryContents.filter(item =>
      priorityCategories.includes(item.name)
    );

    const otherCategoryContents = categoryContents.filter(item =>
      !priorityCategories.includes(item.name) && item.content.length > 0
    );

    const finalCategoryContents = [...priorityCategoryContents, ...otherCategoryContents];



    return (
      <div className="container mx-auto px-4 py-4 sm:py-6 md:py-8">
        {/* 注目のコンテンツカルーセル */}
        {heroSlides.length > 0 ? (
          <div className="mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1 sm:mb-2 md:mb-3">注目のコンテンツ</h2>
            <SimpleCardCarousel
              slides={heroSlides.map(slide => ({
                id: slide.id,
                title: slide.title,
                description: slide.description,
                imageUrl: slide.imageUrl,
                linkUrl: slide.linkUrl,
                linkText: slide.linkText,
                category: slide.category,
                useGradientCard: slide.useGradientCard,
                gradientClass: slide.gradientClass,
                iconSvg: slide.iconSvg
              }))}
              autoplayInterval={3000}
            />
          </div>
        ) : (
          <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 md:p-12 mb-12">
            <div className="max-w-3xl">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                ビジネススキルを効率的に学び、キャリアを加速させよう
              </h1>
              <p className="text-lg md:text-xl mb-6">
                若手ビジネスパーソンのためのスキルアップ情報サイト。
                記事、動画、音声で、いつでもどこでもビジネススキルを学べます
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/articles"
                  className="bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-colors"
                >
                  記事を読む
                </Link>
                <Link
                  href="/videos"
                  className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-medium transition-colors"
                >
                  動画を見る
                </Link>
                <Link
                  href="/mdx-articles/ai-skills"
                  className="bg-transparent border-2 border-purple-300 text-white hover:bg-white/10 px-6 py-3 rounded-full font-medium transition-colors"
                >
                  MDX記事を見る
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* カテゴリータグ */}
        <CategoryTags categories={categoriesData.items} />

        {/* カテゴリー別カルーセル - 動的に生成 */}
        {finalCategoryContents.map(category => (
          <CategoryCarousel
            key={category.id}
            title={category.name}
            categoryName={category.name}
            categorySlug={category.slug}
            items={category.content}
          />
        ))}
      </div>
    );
  } catch (error) {
    console.error("Error fetching data:", error);

    // エラーが発生した場合でも最低限のUIを表示
    return (
      <div className="container mx-auto px-4 py-8">
        {/* デフォルトのヒーローセクション */}
        <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl p-8 md:p-12 mb-12">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              ビジネススキルを効率的に学び、キャリアを加速させよう
            </h1>
            <p className="text-lg md:text-xl mb-6">
              若手ビジネスパーソンのためのスキルアップ情報サイト。
              記事、動画、音声でいつでもどこでもビジネススキルを学べます。
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/articles"
                className="bg-white text-blue-700 hover:bg-gray-100 px-6 py-3 rounded-full font-medium transition-colors"
              >
                記事を読む
              </a>
              <a
                href="/videos"
                className="bg-transparent border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-full font-medium transition-colors"
              >
                動画を見る
              </a>
            </div>
          </div>
        </section>

        {/* エラーメッセージ */}
        <div className="bg-red-50 border border-red-200 p-8 rounded-lg text-center mb-8">
          <h2 className="text-xl font-bold text-red-700 mb-2">データの取得中にエラーが発生しました</h2>
          <p className="text-red-600">
            コンテンツの準備中です。しばらくしてからもう一度お試しください
          </p>
        </div>
      </div>
    );
  }
}

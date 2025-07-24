import { getArticles, getVideos, getAudios, getCategories } from "@/lib/api";
import { SimpleCardCarousel } from "@/components/SimpleCardCarousel";
import { ContentSection } from "@/components/content-section";
import { CategorySection } from "@/components/category-section";
import { CategoryTags } from "@/components/category-tags";
import { CategoryCarousel } from "@/components/category-carousel";
import { getImageProps } from "@/lib/utils";
import { CONTENT_TYPES } from "@/lib/types";
import { CategoryName } from "@/utils/category-colors";

// トップページは静的生成
export const revalidate = 3600; // 1時間ごとに再検証

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

    // 最新の記事、動画、音声を取得
    const articlesPromise = getArticles(10).catch(error => {
      console.error('記事の取得に失敗:', error);
      return { items: [], total: 0, skip: 0, limit: 10, includes: {} };
    });

    const videosPromise = getVideos(5).catch(error => {
      console.error('動画の取得に失敗:', error);
      return { items: [], total: 0, skip: 0, limit: 5, includes: {} };
    });

    const audiosPromise = getAudios(5).catch(error => {
      console.error('音声の取得に失敗:', error);
      return { items: [], total: 0, skip: 0, limit: 5, includes: {} };
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

    // ヒーローカルーセル用のスライドを作成
    const heroSlides = [];
    const addedIds = new Set(); // 重複を防ぐためのSet

    // すべての記事をヒーローカルーセルに追加
    articlesData.items.forEach(article => {
      if (article.fields && article.fields.title && !addedIds.has(article.sys.id)) {
        addedIds.add(article.sys.id);

        // カテゴリー情報の取得
        const category = article.fields.category && article.fields.category.length > 0
          ? article.fields.category[0]?.fields?.name
          : "ビジネススキル";

        // 画像URLの取得
        let imageUrl = null;
        if (article.fields.featuredImage && article.fields.featuredImage.fields && article.fields.featuredImage.fields.file) {
          const fileUrl = article.fields.featuredImage.fields.file.url;
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
        }

        console.log(`Hero slide for article "${article.fields.title}":`, {
          id: article.sys.id,
          imageUrl: imageUrl || 'no image',
          category: category,
        });

        heroSlides.push({
          id: article.sys.id,
          title: article.fields.title,
          description: article.fields.description || `${category}に関する記事です。`,
          imageUrl: imageUrl,
          linkUrl: `/articles/${article.fields.slug}`,
          linkText: "記事を読む",
          category: category,
        });
      }
    });

    // 動画コンテンツもヒーローカルーセルに追加
    videosData.items.forEach(video => {
      if (video.fields && video.fields.title && !addedIds.has(video.sys.id)) {
        addedIds.add(video.sys.id);

        // カテゴリー情報の取得
        const category = video.fields.category && video.fields.category.length > 0
          ? video.fields.category[0]?.fields?.name
          : "ビジネススキル";

        // 画像URLの取得
        let imageUrl = null;
        if (video.fields.featuredImage && video.fields.featuredImage.fields && video.fields.featuredImage.fields.file) {
          const fileUrl = video.fields.featuredImage.fields.file.url;
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
          console.log(`Video image URL: ${imageUrl}`);
        }

        heroSlides.push({
          id: video.sys.id,
          title: video.fields.title,
          description: video.fields.description || `${category}に関する動画です。`,
          imageUrl: imageUrl,
          linkUrl: `/videos/${video.fields.slug}`,
          linkText: "動画を見る",
          category: category,
        });
      }
    });

    // 音声コンテンツもヒーローカルーセルに追加
    audiosData.items.forEach(audio => {
      if (audio.fields && audio.fields.title && !addedIds.has(audio.sys.id)) {
        addedIds.add(audio.sys.id);

        // カテゴリー情報の取得
        const category = audio.fields.category && audio.fields.category.length > 0
          ? audio.fields.category[0]?.fields?.name
          : "ビジネススキル";

        // 画像URLの取得
        let imageUrl = null;
        if (audio.fields.featuredImage && audio.fields.featuredImage.fields && audio.fields.featuredImage.fields.file) {
          const fileUrl = audio.fields.featuredImage.fields.file.url;
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
          console.log(`Audio image URL: ${imageUrl}`);
        }

        heroSlides.push({
          id: audio.sys.id,
          title: audio.fields.title,
          description: audio.fields.description || `${category}に関する音声です。`,
          imageUrl: imageUrl,
          linkUrl: `/audios/${audio.fields.slug}`,
          linkText: "音声を聴く",
          category: category,
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

    // 各カテゴリーのコンテンツを取得
    const categoryContents = categories.map(category => {
      const content = categorizeContent([...articlesData.items, ...videosData.items, ...audiosData.items], category.name);
      return {
        ...category,
        content
      };
    }).filter(item => item.content.length > 0);

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
                category: slide.category
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
                記事、動画、音声で、いつでもどこでもビジネススキルを学べます。
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
        )}

        {/* カテゴリータグ */}
        <CategoryTags categories={categoriesData.items} />

        {/* カテゴリー別カルーセル - 動的に生成 */}
        {categoryContents.map(category => (
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
              記事、動画、音声で、いつでもどこでもビジネススキルを学べます。
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
            コンテンツの準備中です。しばらくしてからもう一度お試しください。
          </p>
        </div>
      </div>
    );
  }
}

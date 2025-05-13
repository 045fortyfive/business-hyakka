import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAudioBySlug, getAudios } from "@/lib/api";
import { formatDate, getImageProps } from "@/lib/utils";
import AudioPlayer from "@/components/AudioPlayer";

// 1時間ごとに再検証
export const revalidate = 3600;

// 動的メタデータ
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const audio = await getAudioBySlug(params.slug);

  if (!audio) {
    return {
      title: "音声が見つかりません | ビジネススキル百科",
    };
  }

  return {
    title: `${audio.fields.title} | ビジネススキル百科`,
    description: audio.fields.seoDescription || `${audio.fields.title}に関する音声です。`,
  };
}

// 静的パスの生成
export async function generateStaticParams() {
  const audiosData = await getAudios(100); // 最新100件の音声のスラッグを生成

  return audiosData.items.map((audio) => ({
    slug: audio.fields.slug,
  }));
}

export default async function AudioPage({
  params,
}: {
  params: { slug: string };
}) {
  const audio = await getAudioBySlug(params.slug);

  // 音声が見つからない場合は404ページを表示
  if (!audio) {
    notFound();
  }

  const {
    title,
    publishDate,
    audioUrl,
    description,
    category,
    tags,
    thumbnail,
  } = audio.fields;

  return (
    <div className="container mx-auto px-4 py-8">
      <article>
        {/* 音声ヘッダー */}
        <header className="mb-8">
          {/* カテゴリとパンくずリスト */}
          <div className="flex items-center text-sm text-gray-500 mb-4">
            <Link href="/" className="hover:text-blue-600">
              ホーム
            </Link>
            <span className="mx-2">&gt;</span>
            <Link href="/audios" className="hover:text-blue-600">
              音声一覧
            </Link>
            {category && category.fields && category.fields.slug && (
              <>
                <span className="mx-2">&gt;</span>
                <Link
                  href={`/categories/${category.fields.slug}`}
                  className="hover:text-blue-600"
                >
                  {category.fields.name}
                </Link>
              </>
            )}
          </div>

          {/* タイトル */}
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{title}</h1>

          {/* 公開日 */}
          <div className="mb-6">
            <time dateTime={publishDate} className="text-gray-500">
              {formatDate(publishDate)}
            </time>
          </div>
        </header>

        <div className="flex flex-col md:flex-row gap-8">
          {/* サムネイル画像（あれば） */}
          {thumbnail && (
            <div className="md:w-1/3">
              <Image
                src={`https:${thumbnail.fields.file.url}`}
                alt={thumbnail.fields.title || title}
                width={thumbnail.fields.file.details.image?.width || 400}
                height={thumbnail.fields.file.details.image?.height || 400}
                className="rounded-lg w-full"
              />
            </div>
          )}

          {/* 音声プレーヤーと説明 */}
          <div className={thumbnail ? "md:w-2/3" : "w-full"}>
            {/* 音声プレーヤー */}
            <div className="mb-8">
              <AudioPlayer audioUrl={audioUrl} title={title} />
            </div>

            {/* 音声の説明 */}
            <div className="prose prose-lg max-w-none mb-8">
              <h2 className="text-2xl font-bold mb-4">概要</h2>
              <p className="whitespace-pre-line">{description}</p>
            </div>

            {/* タグ */}
            {tags && tags.length > 0 && (
              <div className="mt-8">
                <h2 className="text-xl font-bold mb-2">関連タグ</h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Link
                      key={tag.sys.id}
                      href={`/tags/${tag.fields.slug}`}
                      className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors"
                    >
                      {tag.fields.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </article>
    </div>
  );
}

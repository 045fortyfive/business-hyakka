import { draftMode } from 'next/headers'
import { redirect } from 'next/navigation'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const slug = searchParams.get('slug')
  const type = searchParams.get('type')

  // プレビューシークレットをチェック
  if (secret !== process.env.CONTENTFUL_PREVIEW_SECRET) {
    return new Response('Invalid token', { status: 401 })
  }

  // スラッグが必要
  if (!slug) {
    return new Response('No slug in URL', { status: 401 })
  }

  // コンテンツタイプが必要
  if (!type) {
    return new Response('No content type specified', { status: 401 })
  }

  // ドラフトモードを有効化
  draftMode().enable()

  // コンテンツタイプに応じたリダイレクト先を設定
  let redirectUrl = '/'
  
  switch (type) {
    case 'article':
      redirectUrl = `/articles/${slug}`
      break
    case 'video':
      redirectUrl = `/videos/${slug}`
      break
    case 'audio':
      redirectUrl = `/audios/${slug}`
      break
    case 'category':
      redirectUrl = `/categories/${slug}`
      break
    case 'tag':
      redirectUrl = `/tags/${slug}`
      break
    default:
      redirectUrl = '/'
  }

  // プレビューページにリダイレクト
  redirect(redirectUrl)
}

// YouTube ID抽出のテスト
function extractYouTubeId(url) {
  if (!url || typeof url !== 'string') {
    console.warn('Invalid URL provided to extractYouTubeId:', url);
    return null;
  }

  // URLをトリムして正規化
  const cleanUrl = url.trim();
  
  // 複数のYouTube URLパターンに対応
  const patterns = [
    // 標準的なwatch URL
    /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // 短縮URL
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    // 埋め込みURL
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    // モバイルURL
    /(?:m\.youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
    // その他のパラメータ付きURL
    /(?:youtube\.com\/.*[?&]v=)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match = cleanUrl.match(pattern);
    if (match && match[1] && match[1].length === 11) {
      console.log('Successfully extracted YouTube ID:', match[1], 'from URL:', cleanUrl);
      return match[1];
    }
  }

  console.warn('Could not extract YouTube ID from URL:', cleanUrl);
  return null;
}

// テスト実行
console.log('Testing YouTube ID extraction:');
const testUrl = 'https://youtu.be/CqHEwcnwJr4';
console.log('URL:', testUrl);
const extractedId = extractYouTubeId(testUrl);
console.log('Extracted ID:', extractedId);

if (extractedId) {
  const embedUrl = `https://www.youtube.com/embed/${extractedId}?rel=0&modestbranding=1&showinfo=0&fs=1&cc_load_policy=0&iv_load_policy=3&autohide=0`;
  console.log('Generated embed URL:', embedUrl);
}

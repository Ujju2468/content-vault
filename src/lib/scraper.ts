// export interface ScrapedMetadata {
//   title: string;
//   description: string;
//   thumbnailUrl: string | null;
//   type: 'link' | 'short_video' | 'doc';
// }

// export async function scrapeMetadata(url: string): Promise<ScrapedMetadata> {
//   try {
//     const isShortVideo = /instagram\.com\/(reel|p)\/|youtube\.com\/shorts\/|tiktok\.com\//i.test(url);
//     const response = await fetch(url, {
//       headers: {
//         'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
//       },
//     });

//     if (!response.ok) throw new Error('Failed to fetch URL');
//     const html = await response.text();

//     const getOgTag = (property: string) => {
//       const match = html.match(new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i')) ||
//                     html.match(new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i'));
//       return match ? match[1] : null;
//     };

//     const title = getOgTag('og:title') || getOgTag('twitter:title') || 'Saved Content';
//     const description = getOgTag('og:description') || getOgTag('twitter:description') || '';
//     const thumbnailUrl = getOgTag('og:image') || getOgTag('twitter:image');

//     return {
//       title,
//       description,
//       thumbnailUrl,
//       type: isShortVideo ? 'short_video' : 'link',
//     };
//   } catch {
//     return {
//       title: url,
//       description: '',
//       thumbnailUrl: null,
//       type: 'link',
//     };
//   }
// }

//v2
export interface ScrapedMetadata {
  title: string;
  description: string;
  thumbnailUrl: string | null;
  type: 'link' | 'short_video' | 'doc';
}

function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&nbsp;/g, ' ');
}

export async function scrapeMetadata(url: string): Promise<ScrapedMetadata> {
  try {
    const isShortVideo = /instagram\.com\/(reel|p)\/|youtube\.com\/shorts\/|tiktok\.com\//i.test(url);
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
    });

    if (!response.ok) throw new Error('Failed to fetch URL');
    const html = await response.text();

    const getOgTag = (property: string) => {
      const match = html.match(new RegExp(`<meta[^>]*property=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i')) ||
                    html.match(new RegExp(`<meta[^>]*name=["']${property}["'][^>]*content=["']([^"']+)["']`, 'i'));
      return match ? match[1] : null;
    };

    const title = getOgTag('og:title') || getOgTag('twitter:title') || 'Saved Content';
    const description = getOgTag('og:description') || getOgTag('twitter:description') || '';
    const thumbnailUrl = getOgTag('og:image') || getOgTag('twitter:image');

    return {
      title: decodeHTMLEntities(title),
      description: decodeHTMLEntities(description),
      thumbnailUrl,
      type: isShortVideo ? 'short_video' : 'link',
    };
  } catch {
    return {
      title: url,
      description: '',
      thumbnailUrl: null,
      type: 'link',
    };
  }
}
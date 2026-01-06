import { baseUrl } from 'app/sitemap'
import { getAggregatedFeedItems } from '../utils'

export async function GET() {
  const allItems = await getAggregatedFeedItems()

  // Generate RSS XML
  const itemsXml = allItems
    .map(
      (item) =>
        `<item>
          <title>${escapeXml(item.title)}</title>
          <link>${escapeXml(item.link)}</link>
          <description>${escapeXml(item.description || '')}</description>
          <pubDate>${new Date(item.pubDate).toUTCString()}</pubDate>
          <source>${escapeXml(item.source)}</source>
        </item>`
    )
    .join('\n')

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
  <rss version="2.0">
    <channel>
        <title>AI News Aggregator</title>
        <link>${baseUrl}/ai-feed/rss</link>
        <description>Aggregated RSS feed from top AI news sources</description>
        <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
        ${itemsXml}
    </channel>
  </rss>`

  return new Response(rssFeed, {
    headers: {
      'Content-Type': 'text/xml; charset=utf-8',
    },
  })
}

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}


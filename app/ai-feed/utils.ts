import Parser from 'rss-parser'

const parser = new Parser()

// RSS feed sources organized by category
export const rssFeeds = [
  // Official AI Labs
  { url: 'https://raw.githubusercontent.com/Olshansk/rss-feeds/main/feeds/feed_anthropic_news.xml', source: 'Anthropic Blog' },
  { url: 'https://openai.com/news/rss.xml', source: 'OpenAI News' },
  { url: 'https://deepmind.google/blog/rss.xml', source: 'Google DeepMind' },
  // Coding & Frameworks
  { url: 'https://huggingface.co/blog/feed.xml', source: 'Hugging Face Blog' },
  { url: 'https://blog.langchain.dev/rss/', source: 'LangChain Blog' },
  // Startups & Trends
  { url: 'https://techcrunch.com/category/artificial-intelligence/feed/', source: 'TechCrunch AI' },
  { url: 'https://venturebeat.com/category/ai/feed/', source: 'VentureBeat AI' },
  { url: 'https://blog.ycombinator.com/rss/', source: 'Y Combinator Blog' },
  // Community/Dev
  { url: 'https://hnrss.org/newest?q=AI+OR+LLM', source: 'Hacker News (AI)' },
  { url: 'https://www.reddit.com/r/ClaudeAI/.rss', source: 'r/ClaudeAI' },
  { url: 'https://www.reddit.com/r/LocalLLM/.rss', source: 'r/LocalLLM' },
]

export interface FeedItem {
  title: string
  link: string
  pubDate: string
  description?: string
  source: string
}

export async function getAggregatedFeedItems(): Promise<FeedItem[]> {
  const allItems: FeedItem[] = []

  // Fetch and parse all RSS feeds
  const feedPromises = rssFeeds.map(async (feed) => {
    try {
      const parsed = await parser.parseURL(feed.url)
      if (parsed.items) {
        return parsed.items.map((item) => ({
          title: item.title || 'Untitled',
          link: item.link || '',
          pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
          description: item.contentSnippet || item.content || item.summary || '',
          source: feed.source,
        }))
      }
      return []
    } catch (error) {
      console.error(`Error fetching feed ${feed.source}:`, error)
      return []
    }
  })

  const results = await Promise.all(feedPromises)
  allItems.push(...results.flat())

  // Sort by publication date (newest first)
  allItems.sort((a, b) => {
    const dateA = new Date(a.pubDate).getTime()
    const dateB = new Date(b.pubDate).getTime()
    return dateB - dateA
  })

  return allItems
}

export function formatDate(date: string): string {
  const targetDate = new Date(date)
  return targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export function formatRelativeDate(date: string): string {
  const currentDate = new Date()
  const targetDate = new Date(date)

  const yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  const monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  const daysAgo = currentDate.getDate() - targetDate.getDate()
  const hoursAgo = Math.floor((currentDate.getTime() - targetDate.getTime()) / (1000 * 60 * 60))

  if (yearsAgo > 0) {
    return `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    return `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    return `${daysAgo}d ago`
  } else if (hoursAgo > 0) {
    return `${hoursAgo}h ago`
  } else {
    return 'Just now'
  }
}


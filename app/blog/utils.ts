import Parser from 'rss-parser'

type Metadata = {
  title: string
  publishedAt: string
  summary: string
  image?: string
}

type BlogPost = {
  metadata: Metadata
  slug: string
  content: string
  link?: string
}

const parser = new Parser()

export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const feed = await parser.parseURL('https://medium.com/feed/@connor.m.bell13')

    return feed.items.map((item) => {
      // Extract a slug from the Medium URL
      const urlParts = item.link?.split('/') || []
      const slug = urlParts[urlParts.length - 1]?.split('?')[0] || item.guid || ''

      return {
        metadata: {
          title: item.title || 'Untitled',
          publishedAt: item.pubDate || new Date().toISOString(),
          summary: item.contentSnippet || item.content?.substring(0, 200) || '',
          image: item.enclosure?.url,
        },
        slug,
        content: item.content || '',
        link: item.link,
      }
    })
  } catch (error) {
    console.error('Error fetching Medium RSS feed:', error)
    return []
  }
}

export function formatDate(date: string, includeRelative = false) {
  let currentDate = new Date()
  if (!date.includes('T')) {
    date = `${date}T00:00:00`
  }
  let targetDate = new Date(date)

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear()
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth()
  let daysAgo = currentDate.getDate() - targetDate.getDate()

  let formattedDate = ''

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`
  } else {
    formattedDate = 'Today'
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  if (!includeRelative) {
    return fullDate
  }

  return `${fullDate} (${formattedDate})`
}

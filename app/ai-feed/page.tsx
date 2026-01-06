import { getAggregatedFeedItems } from './utils'
import { FilteredFeed } from './filter'

export const metadata = {
  title: 'AI Feed',
  description: 'Aggregated feed from top AI news sources',
}

export default async function AIFeedPage() {
  const items = await getAggregatedFeedItems()

  return (
    <section>
      <h1 className="font-semibold text-2xl mb-8 tracking-tighter">AI Feed</h1>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8 text-sm">
        Aggregated articles from top AI news sources, sorted by date
      </p>
      <FilteredFeed items={items} />
      {items.length === 0 && (
        <p className="text-neutral-600 dark:text-neutral-400">
          No articles found. Please try again later.
        </p>
      )}
    </section>
  )
}


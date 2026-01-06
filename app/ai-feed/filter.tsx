'use client'

import { useState, useMemo } from 'react'
import { FeedItem, rssFeeds } from './utils'
import { formatDate, formatRelativeDate } from './utils'

interface FilterProps {
  items: FeedItem[]
}

const categories = [
  { name: 'All', sources: [] },
  {
    name: 'Official AI Labs',
    sources: ['Anthropic Blog', 'OpenAI News', 'Google DeepMind'],
  },
  {
    name: 'Coding & Frameworks',
    sources: ['Hugging Face Blog', 'LangChain Blog', 'Vercel Blog'],
  },
  {
    name: 'Startups & Trends',
    sources: ['TechCrunch AI', 'VentureBeat AI', 'Y Combinator Blog'],
  },
  {
    name: 'Community/Dev',
    sources: ['Hacker News (AI)', 'r/ClaudeAI', 'r/LocalLLM'],
  },
]

const allSources = rssFeeds.map((feed) => feed.source)

export function FilteredFeed({ items }: FilterProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All')
  const [selectedSources, setSelectedSources] = useState<Set<string>>(new Set())

  // Get unique sources from items
  const availableSources = useMemo(() => {
    const sources = new Set(items.map((item) => item.source))
    return Array.from(sources).sort()
  }, [items])

  // Filter items based on selected category and sources
  const filteredItems = useMemo(() => {
    let filtered = items

    // Apply category filter
    if (selectedCategory !== 'All') {
      const category = categories.find((cat) => cat.name === selectedCategory)
      if (category && category.sources.length > 0) {
        filtered = filtered.filter((item) => category.sources.includes(item.source))
      }
    }

    // Apply source filter (if any sources are selected)
    if (selectedSources.size > 0) {
      filtered = filtered.filter((item) => selectedSources.has(item.source))
    }

    return filtered
  }, [items, selectedCategory, selectedSources])

  const toggleSource = (source: string) => {
    setSelectedSources((prev) => {
      const next = new Set(prev)
      if (next.has(source)) {
        next.delete(source)
      } else {
        next.add(source)
      }
      return next
    })
    // Reset category when manually selecting sources
    if (selectedCategory !== 'All') {
      setSelectedCategory('All')
    }
  }

  const clearFilters = () => {
    setSelectedCategory('All')
    setSelectedSources(new Set())
  }

  const hasActiveFilters = selectedCategory !== 'All' || selectedSources.size > 0

  return (
    <div>
      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {categories.map((category) => (
            <button
              key={category.name}
              onClick={() => {
                setSelectedCategory(category.name)
                setSelectedSources(new Set())
              }}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                selectedCategory === category.name
                  ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black border-neutral-900 dark:border-neutral-100'
                  : 'bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 hover:border-neutral-300 dark:hover:border-neutral-700'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Source Filter */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Filter by Source:
            </label>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-xs text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300 underline"
              >
                Clear filters
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {availableSources.map((source) => (
              <button
                key={source}
                onClick={() => toggleSource(source)}
                className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                  selectedSources.has(source)
                    ? 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-black border-neutral-900 dark:border-neutral-100'
                    : 'bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 text-neutral-600 dark:text-neutral-400 hover:border-neutral-300 dark:hover:border-neutral-700'
                }`}
              >
                {source}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
          Showing {filteredItems.length} of {items.length} articles
        </div>
      </div>

      {/* Filtered Items */}
      <div className="space-y-4">
        {filteredItems.length > 0 ? (
          filteredItems.map((item, index) => (
            <a
              key={`${item.link}-${index}`}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
            >
              <div className="flex flex-col space-y-2 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700 hover:shadow-sm transition-all">
                <div className="flex flex-col gap-2">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-base md:text-lg font-medium text-neutral-900 dark:text-neutral-100 tracking-tight group-hover:text-neutral-600 dark:group-hover:text-neutral-400 transition-colors">
                      {item.title}
                    </h2>
                    {item.description && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2 line-clamp-3">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-500 pt-1 border-t border-neutral-100 dark:border-neutral-800">
                  <span className="font-medium text-neutral-700 dark:text-neutral-300 px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800">
                    {item.source}
                  </span>
                  <time
                    dateTime={item.pubDate}
                    title={formatDate(item.pubDate)}
                    className="tabular-nums"
                  >
                    {formatRelativeDate(item.pubDate)}
                  </time>
                </div>
              </div>
            </a>
          ))
        ) : (
          <p className="text-neutral-600 dark:text-neutral-400 text-center py-8">
            No articles match your filters. Try adjusting your selection.
          </p>
        )}
      </div>
    </div>
  )
}


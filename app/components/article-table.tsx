export function ArticleTable({
  articles
}: {
  articles: Array<{
    title: string;
    source: string;
    pubDate: string;
    link: string;
  }>
}) {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
        <thead className="bg-neutral-50 dark:bg-neutral-900">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Source
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Date
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-black divide-y divide-neutral-200 dark:divide-neutral-800">
          {articles.map((article, idx) => (
            <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
              <td className="px-4 py-3 text-sm">
                <a
                  href={article.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 underline"
                >
                  {article.title}
                </a>
              </td>
              <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                {article.source}
              </td>
              <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                {article.pubDate}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function BlogPostTable({
  posts
}: {
  posts: Array<{
    title: string;
    publishedAt: string;
    slug: string;
    summary: string;
  }>
}) {
  return (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-800">
        <thead className="bg-neutral-50 dark:bg-neutral-900">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Title
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Date
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
              Summary
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-black divide-y divide-neutral-200 dark:divide-neutral-800">
          {posts.map((post, idx) => (
            <tr key={idx} className="hover:bg-neutral-50 dark:hover:bg-neutral-900">
              <td className="px-4 py-3 text-sm">
                <a
                  href={`/blog/${post.slug}`}
                  className="text-neutral-900 dark:text-neutral-100 hover:text-neutral-600 dark:hover:text-neutral-400 underline"
                >
                  {post.title}
                </a>
              </td>
              <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400 whitespace-nowrap">
                {post.publishedAt}
              </td>
              <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                {post.summary}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

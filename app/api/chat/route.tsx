import { ToolLoopAgent, tool, createAgentUIStreamResponse, stepCountIs } from 'ai';
import { OpenRouter } from '@openrouter/ai-sdk-provider';
import { z } from 'zod';

import { getAggregatedFeedItems } from '@/app/ai-feed/utils';
import { getBlogPosts, formatDate } from '@/app/blog/utils';

const openRouter = new OpenRouter({
  apiKey: process.env.OPENROUTER_API_KEY,
});

const blogAgent = new ToolLoopAgent({
  model: openRouter.chat('anthropic/claude-3.5-sonnet:beta'),
  instructions: `You are a helpful assistant that helps users discover articles from their blog and AI news feed.

When a user asks about articles:
1. Use the appropriate search or retrieval tool - the tool will automatically display the results in a formatted table
2. Keep your text response brief - just 1-2 sentences introducing what you found
3. The tool results will be displayed as interactive tables automatically

Examples:
- "Here are recent AI articles from Anthropic:" (then tool shows table)
- "I found these blog posts about React:" (then tool shows table)
- "Here are the latest articles:" (then tool shows table)

Keep it simple - the tools handle the presentation.`,
  stopWhen: stepCountIs(10),
  tools: {
      getBlogPostTitles: tool({
        description: 'Get a list of all blog post titles and publication dates from the personal blog',
        inputSchema: z.object({}),
        execute: async () => {
          const posts = getBlogPosts();
          return posts
            .sort((a, b) => {
              if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
                return -1;
              }
              return 1;
            })
            .map((post) => ({
              title: post.metadata.title,
              publishedAt: formatDate(post.metadata.publishedAt),
              slug: post.slug,
              summary: post.metadata.summary,
            }));
        },
      }),
      getBlogPostDetails: tool({
        description: 'Get detailed information about a specific blog post including its full content',
        inputSchema: z.object({
          slug: z.string().describe('The slug of the blog post to retrieve'),
        }),
        execute: async ({ slug }) => {
          const posts = getBlogPosts();
          const post = posts.find((p) => p.slug === slug);

          if (!post) {
            return { error: 'Post not found' };
          }

          return {
            title: post.metadata.title,
            publishedAt: formatDate(post.metadata.publishedAt),
            summary: post.metadata.summary,
            content: post.content,
            slug: post.slug,
          };
        },
      }),
      getAIFeedTitles: tool({
        description: 'Get recent articles from the AI news feed (includes sources like Anthropic, OpenAI, DeepMind, TechCrunch, etc.)',
        inputSchema: z.object({
          limit: z.number().optional().describe('Maximum number of articles to return (default: 20)'),
        }),
        execute: async ({ limit = 20 }) => {
          const items = await getAggregatedFeedItems();
          return items.slice(0, limit).map((item) => ({
            title: item.title,
            source: item.source,
            pubDate: new Date(item.pubDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
            link: item.link,
          }));
        },
      }),
      getAIArticleDetails: tool({
        description: 'Get detailed information about a specific AI news article by its link',
        inputSchema: z.object({
          link: z.string().describe('The URL/link of the article to retrieve'),
        }),
        execute: async ({ link }) => {
          const items = await getAggregatedFeedItems();
          const article = items.find((item) => item.link === link);

          if (!article) {
            return { error: 'Article not found' };
          }

          return {
            title: article.title,
            source: article.source,
            pubDate: new Date(article.pubDate).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            }),
            description: article.description,
            link: article.link,
          };
        },
      }),
      searchBlogPosts: tool({
        description: 'Search blog posts by keyword in title or summary',
        inputSchema: z.object({
          query: z.string().describe('The search term to look for'),
        }),
        execute: async ({ query }) => {
          const posts = getBlogPosts();
          const searchTerm = query.toLowerCase();

          return posts
            .filter((post) => {
              const titleMatch = post.metadata.title.toLowerCase().includes(searchTerm);
              const summaryMatch = post.metadata.summary.toLowerCase().includes(searchTerm);
              return titleMatch || summaryMatch;
            })
            .sort((a, b) => {
              if (new Date(a.metadata.publishedAt) > new Date(b.metadata.publishedAt)) {
                return -1;
              }
              return 1;
            })
            .map((post) => ({
              title: post.metadata.title,
              publishedAt: formatDate(post.metadata.publishedAt),
              slug: post.slug,
              summary: post.metadata.summary,
            }));
        },
      }),
      searchAIFeed: tool({
        description: 'Search AI news feed articles by keyword in title or description',
        inputSchema: z.object({
          query: z.string().describe('The search term to look for'),
          limit: z.number().optional().describe('Maximum number of results to return (default: 10)'),
        }),
        execute: async ({ query, limit = 10 }) => {
          const items = await getAggregatedFeedItems();
          const searchTerm = query.toLowerCase();

          return items
            .filter((item) => {
              const titleMatch = item.title.toLowerCase().includes(searchTerm);
              const descMatch = item.description?.toLowerCase().includes(searchTerm);
              return titleMatch || descMatch;
            })
            .slice(0, limit)
            .map((item) => ({
              title: item.title,
              source: item.source,
              pubDate: new Date(item.pubDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              }),
              link: item.link,
            }));
        },
      }),
  },
});

export async function POST(req: Request) {
  const { messages } = await req.json();

  return createAgentUIStreamResponse({
    agent: blogAgent,
    uiMessages: messages,
  });
}

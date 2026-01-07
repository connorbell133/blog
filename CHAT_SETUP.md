# AI Chat Setup Guide

This project includes an AI-powered chat assistant that helps users discover and explore articles from your blog and AI news feed.

The chat uses the AI SDK's **ToolLoopAgent** for multi-step tool execution. The agent automatically continues calling tools and generating responses until it provides a complete answer. All tool invocations are displayed in real-time, so you can see when the AI is fetching blog posts, searching articles, or gathering information to answer your questions.

## Features

The chat assistant can:
- Get lists of blog posts with titles and summaries
- Retrieve detailed information about specific blog posts
- Browse recent AI news articles from multiple sources
- Get article details from the AI feed
- Search both blog posts and AI feed by keywords
- Provide personalized article recommendations

## Setup Instructions

### 1. Get an OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up or log in
3. Navigate to your API Keys section
4. Create a new API key
5. Copy the key

### 2. Configure Environment Variable

Add your OpenRouter API key to `.env.local`:

```bash
OPENROUTER_API_KEY=your_actual_api_key_here
```

### 3. Start the Development Server

```bash
pnpm dev
```

The chat window will appear as a floating button in the bottom-right corner of your site.

## Available Tools

The AI assistant has access to these tools:

### Blog Tools
- `getBlogPostTitles` - Get all blog post titles and metadata
- `getBlogPostDetails` - Get full content of a specific post by slug
- `searchBlogPosts` - Search blog posts by keyword

### AI Feed Tools
- `getAIFeedTitles` - Get recent articles from AI news sources
- `getAIArticleDetails` - Get details about a specific article
- `searchAIFeed` - Search AI feed articles by keyword

## Example Queries

Try asking the assistant:
- "What are some articles you think I'd find interesting today?"
- "Tell me about recent AI news from Anthropic"
- "Search for posts about React or Next.js"
- "Show me the latest articles from the AI feed"
- "Tell me more about [specific article title]"

## Customization

### Change the AI Model

Edit `app/api/chat/route.ts` and modify the model:

```typescript
model: openRouter.chat('anthropic/claude-3.5-sonnet:beta')
```

Available models on OpenRouter include:
- `anthropic/claude-3.5-sonnet:beta`
- `openai/gpt-4-turbo`
- `google/gemini-pro`
- And many more - see [OpenRouter docs](https://openrouter.ai/docs)

### Customize the System Prompt

Edit the `system` parameter in `app/api/chat/route.ts` to change how the assistant behaves.

### Modify the UI

The chat UI component is located at `app/components/chat.tsx`. You can customize:
- Colors and styling
- Button position
- Window size
- Message display format

## Troubleshooting

### Chat doesn't respond
- Check that `OPENROUTER_API_KEY` is set in `.env.local`
- Restart the dev server after adding environment variables
- Check browser console for errors

### Tool calls not working
- Verify that RSS feeds are loading correctly
- Check API route logs in terminal for errors

### Styling issues
- Make sure Tailwind CSS classes are properly configured
- Check that `global.css` includes the animation delays

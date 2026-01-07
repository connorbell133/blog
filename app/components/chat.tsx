'use client';

import { useChat } from '@ai-sdk/react';
import { useState, useEffect, useRef } from 'react';
import { ArticleTable, BlogPostTable } from './article-table';

export function ChatWindow() {
  const [input, setInput] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { messages, sendMessage, status } = useChat();
  const isLoading = status === 'submitted';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded-full p-4 shadow-lg hover:scale-110 transition-transform z-50"
          aria-label="Open chat"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z"
            />
          </svg>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed inset-0 md:bottom-6 md:right-6 md:top-auto md:left-auto md:w-96 md:h-[600px] w-full h-full bg-white dark:bg-neutral-900 border-0 md:border border-neutral-200 dark:border-neutral-800 md:rounded-lg shadow-2xl flex flex-col z-50">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-200 dark:border-neutral-800">
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              Chat Assistant
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              aria-label="Close chat"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-neutral-500 dark:text-neutral-400 text-sm text-center py-8">
                <p className="mb-2">Hi! I can help you discover articles.</p>
                <p className="text-xs">
                  Try asking:
                  <br />
                  "What articles do you think I'd find interesting today?"
                  <br />
                  "Tell me about recent AI news"
                  <br />
                  "Search for posts about React"
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100'
                  }`}
                >
                  {message.parts.map((part, i) => {
                    switch (part.type) {
                      case 'text':
                        return (
                          <div
                            key={`${message.id}-${i}`}
                            className="whitespace-pre-wrap text-sm"
                          >
                            {part.text}
                          </div>
                        );
                      case 'tool-getBlogPostTitles': {
                        const posts = part.output as any;
                        return (
                          <div key={`${message.id}-${i}`} className="my-2">
                            {Array.isArray(posts) && <BlogPostTable posts={posts} />}
                          </div>
                        );
                      }
                      case 'tool-getBlogPostDetails': {
                        const output = part.output as any;
                        return (
                          <div key={`${message.id}-${i}`} className="mt-2 text-xs">
                            <div className="font-semibold opacity-70 mb-1">
                              📖 Loading post details...
                            </div>
                            {output && typeof output === 'object' && output !== null && 'title' in output && (
                              <div className="bg-neutral-200 dark:bg-neutral-700 rounded p-2">
                                <div className="font-semibold">{String(output.title)}</div>
                              </div>
                            )}
                          </div>
                        );
                      }
                      case 'tool-getAIFeedTitles': {
                        const articles = part.output as any;
                        return (
                          <div key={`${message.id}-${i}`} className="my-2">
                            {Array.isArray(articles) && <ArticleTable articles={articles} />}
                          </div>
                        );
                      }
                      case 'tool-getAIArticleDetails': {
                        const output = part.output as any;
                        return (
                          <div key={`${message.id}-${i}`} className="mt-2 text-xs">
                            <div className="font-semibold opacity-70 mb-1">
                              📰 Loading article details...
                            </div>
                            {output && typeof output === 'object' && output !== null && 'title' in output && (
                              <div className="bg-neutral-200 dark:bg-neutral-700 rounded p-2">
                                <div className="font-semibold">{String(output.title)}</div>
                              </div>
                            )}
                          </div>
                        );
                      }
                      case 'tool-searchBlogPosts': {
                        const posts = part.output as any;
                        return (
                          <div key={`${message.id}-${i}`} className="my-2">
                            {Array.isArray(posts) && <BlogPostTable posts={posts} />}
                          </div>
                        );
                      }
                      case 'tool-searchAIFeed': {
                        const articles = part.output as any;
                        return (
                          <div key={`${message.id}-${i}`} className="my-2">
                            {Array.isArray(articles) && <ArticleTable articles={articles} />}
                          </div>
                        );
                      }
                      default:
                        return null;
                    }
                  })}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-neutral-100 dark:bg-neutral-800 rounded-lg px-4 py-2">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce" />
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-100" />
                    <div className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (input.trim()) {
                sendMessage({ text: input });
                setInput('');
              }
            }}
            className="p-4 border-t border-neutral-200 dark:border-neutral-800"
          >
            <div className="flex space-x-2">
              <input
                className="flex-1 bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 dark:focus:ring-neutral-100"
                value={input}
                placeholder="Ask about articles..."
                onChange={(e) => setInput(e.currentTarget.value)}
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-neutral-900 dark:bg-neutral-100 text-neutral-100 dark:text-neutral-900 rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Send
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}

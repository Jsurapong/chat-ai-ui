import { SendHorizonal, Bot, User } from "lucide-react";
import { Message, useChat } from "@ai-sdk/react";
import { createIdGenerator } from "ai";
import DotLoading from "./DotLoading";
import DsMarkdown, { type MarkdownRef } from "ds-markdown";
import { useMemo, useRef } from "react";

import { ConfigProvider } from "ds-markdown";
import defaultLocale from "ds-markdown/i18n/en";

// type ChatAreaProps = {};

function throttle(fn: (...args: any[]) => void, delay: number) {
  let lastTime = 0;

  return (...args: unknown[]) => {
    const now = Date.now();
    if (now - lastTime > delay) {
      fn(...args);
      lastTime = now;
    }
  };
}

export default function ChatArea({
  id,
  initialMessages,
}: { id?: string | undefined; initialMessages?: Message[] } = {}) {
  const { messages, input, handleInputChange, handleSubmit, status } = useChat({
    id,
    initialMessages,
    generateId: createIdGenerator({
      prefix: "msgc",
      size: 16,
    }),
    experimental_prepareRequestBody({ messages, id }) {
      return { message: messages[messages.length - 1], id };
    },
  });

  const markdownRef = useRef<MarkdownRef>(null);
  const messageDivRef = useRef<HTMLDivElement>(null!);

  const isThinking = status === "streaming" || status === "submitted";

  const scrollCacheRef = useRef<{
    type: "manual" | "auto";
    needAutoScroll: boolean;
    prevScrollTop: number;
  }>({
    type: "manual",
    needAutoScroll: true,
    prevScrollTop: 0,
  });

  const throttleOnTypedChar = useMemo(() => {
    return throttle((char) => {
      if (!scrollCacheRef.current.needAutoScroll) return;
      const messageDiv = messageDivRef.current;

      // 自动滑动到最底部
      if (messageDiv) {
        console.log({ messageDiv, a: messageDiv.scrollHeight });
        messageDiv.scrollTo({
          top: messageDiv.scrollHeight,

          behavior: "smooth",
        });
      }
    }, 50);
  }, []);

  const onScroll = useMemo(() => {
    return throttle((e: React.UIEvent<HTMLDivElement>) => {
      // 如果是往上滚动，则说明是手动滚动，则需要停止自动向下滚动
      console.log(
        "onScroll",
        e.currentTarget.scrollTop - scrollCacheRef.current.prevScrollTop
      );
      if (e.currentTarget.scrollTop < scrollCacheRef.current.prevScrollTop) {
        scrollCacheRef.current.needAutoScroll = false;
      }
      scrollCacheRef.current.prevScrollTop = e.currentTarget.scrollTop;
    }, 50);
  }, []);

  return (
    <main className="flex flex-col w-full h-screen p-4">
      {/* Message List */}
      <div
        className="flex-1 overflow-y-auto mb-4"
        ref={messageDivRef}
        onScroll={onScroll}
      >
        {/* Render messages */}

        <div className="max-w-4xl mx-auto">
          {messages.map((m) => {
            return (
              <div
                key={m.id}
                className="flex gap-4 my-6 text-gray-800 dark:text-gray-100"
              >
                <div>{m.role === "user" ? <User /> : <Bot />}</div>
                <div className="ds-message-box">
                  <div className="ds-message-list">
                    <ConfigProvider locale={defaultLocale}>
                      <DsMarkdown
                        ref={markdownRef}
                        interval={1}
                        answerType="answer"
                        onTypedChar={throttleOnTypedChar}
                      >
                        {m.content}
                      </DsMarkdown>
                    </ConfigProvider>
                  </div>
                </div>
              </div>
            );
          })}

          {isThinking && (
            <div className="flex gap-4 my-6 text-gray-800 dark:text-gray-100">
              <Bot />
              <DotLoading />
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <div className="w-full max-w-4xl mx-auto flex-shrink-0">
        <form onSubmit={handleSubmit} className="relative">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Message Gemini..."
            className="w-full p-4 pr-16 text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <button
            type="submit"
            disabled={isThinking || !input}
            className="absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
          >
            <SendHorizonal min={5} size={20} />
          </button>
        </form>
        <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
          Gemini may display inaccurate info, including about people, so
          double-check its responses.
        </p>
      </div>
    </main>
  );
}

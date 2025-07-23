import { SendHorizonal, Bot, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Message, useChat } from "@ai-sdk/react";
import { createIdGenerator } from "ai";

// type ChatAreaProps = {};

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

  const isLoading = status === "streaming";

  return (
    <main className="flex flex-col w-full h-screen p-4">
      {/* Message List */}
      <div className="flex-1 overflow-y-auto mb-4">
        <div className="max-w-4xl mx-auto">
          {messages.map((m) => (
            <div
              key={m.id}
              className="flex gap-4 my-6 text-gray-800 dark:text-gray-100"
            >
              {m.role === "user" ? <User /> : <Bot />}
              <div className="prose dark:prose-invert">
                <ReactMarkdown>{m.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-4 my-6 text-gray-800 dark:text-gray-100">
              <Bot />
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
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
            disabled={isLoading || !input}
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

"use client";

import { useChat } from "@ai-sdk/react";

export default function Page() {
  const { messages, input, handleSubmit, handleInputChange, status } =
    useChat();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 font-[Amiko]">
      <div className="w-full max-w-xl flex flex-col flex-1 bg-white/80 rounded-2xl shadow-xl p-4 mt-8 mb-24 border border-gray-200">
        <div className="flex flex-col gap-3 overflow-y-auto max-h-[60vh] px-1">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-2xl max-w-[80%] whitespace-pre-line text-base shadow-sm
                  ${
                    message.role === "user"
                      ? "bg-indigo-500 text-white rounded-br-md"
                      : "bg-gray-100 text-gray-900 rounded-bl-md border border-gray-200"
                  }
                `}
              >
                {message.parts.map((part, index) => {
                  switch (part.type) {
                    case "text":
                      return <span key={index}>{part.text}</span>;
                    // other cases can handle images, tool calls, etc
                  }
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 left-0 w-full flex justify-center bg-gradient-to-t from-white/90 via-white/80 to-transparent py-4 px-2"
      >
        <div className="w-full max-w-xl flex gap-2">
          <input
            value={input}
            placeholder="Send a message..."
            onChange={handleInputChange}
            disabled={status !== "ready"}
            className="flex-1 px-4 py-3 rounded-full border border-gray-300 bg-white shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 text-base font-[Amiko]"
            autoFocus
          />
          <button
            type="submit"
            disabled={status !== "ready" || !input.trim()}
            className="px-6 py-3 rounded-full bg-indigo-500 text-white font-semibold shadow hover:bg-indigo-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
}

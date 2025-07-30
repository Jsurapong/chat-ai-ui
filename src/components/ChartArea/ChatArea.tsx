import { Bot } from "lucide-react";
import DotLoading from "../DotLoading";
import MessageItem from "./MessageItem";
import ChatInput from "./ChatInput";
import useChatArea from "./useChatArea";
import { Message } from "ai";

interface ChatAreaProps {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  status: "ready" | "streaming" | "submitted" | "error";
  handleStop: () => void; // Function to handle stopping the message generation
}

export default function ChatArea(props: ChatAreaProps) {
  const { messageDivRef, throttleOnTypedChar } = useChatArea();
  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    handleStop,
    status,
  } = props;

  const isLoading = status === "streaming" || status === "submitted";

  return (
    <main className="flex flex-col w-full h-screen p-4">
      {/* Message List */}
      <div className="flex-1 overflow-y-auto mb-4" ref={messageDivRef}>
        <div className="max-w-4xl mx-auto px-4">
          {messages.map((message) => (
            <div key={message.id} style={{ display: false ? "none" : "block" }}>
              <MessageItem
                disableTyping={!isLoading}
                key={message.id}
                message={message}
                onTypedChar={throttleOnTypedChar}
              />
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4 my-6 text-gray-800 dark:text-gray-100">
              <Bot />
              <DotLoading />
            </div>
          )}
        </div>
      </div>

      {/* Input Form */}
      <ChatInput
        input={input}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSubmit={handleSubmit}
        onStop={handleStop}
      />
    </main>
  );
}
interface LoadingMessageProps {
  message?: string;
  showSkeleton?: boolean;
}

function LoadingMessage({
  message = "AI is thinking...",
  showSkeleton = true,
}: LoadingMessageProps) {
  return (
    <div className="flex gap-4 my-6 text-gray-800 dark:text-gray-100">
      <div className="flex-shrink-0">
        <Bot className="w-6 h-6" />
      </div>
      <div className="flex-1">
        <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4">
          {/* Loading indicator with message */}
          <div className="flex items-center space-x-2 mb-3">
            <DotLoading />
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {message}
            </span>
          </div>

          {/* Skeleton content */}
          {showSkeleton && (
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 animate-pulse"></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

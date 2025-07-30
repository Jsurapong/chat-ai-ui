import { SendHorizonal } from "lucide-react";

interface ChatInputProps {
  input: string;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function ChatInput({
  input,
  isLoading,
  onInputChange,
  onSubmit,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };
  return (
    <div className="w-full max-w-4xl mx-auto flex-shrink-0">
      <form onSubmit={onSubmit} className="relative">
        <textarea
          value={input}
          onChange={onInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Message Gemini..."
          className="w-full p-4 pr-16 text-gray-800 dark:text-gray-100 bg-gray-50 dark:bg-gray-700 rounded-2xl shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
        <button
          type="submit"
          disabled={isLoading || !input}
          className="absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-full bg-blue-600 text-white disabled:bg-gray-400 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
        >
          <SendHorizonal size={20} />
        </button>
      </form>
      <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-2">
        Gemini may display inaccurate info, including about people, so
        double-check its responses.
      </p>
    </div>
  );
}

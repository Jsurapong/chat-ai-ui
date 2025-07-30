import { Bot, User } from "lucide-react";
import { Message } from "@ai-sdk/react";
import DsMarkdown, { type MarkdownRef } from "ds-markdown";
import { useRef, memo, useCallback } from "react";
import React from "react";

interface MessageItemProps {
  message: Message;

  disableTyping: boolean;
  onTypedChar: (data: unknown) => void;
}

const MessageItem = memo(function MessageItem({
  message,
  onTypedChar,
  disableTyping,
}: MessageItemProps) {
  const markdownRef = useRef<MarkdownRef>(null);

  const handleTypedChar = useCallback(
    (data: unknown) => {
      onTypedChar(data);
    },
    [onTypedChar]
  );

  return (
    <div className="flex gap-4 my-6 text-gray-800 dark:text-gray-100">
      <div>{message.role === "user" ? <User /> : <Bot />}</div>

      <DsMarkdown
        ref={markdownRef}
        interval={0}
        answerType="answer"
        onTypedChar={handleTypedChar}
        disableTyping={disableTyping}
      >
        {message.content}
      </DsMarkdown>
    </div>
  );
});

export default MessageItem;

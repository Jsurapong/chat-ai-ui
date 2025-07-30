import { useChat } from "@ai-sdk/react";
import { createIdGenerator } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Message } from "@ai-sdk/react";

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

interface UseChatLogicProps {
  id?: string;
  initialMessages?: Message[];
}

export function useChatLogic({ id, initialMessages }: UseChatLogicProps) {
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

  const [isDisableTyping, setIsDisableTyping] = useState(true);

  useEffect(() => {
    if (initialMessages && initialMessages.length > 0) {
      setTimeout(() => {
        setIsDisableTyping(false);
        console.log("Initial messages loaded.");
      }, 2000); // Simulate loading delay
    }
  }, [initialMessages]);

  const messageDivRef = useRef<HTMLDivElement>(null!);
  const isLoading = status === "streaming" || status === "submitted";

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

      if (messageDiv) {
        messageDiv.scrollTo({
          top: messageDiv.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 10);
  }, []);

  const onScroll = useMemo(() => {
    return throttle((e: React.UIEvent<HTMLDivElement>) => {
      if (e.currentTarget.scrollTop < scrollCacheRef.current.prevScrollTop) {
        scrollCacheRef.current.needAutoScroll = false;
      }
      scrollCacheRef.current.prevScrollTop = e.currentTarget.scrollTop;
    }, 10);
  }, []);

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    messageDivRef,
    onScroll,
    throttleOnTypedChar,
    isDisableTyping,
  };
}

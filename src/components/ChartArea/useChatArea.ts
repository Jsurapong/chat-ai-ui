import { useChat } from "@ai-sdk/react";
import { createIdGenerator } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import { Message } from "@ai-sdk/react";
import useInitialMessages from "@/hooks/useInitialMessages";

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

function useChatArea() {
  const messageDivRef = useRef<HTMLDivElement>(null!);

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
    messageDivRef,
    onScroll,
    throttleOnTypedChar,
  };
}

export default useChatArea;

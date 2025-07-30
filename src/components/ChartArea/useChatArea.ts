import { useMemo, useRef } from "react";
import { throttle } from "lodash";

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
    return throttle(() => {
      if (!scrollCacheRef.current.needAutoScroll) return;
      const messageDiv = messageDivRef.current;

      if (messageDiv) {
        messageDiv.scrollTo({
          top: messageDiv.scrollHeight,
          behavior: "smooth",
        });
      }
    }, 50);
  }, []);

  // const onScroll = useMemo(() => {
  //   return throttle((e: React.UIEvent<HTMLDivElement>) => {

  //     // if (e.currentTarget?.scrollTop < scrollCacheRef.current.prevScrollTop) {
  //     //   scrollCacheRef.current.needAutoScroll = false;
  //     // }
  //     scrollCacheRef.current.prevScrollTop = e.currentTarget?.scrollTop;
  //   }, 50);
  // }, []);

  return {
    messageDivRef,

    throttleOnTypedChar,
  };
}

export default useChatArea;

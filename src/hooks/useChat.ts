import { useChat } from "@ai-sdk/react";
import useInitialMessages from "./useInitialMessages";
import { createIdGenerator } from "ai";
import useRecentChat from "./useRecentChat";
import { useEffect } from "react";
import { stat } from "fs";

const useChatCustom = ({ id }: { id?: string }) => {
  const { initialMessages } = useInitialMessages({ id });
  const { recentMessages, refreshRecentMessages } = useRecentChat();

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

  useEffect(() => {
    if (status === "ready") {
      refreshRecentMessages();
    }
  }, [status]);

  const handleSubmitWrapper = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    handleSubmit(e);
  };

  return {
    messages,
    recentMessages,
    input,
    handleInputChange,
    handleSubmit: handleSubmitWrapper,
    status,
  };
};

export default useChatCustom;

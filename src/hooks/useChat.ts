import { useChat } from "@ai-sdk/react";
import useInitialMessages from "./useInitialMessages";
import { createIdGenerator } from "ai";

const useChatCustom = ({ id }: { id?: string }) => {
  const { initialMessages } = useInitialMessages({ id });

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

  return {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    status,
  };
};

export default useChatCustom;

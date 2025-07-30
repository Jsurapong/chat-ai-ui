import axios from "axios";
import { Message } from "@ai-sdk/react";
import { useCallback, useEffect, useState } from "react";

const useInitialMessages = ({ id }: { id?: string }) => {
  const [initialMessages, setInitialMessages] = useState<Message[]>();
  const [loading, setLoading] = useState(true);

  const loadChatHistory = useCallback(async () => {
    if (!id) return;
    try {
      setLoading(true);

      const response = await axios.get(`/api/chat/${id}`, {
        params: { id },
      });

      setInitialMessages(response.data as Message[]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChatHistory();
  }, []);

  return { initialMessages, loading };
};

export default useInitialMessages;

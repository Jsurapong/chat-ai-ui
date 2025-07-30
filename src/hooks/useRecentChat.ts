import axios from "axios";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";

type HistoryItem = { id: string; title: string };

const useRecentChat = () => {
  const [recentMessages, setRecentMessages] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChatHistory = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/history");

      setRecentMessages(response.data as HistoryItem[]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedLoadChatHistory = useMemo(
    () => debounce(loadChatHistory, 2000), // 300ms delay
    [loadChatHistory]
  );

  useEffect(() => {
    loadChatHistory();
  }, []);

  return {
    recentMessages,
    loading,
    refreshRecentMessages: debouncedLoadChatHistory,
  };
};

export default useRecentChat;

import axios from "axios";
import { useCallback, useEffect, useState } from "react";

type HistoryItem = { id: string; title: string };

const useRecentChat = () => {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadChatHistory = useCallback(async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/history");

      setHistory(response.data as HistoryItem[]);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChatHistory();
  }, []);

  return { history, loading };
};

export default useRecentChat;

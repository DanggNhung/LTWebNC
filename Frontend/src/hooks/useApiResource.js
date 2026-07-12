import { useCallback, useEffect, useRef, useState } from "react";
import { getJson } from "../services/apiClient.js";

export default function useApiResource(path, fallbackData) {
  const fallbackDataRef = useRef(fallbackData);
  const [data, setData] = useState(fallbackData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    setLoading(true);

    try {
      const nextData = await getJson(path);
      setData(nextData ?? fallbackDataRef.current);
      setError(null);
    } catch (nextError) {
      setData(fallbackDataRef.current);
      setError(nextError);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { data, error, loading, refresh };
}

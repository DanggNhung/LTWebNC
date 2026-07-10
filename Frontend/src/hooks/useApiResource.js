import { useEffect, useState } from "react";
import { getJson } from "../services/apiClient.js";

export default function useApiResource(path, fallbackData) {
  const [data, setData] = useState(fallbackData);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isCurrent = true;

    setLoading(true);
    getJson(path)
      .then((nextData) => {
        if (isCurrent) {
          setData(Array.isArray(nextData) ? nextData : fallbackData);
          setError(null);
        }
      })
      .catch((nextError) => {
        if (isCurrent) {
          setData(fallbackData);
          setError(nextError);
        }
      })
      .finally(() => {
        if (isCurrent) {
          setLoading(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [fallbackData, path]);

  return { data, error, loading };
}

import { useCallback, useEffect, useRef, useState } from "react";
import { getJson, requestJson } from "../services/apiClient.js";

export default function useApiRows(path, fallbackRows = []) {
  const fallbackRowsRef = useRef(fallbackRows);
  const [rows, setRows] = useState(fallbackRows);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    if (!path) {
      setRows(fallbackRowsRef.current);
      setError(null);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const nextRows = await getJson(path);
      setRows(Array.isArray(nextRows) ? nextRows : fallbackRowsRef.current);
      setError(null);
    } catch (nextError) {
      setRows(fallbackRowsRef.current);
      setError(nextError);
    } finally {
      setLoading(false);
    }
  }, [path]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  async function createRow(payload) {
    if (!path) return;
    await requestJson(path, { method: "POST", body: payload });
    await refresh();
  }

  async function updateRow(id, payload) {
    if (!path) return;
    await requestJson(`${path}/${id}`, { method: "PUT", body: payload });
    await refresh();
  }

  async function deleteRow(id) {
    if (!path) return;
    await requestJson(`${path}/${id}`, { method: "DELETE" });
    await refresh();
  }

  return {
    createRow,
    deleteRow,
    error,
    loading,
    refresh,
    rows,
    setRows,
    updateRow
  };
}

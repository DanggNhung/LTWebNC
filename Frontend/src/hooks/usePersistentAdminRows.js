import { useEffect, useState } from "react";

function readStoredRows(storageKey) {
  try {
    const storedValue = localStorage.getItem(storageKey);
    return storedValue ? JSON.parse(storedValue) : null;
  } catch {
    return null;
  }
}

function writeStoredRows(storageKey, rows) {
  localStorage.setItem(storageKey, JSON.stringify(rows));
}

export default function usePersistentAdminRows(storageKey, sourceRows) {
  const [rows, setRows] = useState(() => readStoredRows(storageKey) ?? sourceRows);

  useEffect(() => {
    if (readStoredRows(storageKey)) return;
    setRows(sourceRows);
  }, [sourceRows, storageKey]);

  function saveRows(nextRows) {
    setRows(nextRows);
    writeStoredRows(storageKey, nextRows);
  }

  return { rows, saveRows };
}

export const EMPTY_DATE_TEXT = "Chưa cập nhật";
export const EMPTY_GENDER_TEXT = "Chưa cập nhật";
export const EMPTY_CLASS_TEXT = "Chưa phân lớp";

export function splitFullName(fullName = "") {
  const parts = fullName.trim().split(/\s+/);
  return {
    lastName: parts.slice(0, -1).join(" "),
    firstName: parts.at(-1) ?? ""
  };
}

export function toInputDate(value) {
  if (!value || !value.includes("/")) return "";
  const [day, month, year] = value.split("/");
  return `${year}-${month}-${day}`;
}

export function toDisplayDate(value) {
  if (!value || !value.includes("-")) return EMPTY_DATE_TEXT;
  const [year, month, day] = value.split("-");
  return `${day}/${month}/${year}`;
}

export function getDatabaseId(row, entityName = "dữ liệu") {
  const databaseId = row.databaseId ?? (Number.isInteger(Number(row.id)) ? row.id : null);

  if (!databaseId) {
    throw new Error(`${entityName} chưa có databaseId. Hãy tải dữ liệu từ MySQL trước khi chỉnh sửa.`);
  }

  return databaseId;
}

export function rowsChanged(firstRow, secondRow, toPayload) {
  return JSON.stringify(toPayload(firstRow)) !== JSON.stringify(toPayload(secondRow));
}

export async function saveDraftChanges({
  rows,
  draftRows,
  getKey,
  toPayload,
  deleteRow,
  updateRow,
  getId = getDatabaseId
}) {
  const draftByKey = new Map(draftRows.map((row) => [getKey(row), row]));
  const rowsByKey = new Map(rows.map((row) => [getKey(row), row]));
  const deletedRows = rows.filter((row) => !draftByKey.has(getKey(row)));
  const updatedRows = draftRows.filter((row) => {
    const originalRow = rowsByKey.get(getKey(row));
    return originalRow && rowsChanged(row, originalRow, toPayload);
  });

  for (const row of deletedRows) {
    await deleteRow(getId(row));
  }

  for (const row of updatedRows) {
    await updateRow(getId(row), toPayload(row));
  }
}

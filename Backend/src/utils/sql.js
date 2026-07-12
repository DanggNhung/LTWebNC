function compactPayload(payload) {
  return Object.fromEntries(
    Object.entries(payload).filter(([, value]) => value !== undefined)
  );
}

function buildInsert(tableName, payload) {
  const compactedPayload = compactPayload(payload);
  const columns = Object.keys(compactedPayload);

  if (!columns.length) {
    throw new Error(`Không có dữ liệu để thêm vào bảng ${tableName}`);
  }

  return {
    sql: `INSERT INTO ${tableName} (${columns.map((column) => `\`${column}\``).join(", ")}) VALUES (${columns.map(() => "?").join(", ")})`,
    values: columns.map((column) => compactedPayload[column])
  };
}

function buildUpdate(tableName, payload, id) {
  const compactedPayload = compactPayload(payload);
  const columns = Object.keys(compactedPayload);

  if (!columns.length) {
    throw new Error(`Không có dữ liệu để cập nhật bảng ${tableName}`);
  }

  return {
    sql: `UPDATE ${tableName} SET ${columns.map((column) => `\`${column}\` = ?`).join(", ")} WHERE id = ?`,
    values: [...columns.map((column) => compactedPayload[column]), id]
  };
}

module.exports = {
  buildInsert,
  buildUpdate
};

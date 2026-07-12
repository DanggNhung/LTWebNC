/**
 * Component hiển thị skeleton rows khi đang tải dữ liệu bảng.
 * @param {number} cols - Số cột trong bảng
 * @param {number} rows - Số hàng skeleton cần hiển thị
 */
export function LoadingRows({ cols = 4, rows = 6 }) {
  return Array.from({ length: rows }, (_, rowIndex) => (
    <tr key={rowIndex} className="skeleton-row">
      {Array.from({ length: cols }, (_, colIndex) => (
        <td key={colIndex}>
          <span className="skeleton-cell" style={{ width: colIndex === 0 ? "60%" : "40%" }} />
        </td>
      ))}
    </tr>
  ));
}

/**
 * Component hiển thị thông báo lỗi trong bảng.
 */
export function ErrorRow({ cols = 4, message = "Không thể tải dữ liệu" }) {
  return (
    <tr>
      <td colSpan={cols} className="table-error-row">
        <span className="material-symbols-outlined">error</span>
        {message}
      </td>
    </tr>
  );
}

/**
 * Component hiển thị khi bảng không có dữ liệu.
 */
export function EmptyRow({ cols = 4, message = "Không có dữ liệu" }) {
  return (
    <tr>
      <td colSpan={cols} className="table-empty-row">
        <span className="material-symbols-outlined">inbox</span>
        {message}
      </td>
    </tr>
  );
}

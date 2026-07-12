import { useState } from "react";

/**
 * Hook đóng gói logic chỉnh sửa bảng dùng chung cho các trang Admin:
 * - isTableEditing: trạng thái đang chỉnh sửa
 * - draftRows: bản nháp các hàng đang chỉnh sửa
 * - modalConfig: cấu hình modal (mode, rowKey, initialValues)
 * - toastMessage: thông báo tạm thời
 *
 * @param {Array} rows - Dữ liệu gốc từ API (để reset khi cancel)
 */
export default function useTableEditor(rows) {
  const [isTableEditing, setIsTableEditing] = useState(false);
  const [draftRows, setDraftRows] = useState([]);
  const [modalConfig, setModalConfig] = useState(null);
  const [toastMessage, setToastMessage] = useState("");

  function showMessage(message = "Thành công") {
    setToastMessage(message);
    window.setTimeout(() => setToastMessage(""), 1800);
  }

  function startEditing(initialRows) {
    setDraftRows(initialRows ?? rows);
    setIsTableEditing(true);
  }

  function cancelEditing(initialRows) {
    setDraftRows(initialRows ?? rows);
    setIsTableEditing(false);
  }

  function stopEditing() {
    setIsTableEditing(false);
  }

  function openAddModal(initialValues = {}) {
    setModalConfig({ mode: "add", initialValues });
  }

  function openEditModal(rowKey, initialValues = {}) {
    setModalConfig({ mode: "edit", rowKey, initialValues });
  }

  function closeModal() {
    setModalConfig(null);
  }

  return {
    cancelEditing,
    closeModal,
    draftRows,
    isTableEditing,
    modalConfig,
    openAddModal,
    openEditModal,
    setDraftRows,
    showMessage,
    startEditing,
    stopEditing,
    toastMessage
  };
}

import ClassDirectory from "../components/classes/ClassDirectory.jsx";
import Button from "../components/common/Button.jsx";
import AdminPageHeader from "../components/layout/AdminPageHeader.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import AdminTopbar from "../components/layout/AdminTopbar.jsx";
import { classes as fallbackClasses } from "../data/classesData.js";
import useApiResource from "../hooks/useApiResource.js";

export default function ClassesManagement() {
  const { data: classes } = useApiResource("/classes", fallbackClasses);

  return (
    <div className="admin-shell">
      <AdminSidebar activeLabel="Lớp học" />
      <main className="admin-main">
        <AdminTopbar title="Lớp học" />
        <div className="management-content">
          <AdminPageHeader
            title="Lớp học"
            description="Quản lý mã lớp, tên lớp, ngành, khoa, giảng viên hướng dẫn và sĩ số."
            action={<Button icon="add">Thêm lớp học</Button>}
          />
          <ClassDirectory classes={classes} />
        </div>
      </main>
    </div>
  );
}

import Button from "../components/common/Button.jsx";
import AdminPageHeader from "../components/layout/AdminPageHeader.jsx";
import AdminSidebar from "../components/layout/AdminSidebar.jsx";
import AdminTopbar from "../components/layout/AdminTopbar.jsx";
import SubjectInventoryTable from "../components/subjects/SubjectInventoryTable.jsx";
import { subjects as fallbackSubjects } from "../data/subjectsData.js";
import useApiResource from "../hooks/useApiResource.js";

export default function SubjectsManagement() {
  const { data: subjects } = useApiResource("/subjects", fallbackSubjects);

  return (
    <div className="admin-shell">
      <AdminSidebar activeLabel="Môn học" />
      <main className="admin-main">
        <AdminTopbar title="Môn học" />
        <div className="management-content">
          <AdminPageHeader
            title="Môn học"
            description="Quản lý mã môn, số tín chỉ, khoa, ngành và khối kiến thức của từng môn học."
            action={<Button icon="add">Thêm môn học</Button>}
          />
          <SubjectInventoryTable subjects={subjects} />
        </div>
      </main>
    </div>
  );
}

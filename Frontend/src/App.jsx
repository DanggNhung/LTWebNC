import { useEffect, useState } from "react";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import FacultyDashboard from "./pages/FacultyDashboard.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import StudentResults from "./pages/StudentResults.jsx";
import AccountsManagement from "./pages/AccountsManagement.jsx";
import ClassesManagement from "./pages/ClassesManagement.jsx";
import SubjectsManagement from "./pages/SubjectsManagement.jsx";

const routes = {
  login: LoginPage,
  admin: AdminDashboard,
  accounts: AccountsManagement,
  classes: ClassesManagement,
  subjects: SubjectsManagement,
  "student-results": StudentResults,
  faculty: FacultyDashboard
};

function getCurrentRoute() {
  const route = window.location.hash.replace("#", "");
  return routes[route] ? route : "login";
}

export default function App() {
  const [route, setRoute] = useState(getCurrentRoute);
  const Page = routes[route];

  useEffect(() => {
    const onHashChange = () => setRoute(getCurrentRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return (
    <>
      <Page />
      <nav className="sample-switcher" aria-label="Trang mẫu">
        <a className={route === "login" ? "active" : ""} href="#login">Đăng nhập</a>
        <a className={route === "admin" ? "active" : ""} href="#admin">Quản trị</a>
        <a className={route === "accounts" ? "active" : ""} href="#accounts">Tài khoản</a>
        <a className={route === "classes" ? "active" : ""} href="#classes">Lớp học</a>
        <a className={route === "subjects" ? "active" : ""} href="#subjects">Môn học</a>
        <a className={route === "student-results" ? "active" : ""} href="#student-results">Sinh viên</a>
        <a className={route === "faculty" ? "active" : ""} href="#faculty">Giảng viên</a>
      </nav>
    </>
  );
}

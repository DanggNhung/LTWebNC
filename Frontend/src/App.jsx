import { useEffect, useState } from "react";
import AccountsManagement from "./pages/AccountsManagement.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ClassesManagement from "./pages/ClassesManagement.jsx";
import FacultyDashboard from "./pages/FacultyDashboard.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import StudentResults from "./pages/StudentResults.jsx";
import SubjectsManagement from "./pages/SubjectsManagement.jsx";

const routes = {
  admin: AdminDashboard,
  "admin/tai-khoan": AccountsManagement,
  "admin/lop-hoc": ClassesManagement,
  "admin/mon-hoc": SubjectsManagement,
  "ket-qua": StudentResults,
  diem: FacultyDashboard
};

function getCurrentRoute() {
  const route = window.location.hash.replace("#", "");
  return routes[route] ? route : "home";
}

export default function App() {
  const [route, setRoute] = useState(getCurrentRoute);
  const Page = routes[route] || LoginPage;

  useEffect(() => {
    const onHashChange = () => setRoute(getCurrentRoute());
    const onPopState = () => setRoute(getCurrentRoute());
    window.addEventListener("hashchange", onHashChange);
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("hashchange", onHashChange);
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return <Page />;
}

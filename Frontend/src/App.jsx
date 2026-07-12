import { useEffect, useState } from "react";
import AccountsManagement from "./pages/AccountsManagement.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ClassesManagement from "./pages/ClassesManagement.jsx";
import FacultyDashboard from "./pages/FacultyDashboard.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";
import StudentResults from "./pages/StudentResults.jsx";
import SubjectsManagement from "./pages/SubjectsManagement.jsx";

const routes = {
  admin: AdminDashboard,
  "admin/tai-khoan": AccountsManagement,
  "admin/lop-hoc": ClassesManagement,
  "admin/mon-hoc": SubjectsManagement,
  "sinh-vien": StudentResults,
  "sinh-vien/ho-so": StudentProfile,
  "giang-vien": FacultyDashboard
};

function getCurrentRoute() {
  const route = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return routes[route] ? route : "home";
}

export default function App() {
  const [route, setRoute] = useState(getCurrentRoute);
  const Page = routes[route] || LoginPage;

  useEffect(() => {
    const onPopState = () => setRoute(getCurrentRoute());
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  return <Page />;
}

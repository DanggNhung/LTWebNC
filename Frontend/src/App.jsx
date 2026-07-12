import { useEffect, useState } from "react";
import AccountsManagement from "./pages/AccountsManagement.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import ClassesManagement from "./pages/ClassesManagement.jsx";
import FacultyDashboard from "./pages/FacultyDashboard.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import StudentProfile from "./pages/StudentProfile.jsx";
import StudentResults from "./pages/StudentResults.jsx";
import SubjectsManagement from "./pages/SubjectsManagement.jsx";
import { getJson } from "./services/apiClient.js";

const routes = {
  admin: AdminDashboard,
  "admin/tai-khoan": AccountsManagement,
  "admin/lop-hoc": ClassesManagement,
  "admin/mon-hoc": SubjectsManagement,
  "sinh-vien": StudentResults,
  "sinh-vien/ho-so": StudentProfile,
  "giang-vien": FacultyDashboard
};

const adminRoutes = new Set(["admin", "admin/tai-khoan", "admin/lop-hoc", "admin/mon-hoc"]);

function getRequiredRole(route) {
  if (adminRoutes.has(route)) return "Quản trị viên";
  if (route === "giang-vien") return "Giảng viên";
  if (route === "sinh-vien" || route === "sinh-vien/ho-so") return "Sinh viên";
  return null;
}

function getCurrentRoute() {
  const route = window.location.pathname.replace(/^\/+|\/+$/g, "");
  return routes[route] ? route : "home";
}

export default function App() {
  const [route, setRoute] = useState(getCurrentRoute);
  const [isCheckingAccess, setIsCheckingAccess] = useState(() => Boolean(getRequiredRole(getCurrentRoute())));
  const Page = routes[route] || LoginPage;

  useEffect(() => {
    const onPopState = () => setRoute(getCurrentRoute());
    window.addEventListener("popstate", onPopState);
    return () => {
      window.removeEventListener("popstate", onPopState);
    };
  }, []);

  useEffect(() => {
    let isCurrent = true;

    const requiredRole = getRequiredRole(route);

    if (!requiredRole) {
      setIsCheckingAccess(false);
      return () => {
        isCurrent = false;
      };
    }

    setIsCheckingAccess(true);
    getJson("/auth/me")
      .then((user) => {
        if (!isCurrent) return;

        if (user?.role !== requiredRole) {
          window.location.replace("/");
          return;
        }

        setIsCheckingAccess(false);
      })
      .catch(() => {
        if (isCurrent) {
          window.location.replace("/");
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [route]);

  if (getRequiredRole(route) && isCheckingAccess) {
    return null;
  }

  return <Page />;
}

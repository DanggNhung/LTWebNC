import { useState } from "react";
import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";
import { accounts as fallbackAccounts } from "../../data/accountsData.js";

const SYSTEM_ADMIN_ACCOUNT = {
  name: "Quản trị hệ thống",
  id: "Admin",
  email: "",
  password: "admin123",
  role: "Quản trị viên",
  status: "Hoạt động",
  lastLogin: "Vừa xong",
  avatar: "indigo"
};

function readAccounts() {
  try {
    const storedValue = localStorage.getItem("admin-accounts");
    const storedAccounts = storedValue ? JSON.parse(storedValue) : fallbackAccounts;
    return [SYSTEM_ADMIN_ACCOUNT, ...storedAccounts.filter((account) => account.id !== SYSTEM_ADMIN_ACCOUNT.id)];
  } catch {
    return [SYSTEM_ADMIN_ACCOUNT, ...fallbackAccounts.filter((account) => account.id !== SYSTEM_ADMIN_ACCOUNT.id)];
  }
}

function getSelectedRole(role) {
  return role === "faculty" ? "Giảng viên" : "Sinh viên";
}

export default function LoginForm() {
  const [role, setRole] = useState("student");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(event) {
    event.preventDefault();
    const accounts = readAccounts();
    const account = accounts.find((item) => item.id.toLowerCase() === loginId.trim().toLowerCase());

    if (!account || account.password !== password) {
      setError("Mã đăng nhập hoặc mật khẩu không đúng.");
      return;
    }

    if (account.id === SYSTEM_ADMIN_ACCOUNT.id) {
      window.location.href = "/admin";
      return;
    }

    if (account.status === "Tạm khóa") {
      setError("Tài khoản đang tạm khóa.");
      return;
    }

    if (account.role !== getSelectedRole(role)) {
      setError("Vai trò đăng nhập không khớp với tài khoản.");
      return;
    }

    window.location.href = role === "faculty" ? "/giang-vien" : "/sinh-vien";
  }

  return (
    <section className="login-card">
      <div className="role-tabs">
        <button className={role === "student" ? "active" : ""} onClick={() => setRole("student")}>
          Sinh viên
        </button>
        <button className={role === "faculty" ? "active" : ""} onClick={() => setRole("faculty")}>
          Giảng viên
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <label className="field-control">
          <span>Mã đăng nhập</span>
          <Icon name="person" />
          <input
            placeholder={role === "student" ? "Nhập mã sinh viên" : "Nhập mã giảng viên"}
            value={loginId}
            onChange={(event) => setLoginId(event.target.value)}
            required
          />
        </label>
        <label className="field-control">
          <span>Mật khẩu</span>
          <Icon name="lock" />
          <input
            type={isPasswordVisible ? "text" : "password"}
            placeholder="Nhập mật khẩu"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button
            type="button"
            aria-label={isPasswordVisible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            onClick={() => setIsPasswordVisible((value) => !value)}
          >
            <Icon name={isPasswordVisible ? "visibility_off" : "visibility"} />
          </button>
        </label>
        {error && <p className="login-error">{error}</p>}
        <Button className="full-width" icon="arrow_forward" type="submit">
          Đăng nhập
        </Button>
      </form>
    </section>
  );
}

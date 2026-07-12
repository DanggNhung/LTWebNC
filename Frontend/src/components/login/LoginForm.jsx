import { useState } from "react";
import { requestJson } from "../../services/apiClient.js";
import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";

function getSelectedRole(role) {
  return role === "faculty" ? "Giảng viên" : "Sinh viên";
}

export default function LoginForm() {
  const [role, setRole] = useState("student");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const user = await requestJson("/auth/login", {
        method: "POST",
        body: {
          username: loginId.trim(),
          password
        }
      });

      if (user.role === "Quản trị viên") {
        window.location.href = "/admin";
        return;
      }

      if (user.role !== getSelectedRole(role)) {
        await requestJson("/auth/logout", { method: "POST" }).catch(() => null);
        setError("Vai trò đăng nhập không khớp với tài khoản.");
        return;
      }

      window.location.href = role === "faculty" ? "/giang-vien" : "/sinh-vien";
    } catch (nextError) {
      setError(nextError.message || "Mã đăng nhập hoặc mật khẩu không đúng.");
    } finally {
      setSubmitting(false);
    }
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
          {submitting ? "Đang đăng nhập" : "Đăng nhập"}
        </Button>
      </form>
    </section>
  );
}

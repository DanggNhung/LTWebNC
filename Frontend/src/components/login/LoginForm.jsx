import { useState } from "react";
import { requestJson, resetDemoSessionId } from "../../services/apiClient.js";
import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";

const REMEMBERED_LOGIN_KEY = "student-management-remembered-logins";

function getSelectedRole(role) {
  return role === "faculty" ? "Giảng viên" : "Sinh viên";
}

function getRememberedLogins() {
  try {
    return JSON.parse(window.localStorage.getItem(REMEMBERED_LOGIN_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveRememberedLogin(loginId, password) {
  const rememberedLogins = getRememberedLogins();
  rememberedLogins[loginId] = password;
  window.localStorage.setItem(REMEMBERED_LOGIN_KEY, JSON.stringify(rememberedLogins));
}

function removeRememberedLogin(loginId) {
  const rememberedLogins = getRememberedLogins();
  delete rememberedLogins[loginId];
  window.localStorage.setItem(REMEMBERED_LOGIN_KEY, JSON.stringify(rememberedLogins));
}

export default function LoginForm() {
  const [role, setRole] = useState("student");
  const [loginId, setLoginId] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [rememberLogin, setRememberLogin] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function handleLoginIdChange(event) {
    const nextLoginId = event.target.value;
    const trimmedLoginId = nextLoginId.trim();
    const rememberedPassword = getRememberedLogins()[trimmedLoginId];

    setLoginId(nextLoginId);
    if (rememberedPassword !== undefined) {
      setPassword(rememberedPassword);
      setRememberLogin(true);
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    resetDemoSessionId();

    try {
      const trimmedLoginId = loginId.trim();
      const user = await requestJson("/auth/login", {
        method: "POST",
        body: {
          username: trimmedLoginId,
          password
        }
      });

      if (rememberLogin) {
        saveRememberedLogin(trimmedLoginId, password);
      } else {
        removeRememberedLogin(trimmedLoginId);
      }

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
            onChange={handleLoginIdChange}
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
        <label className="remember-login">
          <input
            type="checkbox"
            checked={rememberLogin}
            onChange={(event) => setRememberLogin(event.target.checked)}
          />
          <span>Ghi nhớ đăng nhập</span>
        </label>
        {error && <p className="login-error">{error}</p>}
        <Button className="full-width" icon="arrow_forward" type="submit">
          {submitting ? "Đang đăng nhập" : "Đăng nhập"}
        </Button>
      </form>
    </section>
  );
}

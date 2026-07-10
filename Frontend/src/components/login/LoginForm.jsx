import { useState } from "react";
import Button from "../common/Button.jsx";
import Icon from "../common/Icon.jsx";

export default function LoginForm() {
  const [role, setRole] = useState("student");

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
      <form>
        <label className="field-control">
          <span>Mã đăng nhập</span>
          <Icon name="person" />
          <input placeholder={role === "student" ? "Nhập mã sinh viên" : "Nhập mã giảng viên"} />
        </label>
        <label className="field-control">
          <span>Mật khẩu</span>
          <Icon name="lock" />
          <input type="password" placeholder="Nhập mật khẩu" />
          <button type="button" aria-label="Hiện mật khẩu">
            <Icon name="visibility" />
          </button>
        </label>
        <div className="login-options">
          <label><input type="checkbox" /> Ghi nhớ đăng nhập</label>
          <a href="#">Quên mật khẩu?</a>
        </div>
        <Button className="full-width" icon="arrow_forward" onClick={(event) => event.preventDefault()}>
          Đăng nhập
        </Button>
      </form>
    </section>
  );
}

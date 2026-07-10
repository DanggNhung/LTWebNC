import Icon from "../components/common/Icon.jsx";
import LoginForm from "../components/login/LoginForm.jsx";

export default function LoginPage() {
  return (
    <main className="login-page">
      <section className="login-wrap">
        <div className="login-brand">
          <div className="brand-mark">
            <Icon name="local_library" filled />
          </div>
          <h1>Thư viện Lumina</h1>
          <p>Chào mừng đến với EduTrack Pro</p>
        </div>
        <LoginForm />
        <div className="login-art">
          <Icon name="school" />
          <Icon name="menu_book" />
        </div>
      </section>
    </main>
  );
}

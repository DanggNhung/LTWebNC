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
          <h1>Student management</h1>
        </div>
        <LoginForm />
      </section>
    </main>
  );
}

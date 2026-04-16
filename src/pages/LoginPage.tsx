import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api";
import "./LoginPage.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = await login(form.username, form.password);
    setLoading(false);
    if (data.token) {
      localStorage.setItem("admin_token", data.token);
      navigate("/");
    } else {
      setError(data.error || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <div className="login-orb login-orb-1" />
      <div className="login-orb login-orb-2" />
      <form className="login-card" onSubmit={submit}>
        <div className="login-logo">
          <span className="logo-dot" />
          Admin Panel
        </div>
        <h1>Welcome back</h1>
        <p className="login-sub">Sign in to manage portfolios</p>
        <div className="login-field">
          <label>Username</label>
          <input
            value={form.username}
            onChange={e => setForm(f => ({ ...f, username: e.target.value }))}
            placeholder="admin"
            autoComplete="username"
          />
        </div>
        <div className="login-field">
          <label>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="••••••••"
            autoComplete="current-password"
          />
        </div>
        {error && <div className="login-error">{error}</div>}
        <button type="submit" className="login-btn" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
};

export default LoginPage;

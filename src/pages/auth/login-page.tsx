import FormField from "../../components/ui/form-field";
import Button from "../../components/ui/button";
import Spinner from "../../components/ui/spinner";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useState } from "react";
import "./auth.css";
import { loginUser } from "../../store/thunks/authThunks";
import storage from "../../utils/storage";
import { useNavigate } from "react-router-dom";
import { setAuthorizationHeader } from "../../api/client";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [rememberUser, setRememberUser] = useState(false);

  const disabled = !form.email || !form.password;
  const navigate = useNavigate()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    event.preventDefault();
    return;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const response = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(response)) {
      const token = response.payload.token;
      setAuthorizationHeader(token);
      storage.set("auth", token, rememberUser);
      navigate("/", { replace: true });
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>

        {error && <div className="auth-alert">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <FormField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            type="email"
            required
          />

          <FormField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
          />

          <label className="auth-remember">
            <input
              type="checkbox"
              checked={rememberUser}
              onChange={(event) => setRememberUser(event.target.checked)}
            />
            Remember me
          </label>

          <div className="auth-actions">
            <span className="auth-alt-action">
              No account yet? <a href="/new-user">Create one</a>
            </span>

            <Button type="submit" variant="primary" disabled={disabled || loading}>
              {loading ? <Spinner inline size="sm" label="Signing in…" /> : "Login"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

import FormField from "../../components/ui/form-field";
import Button from "../../components/ui/button";
import Spinner from "../../components/ui/spinner";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useState } from "react";
import { createUser } from "../../store/thunks/authThunks";
import Page from "../../components/ui/layout/page";
import "./auth.css";
import { useNavigate } from "react-router-dom";

const CreateUserPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordAgain: "",
  });

  const navigate = useNavigate();

  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [successfulMessage, setSuccessfulMessage] = useState<string | null>(
    null,
  );

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const passwordValidator = () => {
    if (form.password !== form.passwordAgain) {
      setPasswordError("Passwords don't match");
      return false;
    }
    setPasswordError(null);
    return true;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!passwordValidator()) return;

    const userData = {
      name: form.name,
      email: form.email,
      password: form.password,
    };

    try {
      const resultAction = await dispatch(createUser(userData));

      if (createUser.fulfilled.match(resultAction)) {
        setSuccessfulMessage(
          "User created successfully, redirecting to login...",
        );
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err: any) {
      err.message || "Unexpected error ocurred";
    }
  };

  return (
    <Page title="">
      <div className="auth-page">
        <div className="auth-card">
          <h1 className="auth-title">Create your account</h1>

          {error && <div className="auth-alert">{error}</div>}
          {passwordError && <div className="auth-alert">{passwordError}</div>}
          {successfulMessage && (
            <div className="auth-alert success">{successfulMessage}</div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <FormField
              label="Username"
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Your username"
              required
            />

            <FormField
              label="Email"
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
            />

            <FormField
              label="Password"
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
            />

            <FormField
              label="Repeat password"
              id="passwordAgain"
              name="passwordAgain"
              type="password"
              value={form.passwordAgain}
              onChange={handleChange}
              placeholder="••••••••"
              required
              minLength={6}
            />

            <div className="auth-actions">
              <span className="auth-alt-action">
                Already registered? <a href="/login">Sign in</a>
              </span>

              <Button
                type="submit"
                variant="primary"
                disabled={loading}
                className="auth-submit"
              >
                {loading ? (
                  <Spinner inline size="sm" label="Creating user…" />
                ) : (
                  "Create user"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </Page>
  );
};

export default CreateUserPage;

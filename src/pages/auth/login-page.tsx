import FormField from "../../components/ui/form-field";
import Button from "../../components/ui/button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useState } from "react";
import { loginUser } from "../../store/thunks/authThunks";
import storage from "../../utils/storage";
import {  useNavigate } from "react-router-dom";

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
      storage.set("auth", token, rememberUser);
      navigate("/", {replace: true})
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-[var(--color-primary)]">
          Login
        </h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <FormField
              label="Email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="email"
              required
            />
            <br />
            <FormField
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="password"
              required
            />
          </div>
          <label>
            <input
              type="checkbox"
              checked={rememberUser}
              onChange={(event) => setRememberUser(event.target.checked)}
            />{" "}
            Remember me
          </label>
          <br />
          <Button type="submit" variant="primary" disabled={disabled}>
            {loading ? "Login in..." : "Login"}
          </Button>
          {error && <p>{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

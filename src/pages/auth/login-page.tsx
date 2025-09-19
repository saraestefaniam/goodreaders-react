import FormField from "../../components/ui/form-field";
import Button from "../../components/ui/button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useState } from "react";

const LoginPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event: React.FormEvent) => {
    event.preventDefault();
    return;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    return;
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
              value={""} //pendiente
              onChange={handleChange}
              placeholder="email"
              required
            />
            <br />
            <FormField
              label="Password"
              name="password"
              value={""} //pendiente
              onChange={handleChange}
              placeholder="password"
              required
            />
          </div>
          <label>
            <input
              type="checkbox"
              //checked={""} //debería ser la función rememberUser
              //onChange={(event) => setRememberUser(event.target.checked)}
            />{" "}
            Remember me
          </label>
          <br />
          <Button type="submit" variant="primary">
            Create user
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

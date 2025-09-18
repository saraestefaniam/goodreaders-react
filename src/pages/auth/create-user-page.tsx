import FormField from "../../components/ui/form-field";
import Button from "../../components/ui/button";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { useState } from "react";
import { createUser } from "../../store/thunks/authThunks";

const CreateUserPage = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.auth);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    passwordAgain: "",
    avatar: "",
  });

  const [passwordError, setPasswordError] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = event.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
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

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!passwordValidator()) return;
    dispatch(createUser(form));
  };

  return (
    <div className="bg-red-500">
      <h1>Create your user!</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <FormField
            label="User"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Write your username"
            required
          />
          <FormField
            label="Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="example@email.com"
            required
          />
          <FormField
            label="Password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Write your password"
            required
          />
          <FormField
            label="Repeat password"
            name="passwordAgain"
            value={form.passwordAgain}
            onChange={handleChange}
            placeholder="Write your password again"
            required
          />
          <FormField
            label="Avatar"
            name="avatar"
            type="file"
            accept="image/"
            onChange={handleChange}
            placeholder="Upload your avatar"
          />
          <Button type="submit" variant="primary" disabled={loading}>
            {loading ? "Creating user..." : "Create user"}
          </Button>
          {error && <p>{error}</p>}
          {passwordError && <p className="text-red-500">{passwordError}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage;

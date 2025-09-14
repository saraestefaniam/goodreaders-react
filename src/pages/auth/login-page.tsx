import FormField from "../../components/ui/form-field";
import Button from "../../components/ui/button";

const LoginPage = () => {
  const handleChange = (event: React.FormEvent) => {
    event.preventDefault();
    return;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    return;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[var(--color-bg)]">
      <h1 className="text-2xl font-bold text-center text-[var(--color-primary)] mb-6">Login</h1>
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <FormField
              label="User"
              name="username"
              value={""} //pendiente
              onChange={handleChange}
              placeholder="username"
              required
            />
            <br />
            <FormField
              label="Password"
              name="password"
              value={""} //pendiente
              onChange={handleChange}
              placeholder="username"
              required
            />
          </div>
          <label>
            <input
              type="checkbox"
              //checked={""} //debería ser la función rememberUser
              //onChange={(event) => setRememberUser(event.target.checked)}
            />
          </label>
          <Button type="submit" variant="primary">
            Create user
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;

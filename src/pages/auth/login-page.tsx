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
    <div>
      <div>
        <h1>Login</h1>
        <form onSubmit={handleSubmit}>
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

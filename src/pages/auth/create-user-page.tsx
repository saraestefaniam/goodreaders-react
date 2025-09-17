import FormField from "../../components/ui/form-field";
import Button from "../../components/ui/button";

const CreateUserPage = () => {
  const handleChange = (event: React.FormEvent) => {
    event.preventDefault();
    return;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    return;
  };

  return (
    <div className="bg-red-500">
      <h1>Create your user!</h1>
      <div>
        <form onSubmit={handleSubmit}>
          <FormField
            label="User"
            name="user"
            value={""} //pendiente, debería ser algo tipo form.user o user
            onChange={handleChange}
            placeholder="Write your username"
            required
          />
          <FormField
            label="Email"
            name="email"
            value={""} //pendiente, debería ser algo como form.email o email estas se definen arriba al inicio de la función y sus estados se manejan con redux
            onChange={handleChange}
            placeholder="example@email.com"
            required
          />
          <FormField
            label="Password"
            name="password"
            value={""} //pendiente, debería ser algo como form.password o password
            onChange={handleChange}
            placeholder="Write your password"
            required
          />
          <FormField
            label="Repeat password"
            name="password"
            value={""}
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
            required
          />
          <Button type="submit" variant="primary">
            Create user
          </Button>
        </form>
      </div>
    </div>
  );
};

export default CreateUserPage;

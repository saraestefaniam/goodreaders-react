/* eslint-disable react/react-in-jsx-scope */
import Layout from "./components/ui/layout/layout";
// import BooksPage from "./pages/books/books-page";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import CreateUserPage from "./pages/auth/create-user-page";
import LoginPage from "./pages/auth/login-page";

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<LoginPage />}></Route>
          <Route path="new-user" element={<CreateUserPage />} />
        </Route>
      </Routes>
    </div>
  );
};

export default App;

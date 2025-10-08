/* eslint-disable react/react-in-jsx-scope */
import Layout from "./components/ui/layout/layout";
import BooksPage from "./pages/books/books-page";
import BookPage from "./pages/books/book-page";
import NewBookPage from "./pages/books/new-book-page";
import WantToReadPage from "./pages/books/want-to-read-page";  // Importa la nueva página
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import CreateUserPage from "./pages/auth/create-user-page";
import LoginPage from "./pages/auth/login-page";

function App() {
  return (
    <div>
      <Routes>
        {/* Auth */}
        <Route path="/" element={<Layout />}>
          <Route path="login" element={<LoginPage />}></Route>
          <Route path="new-user" element={<CreateUserPage />} />
          {/* Books */}
          <Route path="/" element={<Navigate to="/books" replace />} />
          <Route path="/books" element={<BooksPage />} />
          <Route path="/books/new" element={<NewBookPage />} />
          <Route path="/books/:bookId" element={<BookPage />} />
          <Route path="/want-to-read" element={<WantToReadPage />} /> 
        </Route>
      </Routes>
    </div>
  );
}

export default App;

import React from "react";
import GoodReaders from "../icons/GoodReaders.tsx";
import AuthButton from "../../../pages/auth/auth-button.tsx";
import "./header.css";
import { Link } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <Link to="/">
        <div className="header-logo">
          <GoodReaders />
        </div>
      </Link>
      <nav className="header-nav">
        <Link to="/books/new">Add New Book</Link>
        <AuthButton />
      </nav>
    </header>
  );
}

export default Header;
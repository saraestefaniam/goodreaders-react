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

          <GoodReadersIcon />
        </div>
      </Link>

      <nav className="header-nav">
        <NavLink to="/new-user" className="header-nav">
          Create user
        </NavLink>
         <NavLink to="/books/new">Add new book<NavLink />
         <AuthButton />
        <NavLink to="login" className="header-nav">
          Login
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;

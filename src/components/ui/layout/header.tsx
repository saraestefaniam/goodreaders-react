//import React from "react";
import GoodReadersIcon from "../icons/GoodReaders";
import "./header.css";
import { Link, NavLink } from "react-router-dom";

function Header() {
  return (
    <header className="header">
      <Link to="/">
        <div className="header-logo">
          <GoodReadersIcon />
        </div>
      </Link>

      <nav className="header-nav">
        <NavLink to="/new-user" className="header-nav">Create user</NavLink>
      </nav>
    </header>
  );
}

export default Header;
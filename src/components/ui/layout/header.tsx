import "./header.css";
import { Link, NavLink } from "react-router-dom";
import GoodReadersIcon from "../icons/GoodReaders.tsx";

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
        <NavLink to="/books/new">Add new book</NavLink>
        <NavLink to="login" className="header-nav">
          Login
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;

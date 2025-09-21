import "./header.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import GoodReadersIcon from "../icons/GoodReaders.tsx";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";
import { selectIsLogged } from "../../../store/slices/authSelectors.ts";
import { logout } from "../../../store/slices/authSlice.ts";

function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLogged = useAppSelector(selectIsLogged);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

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

        {isLogged ? (
          <NavLink to="/login" onClick={handleLogout} className="header-nav">Logout</NavLink>
        ) : (
          <NavLink to="/login" className="header-nav">
            Login
          </NavLink>
        )}
      </nav>
    </header>
  );
}

export default Header;

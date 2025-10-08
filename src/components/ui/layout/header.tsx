import { useEffect, useState } from "react";
import "./header.css";
import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from "react-router-dom";
import GoodReadersIcon from "../icons/GoodReaders.tsx";
import Button from "../button";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";
import { selectIsLogged } from "../../../store/slices/authSelectors.ts";
import { logout } from "../../../store/slices/authSlice.ts";

function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const isLogged = useAppSelector(selectIsLogged);

  const handleLogout = () => {
    setMenuOpen(false);
    dispatch(logout());
    navigate("/login");
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { to: "/books", label: "Books" },
    { to: "/want-to-read", label: "Want To Read" },
  ];

  const authLinks = isLogged
    ? []
    : [{ to: "/new-user", label: "Create Account" }];

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) =>
    `header-link${isActive ? " header-link--active" : ""}`;

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-brand">
          <span className="header-logo">
            <GoodReadersIcon />
          </span>
          <span className="header-brand-text">
            <span className="header-brand-title">GoodReaders</span>
            <span className="header-brand-subtitle">Your digital book club</span>
          </span>
        </Link>

        <button
          type="button"
          className="header-toggle"
          aria-label={
            menuOpen ? "Close navigation menu" : "Open navigation menu"
          }
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((prev) => !prev)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`header-menu${menuOpen ? " header-menu--open" : ""}`}>
          <nav className="header-links" aria-label="Primary navigation">
            {[...navLinks, ...authLinks].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={getNavLinkClass}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="header-actions">
            <Button
              type="button"
              variant="primary"
              onClick={() => {
                setMenuOpen(false);
                navigate("/books/new");
              }}
            >
              Add Book
            </Button>

            {isLogged ? (
              <Button type="button" variant="secondary" onClick={handleLogout}>
                Sign out
              </Button>
            ) : (
              <Button
                type="button"
                variant="secondary"
                onClick={() => {
                  setMenuOpen(false);
                  navigate("/login");
                }}
              >
                Sign in
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;

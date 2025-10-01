import "./header.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import GoodReadersIcon from "../icons/GoodReaders.tsx";
import { useAppDispatch, useAppSelector } from "../../../store/hooks.ts";
import { selectIsLogged } from "../../../store/slices/authSelectors.ts";
import { logout } from "../../../store/slices/authSlice.ts";
import React, { useEffect, useRef, useState } from "react";
import { searchBooks } from "../../../pages/books/service.ts";

function Header() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isLogged = useAppSelector(selectIsLogged);
  const [results, setResults] = useState<any[]>([])
  const [query, setQuery] = useState("")
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) {
      setResults([])
      setShowDropdown(false)
      return
    }
    try {
      const books = await searchBooks(query)
      setResults(books)
      setShowDropdown(true)
    } catch (error) {
      setResults([])
      setShowDropdown(false)
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false)
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    } else {
      document.removeEventListener("mousedown", handleClickOutside)
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showDropdown])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (!e.target.value.trim()) {
      setResults([])
      setShowDropdown(false)
    }
  }

  const handleResultClick = (bookId: string) => {
    setShowDropdown(false)
    setQuery("")
    setResults([])
    navigate(`/books/${bookId}`)
  }

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

        <div className="header-search" style={{position: "relative"}} ref={dropdownRef}>
          <form onSubmit={handleSearch} autoComplete="off">
            <input 
              type="text"
              placeholder="Buscar libros"
              value={query}
              onChange={handleInputChange}
              onFocus={() => results.length > 0 && setShowDropdown(true)}
              style={{padding: "0.3rem 0.5rem"}}
            />
            {/* <button type="submit" style={{marginLeft: "0.5rem"}}>Buscar</button> */}
          </form>
          {showDropdown && results.length > 0 && (
            <ul
              className="search-dropdown"
              style={{
                position: "absolute",
                top: "2.2rem",
                left: 0,
                right: 0,
                background: "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                zIndex: 100,
                maxHeight: "250px",
                overflowY: "auto",
                listStyle: "none",
                margin: 0,
                padding: 0,
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
              }}
            >
              {results.map((book) => (
                <li
                  key={book.id || book._id}
                  onClick={() => handleResultClick(book.id || book._id)}
                  style={{
                    padding: "0.5rem 1rem",
                    cursor: "pointer",
                    borderBottom: "1px solid #eee"
                  }}
                  onMouseDown={e => e.preventDefault()}
                >
                  <strong>{book.title}</strong>
                  <span style={{ color: "#666", marginLeft: "0.5rem" }}>
                    {book.author}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

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

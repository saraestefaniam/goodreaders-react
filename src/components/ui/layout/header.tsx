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

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (!value.trim() || value.length < 3) {
      setResults([])
      setShowDropdown(false)
      return
    }
    try {
      const books = await searchBooks(value)
      console.log("Resultados búsqueda:", books)
      setResults(books)
      setShowDropdown(books.length > 0)
    } catch {
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

        <div className="header-search" ref={dropdownRef}>
          <form onSubmit={handleSearch} autoComplete="off">
            <input 
              type="text"
              className="search-input"
              placeholder="Search"
              value={query}
              onChange={handleInputChange}
              onFocus={() => results.length > 0 && setShowDropdown(true)}
            />
            {/* <button type="submit" style={{marginLeft: "0.5rem"}}>Buscar</button> */}
          </form>
          {showDropdown && results.length > 0 && (
            <ul className="search-dropdown">
              {results.map((book) => (
                <li
                  key={book.id || book._id}
                  className="search-result"
                  onClick={() => handleResultClick(book.id || book._id)}
                  onMouseDown={e => e.preventDefault()}
                >
                  <strong>{book.title}</strong>
                  <span className="search-result-author">
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

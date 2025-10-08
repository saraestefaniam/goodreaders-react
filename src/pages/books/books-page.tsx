import { useState, useEffect, useRef } from "react";
import { getBooksWithPagination, getGenres, searchBooks } from "./service";
import type { Book, BooksListResponse } from "./type";
import type { Genres } from "./genres-type";
import { FALLBACK_GENRES } from "./genres.constants";
import Page from "../../components/ui/layout/page";
import Button from "../../components/ui/button";
import BookItem from "./book-item";
import { Link, useNavigate } from "react-router-dom";
import Spinner from "../../components/ui/spinner";
import storage from "../../utils/storage";
import "../../index.css";
import "./books-pages.css";
import "../../components/ui/search-bar.css";

const ITEMS_PER_PAGE = 12;

const EmptyList = ({ onAdd }: { onAdd: () => void }) => (
  <div>
    <p>No books yet. Be the first to add one!</p>
    <Button variant="primary" type="button" onClick={onAdd}>
      Add Book
    </Button>
  </div>
);

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [availableGenres, setAvailableGenres] = useState<Genres[]>([]);
  const [filterGenres, setFilterGenres] = useState<Genres[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [results, setResults] = useState<Book[]>([]);
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const latestQueryRef = useRef("");

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    setErrorMessage(null);
    (async () => {
      const [genresRes] = await Promise.allSettled([getGenres()]);
      if (!mounted) return;
      if (genresRes.status === "fulfilled") {
        setAvailableGenres(
          Array.from(new Set([...genresRes.value, ...FALLBACK_GENRES])),
        );
      } else {
        setAvailableGenres(FALLBACK_GENRES);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    latestQueryRef.current = value;
    if (!value.trim() || value.length < 3) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    try {
      const res = await searchBooks(value);
      if (latestQueryRef.current !== value) return;
      setResults(Array.isArray(res) ? res : res.items);
      setShowDropdown((Array.isArray(res) ? res : res.items).length > 0);
    } catch {
      setResults([]);
      setShowDropdown(false);
    }
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    try {
      latestQueryRef.current = query;
      const res = await searchBooks(query);
      if (latestQueryRef.current !== query) return;
      setResults(res.items);
      setShowDropdown(res.items.length > 0);
    } catch {
      setResults([]);
      setShowDropdown(false);
    }
  };

  const handleResultClick = (bookId: string) => {
    setShowDropdown(false);
    setQuery("");
    setResults([]);
    latestQueryRef.current = "";
    navigate(`/books/${bookId}`);
  };

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setErrorMessage(null);
    (async () => {
      try {
        const genres = filterGenres.length ? filterGenres : undefined;
        const res: BooksListResponse = await getBooksWithPagination(
          page,
          ITEMS_PER_PAGE,
          genres,
        );
        if (!mounted) return;
        setBooks(res.items);
        setTotalPages(res.pages);
      } catch {
        if (!mounted) return;
        setBooks([]);
        setErrorMessage("We couldn't load the books list.");
      } finally {
        if (mounted) setIsLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [page, filterGenres]);

  const handleAddBook = () => {
    const token = storage.get("auth");
    if (!token) {
      navigate("/login", { replace: true, state: { from: "/books/new" } });
      return;
    }
    navigate("/books/new");
  };

  const prevPage = () => {
    if (page > 1) setPage((p) => p - 1);
  };
  const nextPage = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };

  return (
    <Page title="Books">
      {isLoading && <Spinner label="Loading books…" />}
      {!isLoading && errorMessage && (
        <div className="books-page-alert" role="alert">
          {errorMessage}
        </div>
      )}
      <div className="filter-form">
        <div className="filter-tags">
          Genres:
          {availableGenres.map((genre) => (
            <label key={genre} className="filter-tag-label">
              <input
                type="checkbox"
                checked={filterGenres.includes(genre)}
                onChange={() =>
                  setFilterGenres((prev) =>
                    prev.includes(genre)
                      ? prev.filter((g) => g !== genre)
                      : [...prev, genre],
                  )
                }
              />
              {genre}
            </label>
          ))}
        </div>
        <div
          className="header-search"
          ref={dropdownRef}
          style={{ position: "relative" }}
        >
          <form onSubmit={handleSearch} autoComplete="off">
            <input
              type="text"
              className="search-input"
              placeholder="Search books or authors"
              value={query}
              onChange={handleInputChange}
              onFocus={() => results.length > 0 && setShowDropdown(true)}
            />
          </form>
          {showDropdown && results.length > 0 && (
            <ul className="search-dropdown">
              {results.map((book) => (
                <li
                  key={book.id}
                  className="search-result"
                  onClick={() => handleResultClick(book.id)}
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <span className="search-result-title">{book.title}</span>
                  {book.author && (
                    <span className="search-result-author">{book.author}</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      {books.length ? (
        <div>
          <div className="book-list">
            {books.map((book) => (
              <Link to={`/books/${book.id}`} key={book.id}>
                <BookItem book={book} />
              </Link>
            ))}
          </div>
          <div className="pagination-controls">
            <Button variant="primary" onClick={prevPage} disabled={page === 1}>
              Previous
            </Button>
            <span>
              Page {page} of {totalPages}
            </span>
            <Button
              variant="primary"
              onClick={nextPage}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      ) : (
        <EmptyList onAdd={handleAddBook} />
      )}
    </Page>
  );
}

export default BooksPage;
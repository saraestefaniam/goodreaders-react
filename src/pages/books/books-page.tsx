import { useState, useEffect } from "react";
import { getBooks, getGenres } from "./service";
import type { Book } from "./type";
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
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    setIsLoading(true);
    setErrorMessage(null);

    (async () => {
      const [booksRes, genresRes] = await Promise.allSettled([
        getBooks(),
        getGenres(),
      ]);

      if (!mounted) return;

      if (booksRes.status === "fulfilled") {
        if (Array.isArray(booksRes.value)) {
          setBooks(booksRes.value);
        } else {
          console.error(
            "Books response was not an array as expected:",
            booksRes.value,
          );
          setBooks([]);
          setErrorMessage("We couldn't load the books list.");
        }
      } else {
        console.error("Failed to load books:", booksRes.reason);
        setBooks([]);
        setErrorMessage("We couldn't load the books list.");
      }

      if (genresRes.status === "fulfilled") {
        setAvailableGenres(
          Array.from(new Set([...genresRes.value, ...FALLBACK_GENRES])),
        );
      } else {
        console.error("Failed to load genres:", genresRes.reason);
        setAvailableGenres(FALLBACK_GENRES);
      }

      setIsLoading(false);
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const filteredBooks = books.filter((book) =>
    filterGenres.length
      ? filterGenres.some((g) => book.genre.includes(g))
      : true,
  );

  const handleAddBook = () => {
    const token = storage.get("auth");
    if (!token) {
      navigate("/login", { replace: true, state: { from: "/books/new" } });
      return;
    }
    navigate("/books/new");
  };

  return (
    <Page title="Books">
      {isLoading && <Spinner label="Loading books…" />}

      {!isLoading && errorMessage && (
        <div className="books-page-alert" role="alert">
          {errorMessage}
        </div>
      )}

      <form className="filter-form">
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
      </form>

      {filteredBooks.length ? (
        <div className="book-list">
          {filteredBooks.map((book) => (
            <Link to={`/books/${book.id}`} key={book.id}>
              <BookItem book={book} />
            </Link>
          ))}
        </div>
      ) : (
        <EmptyList onAdd={handleAddBook} />
      )}
    </Page>
  );
}

export default BooksPage;

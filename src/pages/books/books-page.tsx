import { useState, useEffect } from "react";
import { getBooksWithPagination, getGenres } from "./service";
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

const ITEMS_PER_PAGE = 8;

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

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setErrorMessage(null);
    (async () => {
      try {
        const res: BooksListResponse = await getBooksWithPagination(page, ITEMS_PER_PAGE);
        let items = res.items;
        if (filterGenres.length) {
          items = items.filter((book) =>
            filterGenres.some((g) => book.genre.includes(g))
          );
        }
        setBooks(items);
        setTotalPages(res.pages);
      } catch (error) {
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
            <Button variant="primary" onClick={nextPage} disabled={page === totalPages}>
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


import { useState, useEffect } from "react";
import { getBooks, getGenres } from "./service";
import type { Book } from "./type";
import type { Genres } from "./genres-type";
import { FALLBACK_GENRES } from "./genres.constants";
import Page from "../../components/ui/layout/page";
import Button from "../../components/ui/button";
import BookItem from "./book-item";
import { Link, useNavigate } from "react-router-dom";
import "../../index.css";

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
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    (async () => {
      const [booksRes, genresRes] = await Promise.allSettled([
        getBooks(),
        getGenres(),
      ]);

      if (!mounted) return;

      if (booksRes.status === "fulfilled") {
        setBooks(booksRes.value);
      } else {
        console.error("Failed to load books:", booksRes.reason);
        setBooks([]);
      }

      if (genresRes.status === "fulfilled") {
        setAvailableGenres(
          Array.from(new Set([...genresRes.value, ...FALLBACK_GENRES])),
        );
      } else {
        console.error("Failed to load genres:", genresRes.reason);
        setAvailableGenres(FALLBACK_GENRES);
      }
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

  return (
    <Page title="Books">
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
        <EmptyList onAdd={() => navigate("/books/new")} />
      )}
    </Page>
  );
}

export default BooksPage;

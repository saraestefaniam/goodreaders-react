import { useState, useEffect } from "react";
import { getBooks, getGenres } from "./service";
import type { Book, PaginatedBooks } from "./type";
import type { Genres } from "./genres-type";
import Page from "../../components/ui/layout/page";
import Button from "../../components/ui/button";
import BookItem from "./book-item";
import { Link, useNavigate } from "react-router-dom";
import "../../index.css";
import "./books-pages.css";

const LIMIT = 4;

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
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    (async () => {
      const [booksRes, genresRes] = await Promise.allSettled([
        getBooks(page, LIMIT),
        getGenres(),
      ]);

      if (!mounted) return;

      if (booksRes.status === "fulfilled") {
        const res = booksRes.value as PaginatedBooks;
        setBooks(res.items);
        setPages(res.pages);
      } else {
        console.error("Failed to load books:", booksRes.reason);
        setBooks([]);
      }

      if (genresRes.status === "fulfilled") {
        setAvailableGenres(genresRes.value);
      } else {
        console.error("Failed to load genres:", genresRes.reason);
        // Fallback coherente con tu tipo `Genres`
        setAvailableGenres([
          "fantasy",
          "science-fiction",
          "romance",
          "thriller",
          "non-fiction",
          "mystery",
          "other",
        ]);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [page]);

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

      <div
        style={{
          marginTop: 28,
          display: "flex",
          justifyContent: "center",
          gap: 24,
        }}
      >
        <Button
          variant="secondary"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          ◀ Prev
        </Button>

        <span>
          Page {page} / {pages}
        </span>

        <Button
          variant="secondary"
          onClick={() => setPage((p) => (p < pages ? p + 1 : p))}
          disabled={page === pages}
        >
          Next ▶
        </Button>
      </div>
    </Page>
  );
}

export default BooksPage;

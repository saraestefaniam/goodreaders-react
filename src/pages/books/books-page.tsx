import { useState, useEffect } from "react";
import { getBooks, getGenres } from "./service";
import type { Book } from "./type";
import type { Genres } from "./genres-type";
import Page from "../../components/ui/layout/page";
import BookItem from "./book-item";
import { Link, useNavigate } from "react-router-dom";
import "../../index.css";
import Button from "../../components/ui/button";
import "./books-pages.css";

const EmptyList = ({ onAdd }: { onAdd: () => void }) => (
  <div className="books-empty">
    <h3 className="books-empty__title">Your shelf is waiting</h3>
    <p className="books-empty__text">
      Start your collection by adding the first story to GoodReaders.
    </p>
    <Button variant="primary" type="button" onClick={onAdd}>
      Add your first book
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
  }, []);

  const filteredBooks = books.filter((book) =>
    filterGenres.length
      ? filterGenres.some((g) => book.genre.includes(g))
      : true,
  );

  return (
    <Page title="" variant="flush">
      <section className="books-main-hero">
        <div className="books-main-hero__shell">
          <div className="books-main-hero__content">
            <span className="books-eyebrow">GoodReaders Community</span>
            <h1 className="books-main-hero__title">
              Discover, collect, and share the stories you love
            </h1>
            <p className="books-main-hero__subtitle">
              Dive into hundreds of recommendations crafted by readers like you.
              Save upcoming reads, track your favourites, and let every book find
              its perfect shelf.
            </p>
            <div className="books-main-hero__actions">
              <Button
                variant="primary"
                type="button"
                onClick={() => navigate("/books/new")}
              >
                Add new book
              </Button>
              <button
                type="button"
                className="books-ghost-link"
                onClick={() =>
                  document
                    .getElementById("books-collection")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Browse collection
              </button>
            </div>
          </div>

          <div className="books-main-hero__visual" aria-hidden="true">
            <div className="books-main-hero__card">
              <span className="books-main-hero__badge">4.8 ★</span>
              <div className="books-main-hero__card-title">The Way of Kings</div>
              <div className="books-main-hero__card-author">by Brandon Sanderson</div>
              <div className="books-main-hero__card-progress">
                <span />
              </div>
              <p className="books-main-hero__card-quote">
                “A sweeping epic that sets the tone for your next adventure.”
              </p>
            </div>
            <div className="books-main-hero__floating books-main-hero__floating--one" />
            <div className="books-main-hero__floating books-main-hero__floating--two" />
          </div>
        </div>
      </section>

      <section className="books-overview">
        <span className="books-eyebrow">Why readers stay</span>
        <h2 className="books-overview__title">Amazing features for book lovers</h2>
        <p className="books-overview__subtitle">
          Find thoughtful reviews, organise your personal shelves, and keep track of
          every story with elegant tools designed for passionate readers.
        </p>
      </section>

      <form className="books-filters" aria-label="Filter by genre">
        <span className="books-filters__label">Filter by tags</span>
        <div className="books-filters__chips">
          {availableGenres.map((genre) => {
            const isActive = filterGenres.includes(genre);
            return (
              <button
                key={genre}
                type="button"
                className={`books-chip${isActive ? " books-chip--active" : ""}`}
                onClick={() =>
                  setFilterGenres((prev) =>
                    prev.includes(genre)
                      ? prev.filter((g) => g !== genre)
                      : [...prev, genre],
                  )
                }
              >
                #{genre}
              </button>
            );
          })}
        </div>
        {filterGenres.length ? (
          <button
            type="button"
            className="books-clear"
            onClick={() => setFilterGenres([])}
          >
            Clear filters
          </button>
        ) : null}
      </form>

      <section className="books-collection" id="books-collection">
        {filteredBooks.length ? (
          <div className="books-grid">
            {filteredBooks.map((book) => (
              <Link to={`/books/${book.id}`} key={book.id} className="books-grid__item">
                <BookItem book={book} />
              </Link>
            ))}
          </div>
        ) : (
          <EmptyList onAdd={() => navigate("/books/new")} />
        )}
      </section>
    </Page>
  );
}

export default BooksPage;

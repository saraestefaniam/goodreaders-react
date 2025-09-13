import { useState, useEffect } from "react";
import { getBooks} from "./service";
import type { Book } from "./type";
import { VALID_GENRES } from "./genres-type"; 
import type { Genre } from "./genres-type";  
import { getGenres } from "./service";
import Page from "../../components/ui/layout/page";
import Button from "../../components/ui/button";
import BookItem from "./book-item";
import { Link } from "react-router-dom";
import "./index.css";

const EmptyList = () => (
  <div>
    <p>No books yet. Be the first to add one!</p>
    <Button variant="primary">Add Book</Button>
  </div>
);

function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [filterGenres, setFilterGenres] = useState<Genre[]>([]);

  useEffect(() => {
    async function fetchData() {
      const books = await getBooks();
      const genresFromApi = await getGenres();

      const validGenres = genresFromApi.filter((g): g is Genre =>
        VALID_GENRES.includes(g as Genre)
      );

      setBooks(books);
      setAvailableGenres(validGenres);
    }
    fetchData();
  }, []);

  const filteredBooks = books.filter((book) => {
    return filterGenres.length
      ? filterGenres.every((genre) => book.genre.includes(genre))
      : true;
  });

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
                      : [...prev, genre]
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
        <EmptyList />
      )}
    </Page>
  );
}

export default BooksPage;
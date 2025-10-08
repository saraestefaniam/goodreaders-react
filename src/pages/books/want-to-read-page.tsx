import { useEffect, useState } from "react";
import { getWantToReadBooks } from "../../api/client";
import type { Book } from "./type";
import Page from "../../components/ui/layout/page";
import BookItem from "./book-item";
import Spinner from "../../components/ui/spinner";
import { Link } from "react-router-dom";
import Button from "../../components/ui/button";

const WantToReadPage = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getWantToReadBooks();
        setBooks(data);
      } catch (err) {
        setError("Failed to load want to read books.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <Spinner label="Loading your want to read list…" />;
  if (error) return <div>{error}</div>;

  return (
    <Page title="Want To Read">
      {books.length ? (
        <div className="book-list">
          {books.map((book) => (
            <Link to={`/books/${book.id}`} key={book.id}>
              <BookItem book={book} />
            </Link>
          ))}
        </div>
      ) : (
        <p>You don't have any books in your Want To Read list yet.</p>
      )}
      <Button variant="primary" onClick={() => window.history.back()}>
        Go Back
      </Button>
    </Page>
  );
};

export default WantToReadPage;
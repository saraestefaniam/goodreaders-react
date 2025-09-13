import { useNavigate, useParams } from "react-router-dom";
import Page from "../../components/ui/layout/page";
import { useEffect, useState } from "react";
import type { Book } from "./type";
import { getBook, deleteBook } from "./service";
import { AxiosError } from "axios";
import ConfirmDialog from "../../components/ui/layout/confirm-dialog";
import Button from "../../components/ui/button";

function BookPage() {
  const { bookId } = useParams<{ bookId: string }>();
  const [book, setBook] = useState<Book | null>(null);
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleDelete = async () => {
    if (!book) return;
    try {
      await deleteBook(book.id.toString());
      navigate("/books");
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        if (status === 404) navigate("/404");
        else if (status === 401) navigate("/login");
        else console.error("Unexpected error while deleting:", error);
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  useEffect(() => {
    if (!bookId) return;
    getBook(bookId)
      .then((b) => setBook(b))
      .catch((error) => {
        if (error instanceof AxiosError && error.response?.status === 404) {
          navigate("/404");
        }
      });
  }, [bookId, navigate]);

  return (
    <Page title="Book detail">
      {book && (
        <>
          <article className="book-item" style={{ maxWidth: 400, margin: "0 auto" }}>
            <img src={book.cover || "/descarga.png"} alt={book.title} className="book-item-image" />
            <div className="book-item-details">
              <h2 className="book-item-title">{book.title}</h2>
              <p className="book-item-author">{book.author}</p>
              <div className="book-item-tags">
                {book.genre.map((g) => (
                  <span key={g} className="book-item-tag">{g}</span>
                ))}
              </div>
              {book.description && <p className="book-item-description">{book.description}</p>}
              <p className="book-item-status">{book.wantToRead ? "Want to read" : "Already read"}</p>
              <div className="book-item-rating" title={`${book.rating}/5`}>
                {"★".repeat(book.rating) + "☆".repeat(5 - book.rating)}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-start", padding: "1rem" }}>
              <Button variant="primary" onClick={() => setShowConfirm(true)}>Delete</Button>
            </div>
          </article>

          {showConfirm && (
            <ConfirmDialog
              message="Are you sure you want to delete this book?"
              onConfirm={handleDelete}
              onCancel={() => setShowConfirm(false)}
            />
          )}
        </>
      )}
    </Page>
  );
}

export default BookPage;
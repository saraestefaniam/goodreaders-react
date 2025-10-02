import { useEffect, useMemo, useState } from "react";
import type { ChangeEvent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AxiosError } from "axios";
import Page from "../../components/ui/layout/page";
import Spinner from "../../components/ui/spinner";
import ConfirmDialog from "../../components/ui/layout/confirm-dialog";
import Button from "../../components/ui/button";
import {
  getBook,
  deleteBook,
  updateWantToReadStatus,
  getWantToReadStatus,
} from "./service";
import type { Book } from "./type";
import "./book-page.css";

function BookPage() {
  const { bookId } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState<Book | null>(null);
  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isWantToRead, setIsWantToRead] = useState(false);
  const [isUpdatingWantToRead, setIsUpdatingWantToRead] = useState(false);
  const [wantToReadError, setWantToReadError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!book) return;
    try {
      await deleteBook(book.id.toString());
      setShowConfirm(false);
      navigate("/books");
    } catch (error) {
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        if (statusCode === 404) {
          navigate("/404");
        } else if (statusCode === 401) {
          navigate("/login");
        } else {
          console.error("Unexpected error while deleting:", error);
        }
      } else {
        console.error("Unknown error:", error);
      }
    }
  };

  const handleWantToReadChange = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    if (!bookId) return;

    const nextStatus = event.target.checked;
    setWantToReadError(null);
    setIsUpdatingWantToRead(true);

    try {
      await updateWantToReadStatus(bookId, nextStatus);
      setIsWantToRead(nextStatus);
      setBook((prev) => (prev ? { ...prev, wantToRead: nextStatus } : prev));
    } catch (error) {
      if (error instanceof AxiosError) {
        const statusCode = error.response?.status;
        if (statusCode === 401) {
          navigate("/login");
          return;
        }
        if (statusCode === 404) {
          navigate("/404");
          return;
        }
        setWantToReadError(
          error.response?.data?.message ??
            "Unable to update want-to-read status.",
        );
      } else {
        setWantToReadError("Unable to update want-to-read status.");
      }
    } finally {
      setIsUpdatingWantToRead(false);
    }
  };

  useEffect(() => {
    if (!bookId) {
      setStatus("error");
      setErrorMessage("Missing book identifier.");
      return;
    }

    let isMounted = true;

    const loadBook = async () => {
      setStatus("loading");
      setErrorMessage(null);
      setWantToReadError(null);

      try {
        const fetchedBook = await getBook(bookId);
        if (!isMounted) return;
        setBook(fetchedBook);
        setStatus("success");
      } catch (error) {
        if (!isMounted) return;
        if (error instanceof AxiosError) {
          const statusCode = error.response?.status;
          if (statusCode === 404) {
            navigate("/404");
            return;
          }
          if (statusCode === 401) {
            navigate("/login");
            return;
          }
          setErrorMessage(
            error.response?.data?.message ?? "Unable to load this book.",
          );
        } else {
          setErrorMessage("Unable to load this book.");
        }
        setStatus("error");
        return;
      }

      setIsUpdatingWantToRead(true);
      try {
        const statusResponse = await getWantToReadStatus(bookId);
        if (!isMounted) return;
        setIsWantToRead(Boolean(statusResponse.wantToRead));
      } catch (error) {
        if (!isMounted) return;
        if (error instanceof AxiosError) {
          const statusCode = error.response?.status;
          if (statusCode === 401 || statusCode === 404) {
            navigate("/login");
            return;
          }
          setWantToReadError(
            error.response?.data?.message ??
              "Unable to load want-to-read status.",
          );
        } else {
          setWantToReadError("Unable to load want-to-read status.");
        }
      } finally {
        if (isMounted) {
          setIsUpdatingWantToRead(false);
        }
      }
    };

    loadBook();

    return () => {
      isMounted = false;
    };
  }, [bookId, navigate]);

  const ratingLabel = useMemo(() => {
    if (!book) return "";
    return `${book.rating} / 5`;
  }, [book]);

  const createdAt = useMemo(() => {
    if (!book) return null;
    return new Date(book.createdAt).toLocaleDateString();
  }, [book]);

  const updatedAt = useMemo(() => {
    if (!book) return null;
    return new Date(book.updatedAt).toLocaleDateString();
  }, [book]);

  return (
    <Page title={book ? book.title : "Book detail"}>
      <div className="book-detail">
        {status === "loading" && <Spinner label="Loading book…" />}

        {status === "error" && (
          <div className="book-detail__state book-detail__state--error">
            {errorMessage ?? "We couldn't load this book."}
          </div>
        )}

        {status === "success" && book && (
          <article className="book-detail-card">
            <div className="book-detail-hero">
              <img
                className="book-detail-cover"
                src={book.cover || "/descarga.png"}
                alt={`Cover art for ${book.title}`}
              />

              <div className="book-detail-summary">
                <p className="book-detail-author">
                  by <span>{book.author}</span>
                </p>

                {book.genre.length > 0 && (
                  <div className="book-detail-genres">
                    {book.genre.map((g) => (
                      <span key={g} className="book-detail-chip">
                        #{g}
                      </span>
                    ))}
                  </div>
                )}

                <div
                  className="book-detail-rating"
                  aria-label={`Rating: ${ratingLabel}`}
                  title={`Rating: ${ratingLabel}`}
                >
                  <span className="book-detail-rating__stars" aria-hidden="true">
                    {"★".repeat(book.rating) + "☆".repeat(5 - book.rating)}
                  </span>
                  <span className="book-detail-rating__value">{ratingLabel}</span>
                </div>

                {book.description && (
                  <p className="book-detail-description">{book.description}</p>
                )}

                <div className="book-detail-meta">
                  {createdAt && <span>Added on {createdAt}</span>}
                  {updatedAt && updatedAt !== createdAt && (
                    <span>Updated on {updatedAt}</span>
                  )}
                </div>
              </div>

              <aside className="book-detail-sidebar">
                <label
                  className={`book-detail-toggle${
                    isUpdatingWantToRead ? " book-detail-toggle--disabled" : ""
                  }`}
                >
                  <input
                    className="book-detail-toggle__input"
                    type="checkbox"
                    checked={isWantToRead}
                    onChange={handleWantToReadChange}
                    disabled={isUpdatingWantToRead}
                  />
                  <span
                    className="book-detail-toggle__icon"
                    aria-hidden="true"
                  >
                    {isWantToRead ? "✕" : "+"}
                  </span>
                  <span className="book-detail-toggle__text">
                    {isUpdatingWantToRead
                      ? "Updating…"
                      : isWantToRead
                        ? "Remove from list"
                        : "Add to Want to Read"}
                  </span>
                </label>

                {wantToReadError && (
                  <p className="book-detail-toggle-error" role="alert">
                    {wantToReadError}
                  </p>
                )}
              </aside>
            </div>

            <section className="book-detail-review">
              <h3>Review</h3>
              <p>{book.review}</p>
            </section>

            <footer className="book-detail-footer">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/books")}
              >
                Back
              </Button>

              <Button
                type="button"
                variant="primary"
                onClick={() => setShowConfirm(true)}
              >
                Delete
              </Button>
            </footer>
          </article>
        )}
      </div>

      {showConfirm && book && (
        <ConfirmDialog
          message="Are you sure you want to delete this book?"
          onConfirm={handleDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </Page>
  );
}

export default BookPage;

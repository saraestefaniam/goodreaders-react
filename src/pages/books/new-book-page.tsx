// src/pages/books/new-book-page.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Page from "../../components/ui/layout/page";
import Button from "../../components/ui/button";
import FormField from "../../components/ui/form-field";
import { createBook, getGenres } from "./service";
import type { Genres } from "./genres-type";
import { AxiosError } from "axios";
import "./new-book-page.css";

const FALLBACK_GENRES: Genres[] = [
  "fantasy",
  "science-fiction",
  "romance",
  "thriller",
  "non-fiction",
  "mystery",
  "other",
];

function NewBookPage() {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [review, setReview] = useState("");
  const [cover, setCover] = useState("");
  const [rating, setRating] = useState<number>(1);
  const [genres, setGenres] = useState<Genres[]>([]);
  const [availableGenres, setAvailableGenres] = useState<Genres[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    getGenres()
      .then((gs) => setAvailableGenres(gs))
      .catch(() => setAvailableGenres(FALLBACK_GENRES));
  }, []);

  const isFormValid =
    title.trim() &&
    author.trim() &&
    review.trim() &&
    rating >= 1 &&
    rating <= 5 &&
    genres.length > 0;

  const handleToggleGenre = (g: Genres) => {
    setGenres((prev) =>
      prev.includes(g) ? prev.filter((t) => t !== g) : [...prev, g],
    );
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isFormValid || submitting) return;

    setSubmitting(true);
    setErrorMsg(null);
    try {
      const payload = {
        title: title.trim(),
        author: author.trim(),
        review: review.trim(),
        genre: genres,
        rating,
        ...(description.trim() ? { description: description.trim() } : {}),
        ...(cover.trim() ? { cover: cover.trim() } : {}),
      };
      const created = await createBook(payload);
      navigate(`/books/${created.id}`);
    } catch (error) {
      if (error instanceof AxiosError && error.response?.status === 401) {
        navigate("/login", { replace: true });
      } else if (
        error instanceof AxiosError &&
        (error.response?.status === 400 || error.response?.status === 422)
      ) {
        setErrorMsg(
          "Please review the fields: rating (1–5), review and genre are required.",
        );
      } else {
        setErrorMsg("Unexpected error. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page title="Add a new book">
      {errorMsg && (
        <div role="alert" className="new-book-page-alert">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="new-book-page-form">
        <FormField
          label="Title *"
          type="text"
          name="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="The Way of Kings"
          required
          className="new-book-page-input"
        />

        <FormField
          label="Author *"
          type="text"
          name="author"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          placeholder="Brandon Sanderson"
          required
          className="new-book-page-input"
        />

        <label className="new-book-page-label">
          Description
          <textarea
            className="new-book-page-textarea"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Short synopsis or personal notes..."
          />
        </label>

        <label className="new-book-page-label">
          Review *
          <textarea
            className="new-book-page-textarea"
            rows={4}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="What did you think of the book?"
            required
          />
        </label>

        <FormField
          label="Cover (URL)"
          type="url"
          name="cover"
          value={cover}
          onChange={(e) => setCover(e.target.value)}
          placeholder="https://images.example.com/my-cover.jpg"
          className="new-book-page-input"
        />

        <fieldset className="new-book-page-fieldset">
          <legend className="new-book-page-legend">Genres *</legend>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {availableGenres.map((g) => (
              <label key={g} className="new-book-page-checkbox">
                <input
                  type="checkbox"
                  checked={genres.includes(g)}
                  onChange={() => handleToggleGenre(g)}
                />
                <span>#{g}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <label className="new-book-page-label">
          Rating (1-5) *
          <select
            className="new-book-page-select"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            required
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>

        <div className="new-book-page-footer">
          <Button
            type="submit"
            variant="primary"
            disabled={!isFormValid || submitting}
            className="new-book-page-submit"
          >
            {submitting ? "Creating..." : "Create book"}
          </Button>
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate("/books")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Page>
  );
}

export default NewBookPage;

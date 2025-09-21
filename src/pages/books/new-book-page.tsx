import { useEffect, useState } from "react";
import Page from "../../components/ui/layout/page";
import Button from "../../components/ui/button";
import { useNavigate } from "react-router-dom";
import { createBook, getGenres } from "./service";
import type { Genre } from "./genres-type";
import { AxiosError } from "axios";
import FormField from "../../components/ui/form-field";
import ErrorBoundary from "../../components/ui/errors/error-boundary";
import "./new-book-page.css";

function NewBookPage() {
  const [availableGenres, setAvailableGenres] = useState<Genre[]>([]);
  const [form, setForm] = useState<{
    title: string;
    author: string;
    description: string;
    review: string;
    cover: string;
    genre: Genre[];
    rating: number;
  }>({
    title: "",
    author: "",
    description: "",
    review: "",
    cover: "",
    genre: [],
    rating: 1,
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getGenres()
      .then((genres) => setAvailableGenres(genres))
      .catch((err) => console.error("Error loading genres:", err));
  }, []);

  const handleChange =
    (field: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, rating: Number(e.target.value) }));
  };

  const handleToggleGenre = (g: Genre) => {
    setForm((prev) => {
      const already = prev.genre.includes(g);
      return {
        ...prev,
        genre: already ? prev.genre.filter((x) => x !== g) : [...prev, g],
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSubmitting(true);
    try {
      const payload = {
        title: form.title.trim(),
        author: form.author.trim(),
        ...(form.description.trim()
          ? { description: form.description.trim() }
          : {}),
        review: form.review.trim(),
        ...(form.cover.trim() ? { cover: form.cover.trim() } : {}),
        genre: form.genre,
        rating: form.rating,
      };
      await createBook(payload);
      navigate("/books");
    } catch (err) {
      if (err instanceof AxiosError) {
        const status = err.response?.status;
        if (status === 401) {
          navigate("/login");
          return;
        }
        if (status === 400 || status === 422)
          setErrorMsg(
            "Please review the fields: rating (1–5), review and genre are required.",
          );
        else if (status === 404) setErrorMsg("Resource not found.");
        else setErrorMsg("Unexpected error. Please try again.");
      } else {
        setErrorMsg("Network or unexpected error. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Page title="Add a new book">
      <ErrorBoundary>
        {errorMsg && (
          <div role="alert" className="new-book-page-alert">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="new-book-page-form">
          <div>
            <FormField
              label="Title *"
              id="title"
              type="text"
              value={form.title}
              onChange={handleChange("title")}
              required
              placeholder="The Way of Kings"
              className="new-book-page-input"
            />
          </div>

          <div>
            <FormField
              label="Author *"
              id="author"
              type="text"
              value={form.author}
              onChange={handleChange("author")}
              required
              placeholder="Brandon Sanderson"
              className="new-book-page-input"
            />
          </div>

          <div>
            <label className="new-book-page-label" htmlFor="description">
              Description
              <textarea
                id="description"
                value={form.description}
                onChange={handleChange("description")}
                placeholder="Short synopsis or personal notes..."
                rows={4}
                className="new-book-page-textarea"
              />
            </label>
          </div>

          <div>
            <label className="new-book-page-label" htmlFor="review">
              Review *
              <textarea
                id="review"
                value={form.review}
                onChange={handleChange("review")}
                required
                placeholder="What did you think of the book?"
                rows={4}
                className="new-book-page-textarea"
              />
            </label>
          </div>

          <div>
            <FormField
              label="Cover (URL)"
              id="cover"
              type="url"
              value={form.cover}
              onChange={handleChange("cover")}
              placeholder="https://images.example.com/my-cover.jpg"
              className="new-book-page-input"
            />
          </div>

          <fieldset className="new-book-page-fieldset">
            <legend className="new-book-page-legend">Genres *</legend>
            <ErrorBoundary>
              {availableGenres.length === 0 ? (
                <p style={{ margin: 0, opacity: 0.7 }}>Loading genres…</p>
              ) : (
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {availableGenres.map((g) => (
                    <label key={g} className="new-book-page-checkbox">
                      <input
                        type="checkbox"
                        checked={form.genre.includes(g)}
                        onChange={() => handleToggleGenre(g)}
                      />
                      <span>#{g}</span>
                    </label>
                  ))}
                </div>
              )}
            </ErrorBoundary>
          </fieldset>

          <div>
            <label className="new-book-page-label" htmlFor="rating">
              Rating (1-5) *
              <select
                id="rating"
                value={form.rating}
                onChange={handleRatingChange}
                required
                className="new-book-page-select"
              >
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="new-book-page-footer">
            <Button
              variant="primary"
              type="submit"
              disabled={submitting}
              className="new-book-page-submit"
            >
              {submitting ? "Creating..." : "Create book"}
            </Button>
            <Button
              variant="secondary"
              type="button"
              onClick={() => navigate("/books")}
            >
              Cancel
            </Button>
          </div>
        </form>
      </ErrorBoundary>
    </Page>
  );
}

export default NewBookPage;

/// <reference types="@testing-library/jest-dom" />
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import type { Book } from "../type";
import BookItem from "../book-item";

const makeBook = (overrides: Partial<Book> = {}): Book => ({
  id: "b1",
  title: "The Way of Kings",
  author: "Brandon Sanderson",
  review: "Great book",
  genre: ["fantasy"],
  rating: 4,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  cover: undefined,
  ...overrides,
});

describe("BookItem", () => {
  it("renders title, author, rating and genres", () => {
    const book = makeBook({
      rating: 3,
      genre: ["fantasy", "romance"],
      cover: "https://example.com/cover.jpg",
    });

    render(<BookItem book={book} />);

    // Imagen con alt = título
    const img = screen.getByRole("img", {
      name: book.title,
    }) as HTMLImageElement;
    expect(img).toBeInTheDocument();
    expect(img.src).toContain("https://example.com/cover.jpg");

    // Título y autor
    expect(screen.getByText(book.title)).toBeInTheDocument();
    expect(screen.getByText(`by ${book.author}`)).toBeInTheDocument();

    // Rating (ARIA + title + estrellas)
    const ratingEl = screen.getByLabelText("Rating: 3 out of 5");
    expect(ratingEl).toBeInTheDocument();
    expect(screen.getByTitle("3/5")).toBeInTheDocument();
    expect(ratingEl).toHaveTextContent("★★★☆☆");

    // Géneros con prefijo #
    expect(screen.getByText("#fantasy")).toBeInTheDocument();
    expect(screen.getByText("#romance")).toBeInTheDocument();
  });

  it("Usa el fallback de picsum cuando no hay cover", () => {
    const book = makeBook({ cover: undefined });

    render(<BookItem book={book} />);

    const img = screen.getByRole("img", {
      name: book.title,
    }) as HTMLImageElement;
    expect(img.src).toContain("picsum.photos/id/24/400/400");
  });
});

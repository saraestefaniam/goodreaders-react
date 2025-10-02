/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import BooksPage from "../books-page";
import type { Book } from "../type";
import { MemoryRouter } from "react-router-dom";

const { mockNavigate } = vi.hoisted(() => ({
  mockNavigate: vi.fn(),
}));

vi.mock("../../index.css", () => ({}));
vi.mock("../book-item.css", () => ({}));

vi.mock("../service", () => ({
  getBooks: vi.fn(),
  getGenres: vi.fn(),
}));

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

import * as service from "../service";

describe("BooksPage", () => {
  const user = userEvent.setup();

  const booksFixture: Book[] = [
    {
      id: "1",
      title: "The Way of Kings",
      author: "Brandon Sanderson",
      description: "Epic fantasy",
      review: "Great!",
      cover: "",
      genre: ["fantasy"],
      rating: 5,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: "2",
      title: "Warbreaker",
      author: "Brandon Sanderson",
      description: "Colorful magic",
      review: "Lovely read",
      cover: "",
      genre: ["romance"],
      rating: 4,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    sessionStorage.clear();
  });

  it("renders books list and links to detail", async () => {
    (service.getBooks as Mock).mockResolvedValue(booksFixture);
    (service.getGenres as Mock).mockResolvedValue(["fantasy", "romance"]);

    render(
      <MemoryRouter initialEntries={["/books"]}>
        <BooksPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("The Way of Kings")).toBeInTheDocument();
    expect(screen.getByText("Warbreaker")).toBeInTheDocument();

    const link1 = screen.getByRole("link", { name: /the way of kings/i });
    const link2 = screen.getByRole("link", { name: /warbreaker/i });
    expect(link1).toHaveAttribute("href", "/books/1");
    expect(link2).toHaveAttribute("href", "/books/2");
  });

  it("filters by genre when a checkbox is toggled", async () => {
    (service.getBooks as Mock).mockResolvedValue(booksFixture);
    (service.getGenres as Mock).mockResolvedValue(["fantasy", "romance"]);

    render(
      <MemoryRouter>
        <BooksPage />
      </MemoryRouter>,
    );

    await screen.findByText("The Way of Kings");
    screen.getByText("Warbreaker");

    const fantasyCheckbox = screen.getByLabelText("fantasy");
    await user.click(fantasyCheckbox);

    expect(screen.getByText("The Way of Kings")).toBeInTheDocument();
    expect(screen.queryByText("Warbreaker")).not.toBeInTheDocument();

    await user.click(fantasyCheckbox);

    expect(screen.getByText("The Way of Kings")).toBeInTheDocument();
    expect(screen.getByText("Warbreaker")).toBeInTheDocument();
  });

  it("redirects to login when Add Book is clicked without auth", async () => {
    (service.getBooks as Mock).mockResolvedValue([]);
    (service.getGenres as Mock).mockResolvedValue(["fantasy"]);

    render(
      <MemoryRouter>
        <BooksPage />
      </MemoryRouter>,
    );

    expect(
      await screen.findByText(/No books yet\. Be the first to add one!/i),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /add book/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/login", {
      replace: true,
      state: { from: "/books/new" },
    });
  });

  it("navigates to /books/new when authenticated", async () => {
    (service.getBooks as Mock).mockResolvedValue([]);
    (service.getGenres as Mock).mockResolvedValue(["fantasy"]);
    localStorage.setItem("auth", "token");

    render(
      <MemoryRouter>
        <BooksPage />
      </MemoryRouter>,
    );

    await screen.findByText(/No books yet\. Be the first to add one!/i);

    await user.click(screen.getByRole("button", { name: /add book/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/books/new");
  });

  it("falls back to default genres when getGenres fails", async () => {
    (service.getBooks as Mock).mockResolvedValue(booksFixture);
    (service.getGenres as Mock).mockRejectedValue(new Error("boom genres"));

    render(
      <MemoryRouter>
        <BooksPage />
      </MemoryRouter>,
    );

    await screen.findByText("The Way of Kings");

    await waitFor(() => {
      expect(screen.getByLabelText("fantasy")).toBeInTheDocument();
      expect(screen.getByLabelText("science-fiction")).toBeInTheDocument();
      expect(screen.getByLabelText("romance")).toBeInTheDocument();
      expect(screen.getByLabelText("thriller")).toBeInTheDocument();
      expect(screen.getByLabelText("non-fiction")).toBeInTheDocument();
      expect(screen.getByLabelText("mystery")).toBeInTheDocument();
      expect(screen.getByLabelText("other")).toBeInTheDocument();
    });
  });
});

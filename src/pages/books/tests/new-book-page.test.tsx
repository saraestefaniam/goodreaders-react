// src/pages/books/tests/new-book-page.test.tsx
/// <reference types="@testing-library/jest-dom" />
import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import NewBookPage from "../new-book-page";
import * as service from "../service";

vi.mock("../new-book-page.css", () => ({}));
vi.mock("../../index.css", () => ({}));

const { mockNavigate } = vi.hoisted(() => ({ mockNavigate: vi.fn() }));
vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react-router-dom")>();
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock("../service", () => ({
  createBook: vi.fn(),
  getGenres: vi.fn(),
}));

describe("NewBookPage", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renderiza y usa géneros fallback cuando getGenres falla", async () => {
    (service.getGenres as Mock).mockRejectedValue(new Error("boom"));
    render(
      <MemoryRouter>
        <NewBookPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText(/Genres \*/i)).toBeInTheDocument();
    expect(screen.getByText("#fantasy")).toBeInTheDocument();
    expect(screen.getByText("#romance")).toBeInTheDocument();
  });

  it("envía el formulario y navega al detalle en caso de éxito", async () => {
    (service.getGenres as Mock).mockResolvedValue(["fantasy", "romance"]);
    (service.createBook as Mock).mockResolvedValue({ id: "abc123" });

    render(
      <MemoryRouter>
        <NewBookPage />
      </MemoryRouter>,
    );

    await screen.findByText("#fantasy");

    await user.type(screen.getByLabelText(/Title \*/i), " Warbreaker ");
    await user.type(screen.getByLabelText(/Author \*/i), " Brandon Sanderson ");
    await user.type(screen.getByLabelText(/Review \*/i), " Great book ");
    await user.click(screen.getByRole("checkbox", { name: "#fantasy" }));
    await user.selectOptions(screen.getByLabelText(/Rating/i), "5");

    await user.click(screen.getByRole("button", { name: /Create book/i }));

    expect(service.createBook).toHaveBeenCalledWith({
      title: "Warbreaker",
      author: "Brandon Sanderson",
      review: "Great book",
      genre: ["fantasy"],
      rating: 5,
    });
    expect(mockNavigate).toHaveBeenCalledWith("/books/abc123");
  });
});

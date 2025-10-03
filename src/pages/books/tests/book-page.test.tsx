/// <reference types="@testing-library/jest-dom" />

import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { AxiosError, type AxiosResponse } from "axios";
import type { Book } from "../type";
import BookPage from "../book-page";

vi.mock("../book-item.css", () => ({}));

vi.mock("../service", () => ({
  getBook: vi.fn(),
  deleteBook: vi.fn(),
  updateWantToReadStatus: vi.fn(),
  getWantToReadStatus: vi.fn(),
}));

const mockNavigate = vi.fn();
const mockUseParams = vi.fn(() => ({ bookId: "1" }));
vi.mock("react-router-dom", async () => {
  const actual =
    await vi.importActual<typeof import("react-router-dom")>(
      "react-router-dom",
    );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockUseParams(),
  };
});

vi.mock("../../../components/ui/layout/confirm-dialog", () => ({
  default: ({
    message,
    onConfirm,
    onCancel,
  }: {
    message: string;
    onConfirm: () => void;
    onCancel: () => void;
  }) => (
    <div data-testid="confirm-dialog">
      <p>{message}</p>
      <button onClick={onCancel}>Cancel</button>
      <button onClick={onConfirm}>Confirm</button>
    </div>
  ),
}));

import * as service from "../service";

function makeAxiosError(status: number, statusText = ""): AxiosError {
  const err = new AxiosError(
    statusText || String(status),
    "ERR_BAD_RESPONSE",
  ) as AxiosError & { response: Partial<AxiosResponse> };
  err.response = { status, statusText } as AxiosResponse;
  return err;
}

describe("BookPage", () => {
  const user = userEvent.setup();

  const bookFixture: Book = {
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
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseParams.mockReturnValue({ bookId: "1" });
    (service.getWantToReadStatus as Mock).mockResolvedValue({
      bookId: "1",
      wantToRead: false,
    });
    (service.updateWantToReadStatus as Mock).mockResolvedValue(undefined);
  });

  it("renders the book detail when getBook succeeds", async () => {
    (service.getBook as Mock).mockResolvedValue(bookFixture);

    render(
      <MemoryRouter initialEntries={["/books/1"]}>
        <BookPage />
      </MemoryRouter>,
    );

    expect(await screen.findByText("The Way of Kings")).toBeInTheDocument();
    expect(screen.getByText("Brandon Sanderson")).toBeInTheDocument();
    expect(screen.getByText("★★★★★")).toBeInTheDocument();
    expect(screen.getByText("#fantasy")).toBeInTheDocument();
  });

  it("navigates to /404 when getBook returns 404", async () => {
    (service.getBook as Mock).mockRejectedValue(
      makeAxiosError(404, "Not Found"),
    );

    render(
      <MemoryRouter>
        <BookPage />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/404");
    });
  });

  it("deletes the book after confirming and navigates to /books", async () => {
    (service.getBook as Mock).mockResolvedValue(bookFixture);
    (service.deleteBook as Mock).mockResolvedValue(undefined);

    render(
      <MemoryRouter>
        <BookPage />
      </MemoryRouter>,
    );

    await screen.findByText("The Way of Kings");
    await user.click(screen.getByRole("button", { name: /delete/i }));
    expect(screen.getByTestId("confirm-dialog")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /confirm/i }));

    expect(service.deleteBook).toHaveBeenCalledWith("1");
    expect(mockNavigate).toHaveBeenCalledWith("/books");
  });

  it("does not delete or navigate when cancel is clicked", async () => {
    (service.getBook as Mock).mockResolvedValue(bookFixture);

    render(
      <MemoryRouter>
        <BookPage />
      </MemoryRouter>,
    );

    await screen.findByText("The Way of Kings");
    await user.click(screen.getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /cancel/i }));

    expect(service.deleteBook).not.toHaveBeenCalled();
    expect(mockNavigate).not.toHaveBeenCalledWith("/books");
  });

  it("redirects to /login when deleteBook returns 401", async () => {
    (service.getBook as Mock).mockResolvedValue(bookFixture);
    (service.deleteBook as Mock).mockRejectedValue(
      makeAxiosError(401, "Unauthorized"),
    );

    render(
      <MemoryRouter>
        <BookPage />
      </MemoryRouter>,
    );

    await screen.findByText("The Way of Kings");
    await user.click(screen.getByRole("button", { name: /delete/i }));
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });
});

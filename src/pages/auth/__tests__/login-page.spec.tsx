// src/pages/auth/__tests__/login-page.spec.tsx
import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import LoginPage from "../login-page";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { loginUser } from "../../../store/thunks/authThunks";
import storage from "../../../utils/storage";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../../store/hooks", () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock("../../../store/thunks/authThunks", () => ({
  loginUser: vi.fn(),
}));

vi.mock("../../../utils/storage", () => ({
  default: {
    set: vi.fn(),
    get: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// -------------------------
// TESTS
// -------------------------

describe("LoginPage", () => {
  const dispatchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    // Mock hooks
    (useAppDispatch as any).mockReturnValue(dispatchMock);
    (useAppSelector as any).mockImplementation((selector: any) =>
      selector({ auth: { loading: false, error: null } }),
    );
  });

  it("should render the login form correctly", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/remember me/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
  });

  it("should enable submit button when form is filled", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "123456" },
    });

    expect(screen.getByRole("button", { name: /login/i })).toBeEnabled();
  });

  it("should call loginUser thunk, saves token, and navigates on successful login", async () => {
    // Mock del thunk para fulfilled.match
    (loginUser as any).fulfilled = { match: (__action: any) => true };

    // Mock dispatch para devolver payload
    dispatchMock.mockResolvedValue({ payload: { token: "fake-token" } });

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    // Llenar formulario
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: "123456" },
    });
    fireEvent.click(screen.getByLabelText(/remember me/i));
    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    // Esperamos resultados
    await waitFor(() => {
      expect(dispatchMock).toHaveBeenCalledWith(
        loginUser({ email: "test@example.com", password: "123456" }),
      );
      expect(storage.set).toHaveBeenCalledWith("auth", "fake-token", true);
      expect(mockNavigate).toHaveBeenCalledWith("/", { replace: true });
    });
  });

  it("shows error message if there is an error", () => {
    (useAppSelector as any).mockImplementation((selector: any) =>
      selector({ auth: { loading: false, error: "Invalid credentials" } }),
    );

    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>,
    );

    expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
  });
});

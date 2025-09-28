// src/pages/auth/__tests__/login-page.spec.tsx
import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import CreateUserPage from "../create-user-page";
import { useAppSelector, useAppDispatch } from "../../../store/hooks";
import { createUser } from "../../../store/thunks/authThunks";
import { MemoryRouter } from "react-router-dom";

vi.mock("../../../store/hooks", () => ({
  useAppDispatch: vi.fn(),
  useAppSelector: vi.fn(),
}));

vi.mock("../../../store/thunks/authThunks", () => ({
  createUser: vi.fn(),
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

describe("CreateUserPage", () => {
  const dispatchMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();

    (useAppDispatch as any).mockReturnValue(dispatchMock);
    (useAppSelector as any).mockImplementation((selector: any) =>
      selector({ auth: { loading: false, error: null } }),
    );
  });

  afterEach(() => {
    vi.useRealTimers();
  })

  it("should render the create user form correctly", () => {
    render(
      <MemoryRouter>
        <CreateUserPage />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("textbox", { name: /username/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: /email/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/repeat password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/avatar/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Create user/i })).toBeEnabled();
  });

  it("should call  createUser thunk, show success message and navigate to login", async () => {
    const fakeUser = {
      name: "Juan",
      email: "juan@example.com",
      password: "123456",
    };

    (createUser as any).mockImplementation((data: any) => {
        return async (__dispatch: any) => {
            const action = {payload: data, type: "auth/createUser/fulfilled"};
            (createUser as any).fulfilled = {
                match: (a: any) => a.type === action.type,
            };
            return action;
        };
    })

    dispatchMock.mockImplementation(async (fn: any) => {
        return await fn(dispatchMock);
    })

    render(
      <MemoryRouter>
        <CreateUserPage />
      </MemoryRouter>,
    );

    //filling form
    fireEvent.change(screen.getByRole("textbox", { name: /username/i }), {
      target: { value: fakeUser.name },
    });
    fireEvent.change(screen.getByRole("textbox", { name: /email/i }), {
      target: { value: fakeUser.email },
    });
    fireEvent.change(screen.getByLabelText(/^password/i), {
      target: { value: fakeUser.password },
    });
    fireEvent.change(screen.getByLabelText(/repeat password/i), {
      target: { value: fakeUser.password },
    });

    //send form
    fireEvent.click(screen.getByRole("button", { name: /create user/i }));

    await waitFor( async () => {

      expect(
        screen.getByText(/User created successfully, redirecting to login.../i),
      ).toBeInTheDocument();

      expect(mockNavigate).not.toHaveBeenCalled();
    });
    vi.advanceTimersByTime(3000)
    await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith("/login")
    })
  });
});

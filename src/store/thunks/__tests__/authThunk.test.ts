import { describe, it, expect, vi } from "vitest";
import { createUser, loginUser } from "../authThunks";
import api from "../../../api/client";

vi.mock("../../../api/client", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("loginUser thunk", () => {
  it("should return token when login is successful", async () => {
    (api.post as any).mockResolvedValueOnce({
      data: { access_token: "fake_token" },
    });

    const dispatch = vi.fn();
    const thunk = loginUser({ email: "test@test.com", password: "1234" });
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.type).toBe("auth/login/fulfilled");
    expect(result.payload).toEqual({ token: "fake_token" });
  });

  it("should return error message when login fails", async () => {
    (api.post as any).mockRejectedValueOnce({
      response: { data: { message: "Something went worng" } },
    });

    const dispatch = vi.fn();
    const thunk = loginUser({ email: "test@test.com", password: "123456" });
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.type).toBe("auth/login/rejected");
    expect(result.payload).toBe("Something went wrong");
  });
  it("should handle unexpected errors", async () => {
    (api.post as any).mockRejectedValueOnce(new Error("Network error"));

    const dispatch = vi.fn();
    const thunk = loginUser({ email: "x", password: "y" });
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(result.type).toBe("auth/login/rejected");
    expect(result.payload).toBe("Something went wrong");
  });
});

describe("createUser thunk", () => {
  it("shoudl return object of user when creation is successfull", async () => {
    (api.post as any).mockResolvedValueOnce({
      data: {
        user: { name: "Juan", email: "juan@example.com", password: "1234" },
      },
    });

    const dispatch = vi.fn();
    const thunk = createUser({
      name: "Juan",
      email: "juan@example.com",
      password: "1234",
    });
    const result = await thunk(dispatch, () => ({}), undefined);

    expect(api.post).toHaveBeenCalledWith("/api/v1/users", {
      name: "Juan",
      email: "juan@example.com",
      password: "1234",
    });

    expect(result.type).toBe("auth/createUser/fulfilled");
    expect(result.payload).toEqual({
      user: { name: "Juan", email: "juan@example.com", password: "1234" },
    });
  });

  it("should return error message when createuser fails", async () => {
    (api.post as any).mockRejectedValueOnce({
      response: { data: { message: "Something went wrong, try again later" } }
    })

    const disptach = vi.fn()
    const thunk = createUser({ name: "Juan", email: "juan@example.com", password: "1234" })
    const result = await thunk(disptach, () => ({}), undefined)

    expect(result.type).toBe("auth/createUser/rejected")

  })

  it("should handle unexpected errors", async () => {
    (api.post as any).mockRejectedValueOnce(new Error("Network error"))

    const dispatch = vi.fn()
    const thunk = createUser({ name: "Juan", email: "juan@example.com", password: "1234" })
    const result = await thunk(dispatch, () => ({}), undefined)

    expect(result.type).toBe("auth/createUser/rejected")
    expect(result.payload).toBe("Something went wrong, try again later")
  })
});

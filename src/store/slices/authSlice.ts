import { createSlice } from "@reduxjs/toolkit";
import type { User } from "../../pages/auth/userType";
import { loginUser, createUser } from "../thunks/authThunks";
import storage from "../../utils/storage";
import {
  removeAuthorizationHeader,
  setAuthorizationHeader,
} from "../../api/client";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const storedUser = storage.get("user")

const initialState: AuthState = {
  user: storedUser ? (JSON.parse(storedUser) as User): null,
  token: storage.get("auth"),
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      storage.remove("auth");
      storage.remove("user")
      removeAuthorizationHeader();
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.token = action.payload.token;
      state.user = action.payload.user
      storage.set("auth", action.payload.token)
      storage.set("user", JSON.stringify(action.payload.user))
      setAuthorizationHeader(action.payload.token);
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;

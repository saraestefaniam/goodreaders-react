import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";
import axios from "axios";
import type { User } from "../../pages/auth/userType";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  access_token: string;
  user: User;
}

type CreateUserPayload =
  | {
      name: string;
      email: string;
      password: string;
      avatar?: File | Blob | string;
    }
  | FormData;

export const loginUser = createAsyncThunk(
  "auth/login",
  async (loginData: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await api.post<LoginResponse>(
        "/api/v1/auth/login",
        loginData,
      );
      const token = response.data.access_token;
      const user = response.data.user;
      return { token, user };
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(error.response.data.message || "Error login");
      }
      return rejectWithValue("Something went wrong");
    }
  },
);

export const createUser = createAsyncThunk(
  "auth/createUser",
  async (userData: CreateUserPayload, { rejectWithValue }) => {
    try {
      let payload: FormData;
      if (userData instanceof FormData) {
        payload = userData;
      } else {
        payload = new FormData();
        payload.append("name", userData.name);
        payload.append("email", userData.email);
        payload.append("password", userData.password);
        if (userData.avatar instanceof Blob) {
          payload.append("avatar", userData.avatar);
        } else if (userData.avatar) {
          payload.append("avatar", userData.avatar);
        }
      }

      const response = await api.post<User>("/api/v1/users", payload);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Error creating user",
        );
      }
      return rejectWithValue("Something went wrong, try again later");
    }
  },
);

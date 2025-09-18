import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/client";
import axios from "axios";
import type { User } from "../../pages/auth/userType";

interface LoginPayload {
  email: string;
  password: string;
}

interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export const loginUser = createAsyncThunk(
  "auth/login",
  async (loginData: LoginPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("auth/login", loginData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        rejectWithValue(error.response.data.message || "Error login");
      }
      return rejectWithValue("Something went wrong");
    }
  },
);

export const createUser = createAsyncThunk(
  "auth/createUser",
  async (userData: CreateUserPayload, { rejectWithValue }) => {
    try {
      const response = await api.post<User>("/users", userData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return rejectWithValue(
          error.response.data.message || "Error creating user",
        );
      }
      return rejectWithValue("Something went wrong");
    }
  },
);

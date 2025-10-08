import axios from "axios";
import storage from "../utils/storage";
import type { Book } from "../pages/books/type";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const setAuthorizationHeader = (accessToken: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
};

export const removeAuthorizationHeader = () => {
  delete api.defaults.headers.common["Authorization"];
};

const storedToken = storage.get("auth");
if (storedToken) {
  setAuthorizationHeader(storedToken);
}

export const getWantToReadBooks = async (): Promise<Book[]> => {
  const { data } = await api.get<Book[]>("/api/v1/books/want-to-read");
  return data;
};

export default api;

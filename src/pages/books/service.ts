//import { client } from "../../api/client"; // Tipo Book para tipado
import type { Genre } from "./genres-type";
import type { Book } from "./type";

const BOOKS_URL = "/api/books"; // hay que ajustarla segun backend

// GET lista
export const getBooks = async () => {
  const response = await client.get<Book[]>(BOOKS_URL);
  return response.data;
};

// GET detalle
export const getBook = async (bookId: string) => {
  const response = await client.get<Book>(`${BOOKS_URL}/${bookId}`);
  return response.data;
};

// POST
export const createBook = async (bookData: FormData) => {
  const response = await client.post(BOOKS_URL, bookData, {
    // ajustarlo a lo que envie el backend
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

// DELETE
export const deleteBook = async (bookId: string) => {
  const url = `${BOOKS_URL}/${bookId}`;
  await client.delete(url);
};

// Get Genres
export const getGenres = async () => {
  const response = await client.get<Genre[]>("/api/genres"); // ajusta si el endpoint es diferente
  return response.data;
};

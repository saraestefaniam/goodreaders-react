import api from "../../api/client";
import type { Book, BooksListResponse, WantToReadStatus } from "./type";
import type { Genres } from "./genres-type";

const BOOKS_URL = "api/v1/books";

// GET lista paginada con filtro opcional de géneros
export const getBooksWithPagination = async (
  page: number,
  limit: number,
  genres?: string[],
): Promise<BooksListResponse> => {
  let url = `${BOOKS_URL}?page=${page}&limit=${limit}`;
  if (genres && genres.length > 0) {
    url += `&genres=${genres.join(",")}`;
  }
  const { data } = await api.get<BooksListResponse>(url);
  return data;
};

// GET detalle
export const getBook = async (bookId: string) => {
  const response = await api.get<Book>(`${BOOKS_URL}/${bookId}`);
  return response.data;
};

// POST crear libro
export const createBook = async (payload: {
  title: string;
  author: string;
  description?: string;
  review: string;
  cover?: string;
  genre: string[];
  rating: number;
}) => {
  const res = await api.post<Book>(BOOKS_URL, payload);
  return res.data;
};

// DELETE libro
export const deleteBook = async (bookId: string) => {
  const url = `${BOOKS_URL}/${bookId}`;
  await api.delete(url);
};

// PATCH marcar como quiero leer
export const markWantToRead = async (bookId: string) => {
  await api.patch(`${BOOKS_URL}/${bookId}/want-to-read`);
};

// PATCH desmarcar como quiero leer
export const unmarkWantToRead = async (bookId: string) => {
  await api.patch(`${BOOKS_URL}/${bookId}/unmark-want-to-read`);
};

// GET estado Want to read
export const getWantToReadStatus = async (bookId: string) => {
  const { data } = await api.get<WantToReadStatus>(
    `${BOOKS_URL}/${bookId}/want-to-read-status`, 
  );
  return data;
};

// GET géneros disponibles
export const getGenres = async (): Promise<Genres[]> => {
  const { data } = await api.get<Genres[]>(`${BOOKS_URL}/genres`);
  return data;
};

// SEARCH libros por título o autor
export const searchBooks = async (
  query: string,
): Promise<BooksListResponse> => {
  const { data } = await api.get<BooksListResponse>(`${BOOKS_URL}/search`, {
    params: { q: query },
  });
  return data;
};
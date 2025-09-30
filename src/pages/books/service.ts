import api from "../../api/client";
import type { Book } from "./type";
import type { Genres } from "./genres-type";

const BOOKS_URL = "api/v1/books";
const LIMIT = 4;

//Types
export interface PaginatedBooks {
  items: Book[];
  page: number;
  pages: number;
}

// GET lista paginada
export const getBooks = async (
  page = 1,
  limit = LIMIT,
): Promise<PaginatedBooks> => {
  const { data } = await api.get<PaginatedBooks>(
    `${BOOKS_URL}?page=${page}&limit=${limit}`,
  );
  return data;
};

// GET detalle
export const getBook = async (bookId: string) => {
  const { data } = await api.get<Book>(`${BOOKS_URL}/${bookId}`);
  return data;
};

// POST
export const createBook = async (payload: {
  title: string;
  author: string;
  description?: string;
  review: string;
  cover?: string;        
  genre: string[];
  rating: number;        
}) => {
  const { data } = await api.post<Book>(BOOKS_URL, payload);
  return data;
};

// DELETE
export const deleteBook = async (bookId: string) => {
  const url = `${BOOKS_URL}/${bookId}`;
  await api.delete(url);
};

// GET Genres
export const getGenres = async (): Promise<Genres[]> => {
  const { data } = await api.get<Genres[]>(`${BOOKS_URL}/genres`);
  return data;
};

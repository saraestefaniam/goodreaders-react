import api from "../../api/client";
import type { Book } from "./type";
import type { Genres } from "./genres-type";

const BOOKS_URL = "api/v1/books"; 
const WANT_TO_READ_URL = "api/v1/users/want-to-read";

// GET lista 
export const getBooks = async () => {
  const response = await api.get<Book[]>(BOOKS_URL);
  return response.data;
};

// GET detalle
export const getBook = async (bookId: string) => {
  const response = await api.get<Book>(`${BOOKS_URL}/${bookId}`);
  return response.data;
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
  const res = await api.post<Book>(BOOKS_URL, payload); 
  return res.data;
};

// DELETE
export const deleteBook = async (bookId: string) => {
  const url = `${BOOKS_URL}/${bookId}`;
  await api.delete(url);
};

export const updateWantToReadStatus = async (
  bookId: string,
  wantToRead: boolean,
) => {
  await api.patch(`${WANT_TO_READ_URL}/${bookId}`, { wantToRead });
};

// GET Genres
export const getGenres = async (): Promise<Genres[]> => {
  const { data } = await api.get<Genres[]>(`${BOOKS_URL}/genres`);
  return data;
};

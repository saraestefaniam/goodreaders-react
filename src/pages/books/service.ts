import api from "../../api/client";
import type { Book } from "./type";
import { VALID_GENRES } from "./genres-type";
import type { Genre } from "./genres-type";

const BOOKS_URL = "/api/v1/books"; 

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
  wantToRead?: boolean;  
  rating: number;        
}) => {
  const res = await api.post<Book>(BOOKS_URL, payload); // JSON, no FormData
  return res.data;
};

// DELETE
export const deleteBook = async (bookId: string) => {
  const url = `${BOOKS_URL}/${bookId}`;
  await api.delete(url);
};

// GET Genres
export const getGenres = async (): Promise<Genre[]> => {
  return [...VALID_GENRES];
};

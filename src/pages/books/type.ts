import type { Genres } from "./genres-type";

export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  review: string;
  cover?: string;
  genre: Genres[];
  rating: Rating;
  wantToRead?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface WantToReadStatus {
  bookId: string;
  wantToRead: boolean;
}

import type { Genre } from "./genres-type";

export type Rating = 1 | 2 | 3 | 4 | 5;

export interface Book {
  id: string;
  title: string;
  author: string;
  description?: string;
  review: string;
  cover?: string;
  genre: Genre[];
  rating: Rating;
  createdAt: string;
  updatedAt: string;
}

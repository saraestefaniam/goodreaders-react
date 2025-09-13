import type { Genre } from "./genres-type";

export interface Book {
  id: string;               
  title: string;            
  author: string;           
  description?: string;     
  cover?: string;           
  genre: Genre[];          
  wantToRead: boolean;      
  createdAt: string;       
  updatedAt: string;       
}
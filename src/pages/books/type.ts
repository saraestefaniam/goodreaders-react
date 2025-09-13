export interface Book {
  id: string;               
  title: string;            
  author: string;           
  description?: string;     
  cover?: string;           
  genre: string[];          
  wantToRead: boolean;      
  createdAt: string;       
  updatedAt: string;       
}
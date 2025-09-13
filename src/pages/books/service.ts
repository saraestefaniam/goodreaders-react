import { client } from "../../api/client"; // Tipo Book para tipado

const BOOKS_URL = "/api/books"; // hay que ajustarla segun backend 

// GET
export const getLatestBooks = async () => {
  const response = await client.get<Book[]>(BOOKS_URL);
  return response.data;
};

// POST
export const createBook = async (bookData: FormData) => {
  const response = await client.post(BOOKS_URL, bookData, { // ajustarlo a lo que envie el backend
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
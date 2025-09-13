import "./books-page.css";
import clsx from "clsx";
import styles from "./books-page.module.css";
import Button from "../../components/button";
import { getLatestBooks } from "./auth/service";
import { useEffect, useState } from "react";
import type { Book } from "./types";

interface BooksPageProps {
  active: boolean;
}

function BooksPage({ active }: BooksPageProps) {
  const [books, setBooks] = useState<Book[]>([]);

  useEffect(() => {
    async function getBooks() {
      const books = await getLatestBooks();
      setBooks(books);
    }
    getBooks();
  }, []);

  return (
    <div className={clsx(styles["books-page"], { active })}>
      <h1 style={{ color: "orange", backgroundColor: "green" }}>
        Books Page
      </h1>
      <ul className="flex flex-col text-green-900">
        {books.map((book) => (
          <li key={book.id}>{book.title}</li>
        ))}
      </ul>
      <Button disabled={false} $variant="secondary">
        Click me
      </Button>
    </div>
  );
}

export default BooksPage;
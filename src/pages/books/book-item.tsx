import "./book-item.css";
import type { Book } from "./type";

interface BookItemProps {
  book: Book;
}
// Componente para mostrar un libro individual

const BookItem = ({ book }: BookItemProps) => {
  const { title, author, genre, cover, wantToRead } = book;

  return (
    <article className="book-item">
      <img
        src={cover || "/descarga.png"}
        alt={title}
        className="book-item-image"
      />
      <div className="book-item-details">
        <h2 className="book-item-title">{title}</h2>
        <p className="book-item-author">by {author}</p>
        <div className="book-item-genres">
          {genre.map((g) => (
            <span key={g} className="book-item-genre">
              #{g}
            </span>
          ))}
        </div>
        <p className="book-item-status">
          {wantToRead ? "Want to read" : "Already read"}
        </p>
      </div>
    </article>
  );
};

export default BookItem;
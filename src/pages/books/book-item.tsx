import "./book-item.css";
import type { Book } from "./type";

interface BookItemProps {
  book: Book;
}

const BookItem = ({ book }: BookItemProps) => {
  const { title, author, genre, cover, rating } = book;
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);

  return (
    <article className="book-item">
      <img
        src={cover || "/descarga.png"}
        alt={title}
        className="book-item-image"
        loading="lazy"
      />

      <div className="book-item-details">
        <h2 className="book-item-title">{title}</h2>
        <p className="book-item-author">by {author}</p>

        <div
          className="book-item-rating"
          aria-label={`Rating: ${rating} out of 5`}
          title={`${rating}/5`}
        >
          {stars}
        </div>

        <div className="book-item-genres">
          {genre.map((g) => (
            <span key={g} className="book-item-genre">
              #{g}
            </span>
          ))}
        </div>
      </div>
    </article>
  );
};

export default BookItem;

import "./book-item.css";
import coverPlaceholder from "../../assets/cover_book_placeholder.jpg";
import type { Book } from "./type";

interface BookItemProps {
  book: Book;
}

const BookItem = ({ book }: BookItemProps) => {
  const { title, author, genre, cover, rating } = book;
  const coverUrl = cover ?? coverPlaceholder;
  const genreList = genre.length ? genre : ["other"];
  const primaryGenre = genreList[0];
  const additionalGenres = genreList.slice(1);
  const stars = "★".repeat(rating) + "☆".repeat(5 - rating);
  const summaryText = additionalGenres.length
    ? `Also explores ${additionalGenres.join(" • ")}`
    : `A ${primaryGenre} tale for curious readers.`;

  return (
    <article className="book-item">
      <div
        className="book-item-media"
        role="img"
        aria-label={`Cover art for ${title}`}
        style={{ backgroundImage: `url(${coverUrl})` }}
      ></div>

      <div className="book-item-details">
        <h2 className="book-item-title">{title}</h2>
        <p className="book-item-author">by {author}</p>

        <div
          className="book-item-rating"
          aria-label={`Rating: ${rating} out of 5`}
        >
          {stars}
        </div>

        <p className="book-item-summary">{summaryText}</p>

        <div className="book-item-genres">
          {genreList.map((g) => (
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

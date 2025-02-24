import React from 'react';
import { Link } from 'react-router-dom';

const BookCard = ({ book }) => {
  if (!book) {
    return <p className="text-center text-red-500">No book data available</p>;
  }

  return (
    <div className="p-4 border border-gray-300 w-64 shadow-md hover:scale-105 transition-transform cursor-pointer rounded-lg">
      {/* Newly added tag */}
      {book.isNew && (
        <p className="bg-black text-white text-xs px-2 py-1 font-light w-fit rounded-md mb-2">
          Newly Added
        </p>
      )}

      {/* Book Image with Placeholder */}
      <img
        src={book.book_image || "https://via.placeholder.com/150"}
        alt="book cover"
        className="w-full h-40 object-cover rounded-md"
      />

      {/* Book Title */}
      <h3 className="font-semibold text-lg mt-3 truncate">
        {book.book_name || "Unknown Title"}
      </h3>

      {/* Book Publisher */}
      <div className="flex gap-2 items-center mt-2">
        <p className="bg-blue-100 border border-blue-300 p-1 text-xs font-light rounded-md">
          Publisher
        </p>
        <p className="text-gray-500 font-medium text-sm">
          {book.book_publisher || "Unknown Publisher"}
        </p>
      </div>

      {/* Book Launch Date */}
      <p className="text-sm font-light mt-2 text-gray-600">
        Launch Date:{" "}
        <span className="font-medium">
          {book.book_launch_date ? new Date(book.book_launch_date).toDateString() : "N/A"}
        </span>
      </p>

      {/* View Details Button */}
      <Link to={`/books/${book.book_id}`}>
        <button className="mt-3 w-full py-2 bg-black text-white text-xs font-medium rounded-md hover:bg-gray-800 transition">
          View Details
        </button>
      </Link>
    </div>
  );
};

export default BookCard;

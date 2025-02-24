import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import BookCard from "./BookCard";
import LoadingSpinner from './LoadingSpinner';
import { useParams } from 'react-router-dom';

const BookPage = () => {
  const { catergory } = useParams();
  const bookDatas = useSelector(state => state.book);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time for Redux data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSpinner />;

  if (!bookDatas || !Array.isArray(bookDatas)) {
    return <div className="text-red-500 text-center p-4">No books available.</div>;
  }

  const filterBook = bookDatas.filter((book) => 
    book.book_cat_id && book.book_cat_id.toLowerCase() === catergory.toLowerCase()
  );

  return (
    <div className='p-10'>
      <h2 className='font-medium text-3xl'>Books on {catergory}</h2>
      <div className='mt-6 flex flex-wrap gap-5 items-center'>
        {filterBook.length > 0 ? (
          filterBook.map((book) => (
            <BookCard 
              key={book.book_id} 
              book={{
                book_id: book.book_id,
                book_name: book.book_name,
                book_publisher: book.book_publisher,
                book_launch_date: book.book_launch_date,
                book_image: book.book_image || "https://via.placeholder.com/150"
              }} 
            />
          ))
        ) : (
          <div className="text-gray-500 text-center w-full p-4">
            No books found in this category.
          </div>
        )}
      </div>
    </div>
  );
};

export default BookPage;

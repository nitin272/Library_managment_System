import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import left_icon from '../../assets/left_icon.svg';

const BookDetail = () => {
  const { id } = useParams();
  const [bookData, setBookData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`http://localhost:4000/books/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch book details');
        }
        const data = await response.json();
        setBookData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [id]);

  if (loading) return <p className="text-center text-lg">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;
  if (!bookData) return <p className="text-center text-gray-500">Book not found.</p>;

  return (
    <section className="p-5">
      <Link to="/browsebook">
        <button className="px-3 py-1">
          <img src={left_icon} alt="Go Back" className="w-7 h-7" />
        </button>
      </Link>
      <div className="flex md:flex-row flex-col justify-center gap-10 p-5 mt-5">
        <img src={bookData.book_image || "https://via.placeholder.com/150"} alt="Book Cover" className="h-80 w-96 object-cover" />
        <div>
          <h2 className="font-semibold font-Poppins text-4xl mb-2">Title: {bookData.book_name}</h2>
          <p className="font-base font-Poppins text-xl mb-2">Description: {bookData.book_description}</p>
          <h4 className="text-lg font-semibold font-Poppins mb-2">
            <span className="px-2 py-1 bg-black text-white font-medium text-base font-Poppins">Author</span>: {bookData.book_author}
          </h4>
          <p className="font-Poppins text-md font-medium mt-1 text-orange-500">Ratings: {bookData.book_rating}+</p>
        </div>
      </div>
    </section>
  );
};

export default BookDetail;

import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BookCard from './BookCard';
import LoadingSpinner from './LoadingSpinner';
import axios from 'axios';

const Booksdata = ({ title, inputValue }) => {
    const [bookData, setBookData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                setLoading(true);
                const authResponse = await axios.get('http://localhost:5000/login-success', {
                    withCredentials: true
                });

                if (!authResponse.data.success) {
                    navigate('/login');
                    return;
                }

                const response = await axios.get('http://localhost:5000/books', {
                    withCredentials: true
                });
                setBookData(response.data);
            } catch (err) {
                if (err.response?.status === 401) {
                    navigate('/login');
                } else {
                    console.error('Error fetching books:', err);
                    setError('Failed to fetch books');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBooks();
    }, [navigate]);

    const searchedValue = inputValue ? inputValue.toLowerCase() : '';
    const filterData = bookData.filter((book) => (
        (book.book_name && book.book_name.toLowerCase().includes(searchedValue)) || 
        (book.book_publisher && book.book_publisher.toLowerCase().includes(searchedValue))
    ));

    if (loading) return <LoadingSpinner />;
    if (error) return <div className="text-red-500 text-center p-4">{error}</div>;

    return (
        <div className='mt-10 p-5'>
            <div className='flex justify-between items-center'>
                <h2 className='font-Poppins font-medium text-3xl'>{title || 'Popular Books'}</h2>
                {!title && (
                    <Link to='/browsebook'>
                        <p className='text-black font-normal text-base underline underline-offset-1'>View more</p>
                    </Link>
                )}
            </div>
            <div className="flex flex-wrap justify-center gap-5 mt-8">
                {filterData.length > 0 ? (
                    filterData.map((book) => (
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
                    <p className="text-gray-500 text-center p-4">No books found</p>
                )}
            </div>
        </div>
    );
};

export default Booksdata;

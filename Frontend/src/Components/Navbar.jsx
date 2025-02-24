import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { HiOutlineMenu } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import axios from '../utils/axios';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [user, setUser] = useState(null);
    const [scrolled, setScrolled] = useState(false);
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axios.get('/user', { 
                    withCredentials: true 
                });
                if (response.data.user) {
                    const userData = response.data.user;
                    if (userData.ownerImg && Array.isArray(userData.ownerImg)) {
                        userData.ownerImg = userData.ownerImg.map(img => 
                            img.startsWith('http') ? img : `${process.env.REACT_APP_API_URL}/${img}`
                        );
                    }
                    setUser(userData);
                }
            } catch (error) {
                console.error('Authentication error:', error);
                setUser(null);
            }
        };
        checkAuth();
    }, []);

    const handleLogout = async () => {
        try {
            const response = await axios.get('/logout', { 
                withCredentials: true 
            });

            if (response.data.success) {
                setUser(null);
                localStorage.removeItem('user');
                sessionStorage.clear();
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleImageError = () => {
        setImageError(true);
    };

    const renderUserAvatar = () => {
        if (!user?.ownerImg?.[0] || imageError) {
            return (
                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <FaUserCircle className="w-8 h-8 text-gray-500" />
                </div>
            );
        }

        return (
            <div className="w-10 h-10 rounded-full overflow-hidden ring-2 ring-blue-500 ring-offset-2">
                <img 
                    src={user.ownerImg[0]}
                    alt={user.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                />
            </div>
        );
    };

    return (
        <nav className={`w-full fixed top-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-lg' : 'bg-white/95'}`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex items-center space-x-2">
                        <h2 className="font-Oswald font-bold text-2xl lg:text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            eBook
                        </h2>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to='/' className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                            Home
                        </Link>
                        {user ? (
                            <>
                                <Link to='/browsebook' className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                                    Browse Books
                                </Link>
                                <Link to="/addbooks" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                                    Add Books
                                </Link>
                                <Link to="/admin/dashboard" className="text-gray-700 hover:text-blue-600 transition-colors font-medium">
                                    Dashboard
                                </Link>
                                <div className="flex items-center space-x-4 ml-4">
                                    <div className="flex items-center space-x-3">
                                        {renderUserAvatar()}
                                        <span className="font-medium text-gray-700">{user.name}</span>
                                    </div>
                                    <button 
                                        onClick={handleLogout} 
                                        className="px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-full transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link 
                                to='/login' 
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-full transition-colors"
                            >
                                Login
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button 
                        className="md:hidden p-2 rounded-md hover:bg-gray-100 transition-colors"
                        onClick={() => setIsOpen(!isOpen)}
                    >
                        {isOpen ? (
                            <IoClose className="w-6 h-6 text-gray-600" />
                        ) : (
                            <HiOutlineMenu className="w-6 h-6 text-gray-600" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-white border-t shadow-lg">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        <Link 
                            to='/' 
                            className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                            onClick={() => setIsOpen(false)}
                        >
                            Home
                        </Link>
                        {user ? (
                            <>
                                <Link 
                                    to='/browsebook' 
                                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Browse Books
                                </Link>
                                <Link 
                                    to="/addbooks" 
                                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Add Books
                                </Link>
                                <Link 
                                    to="/admin/dashboard" 
                                    className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-md"
                                    onClick={() => setIsOpen(false)}
                                >
                                    Dashboard
                                </Link>
                                <div className="mt-4 px-3 py-2">
                                    <div className="flex items-center space-x-3 mb-3">
                                        {renderUserAvatar()}
                                        <span className="font-medium text-gray-700">{user.name}</span>
                                    </div>
                                    <button 
                                        onClick={handleLogout}
                                        className="w-full px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link 
                                to='/login'
                                className="block px-3 py-2 text-base font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md text-center"
                                onClick={() => setIsOpen(false)}
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
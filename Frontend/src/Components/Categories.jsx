import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Tabbutton from "./Tabbutton";

const Categories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                // First check if user is authenticated
                const authResponse = await axios.get('http://localhost:5000/login-success', {
                    withCredentials: true
                });

                if (!authResponse.data.success) {
                    navigate('/login');
                    return;
                }

                // If authenticated, fetch categories
                const response = await axios.get("http://localhost:5000/category", {
                    withCredentials: true
                });
                setCategories(response.data);
                setLoading(false);
            } catch (err) {
                if (err.response?.status === 401) {
                    navigate('/login');
                } else {
                    console.error("Error fetching categories:", err);
                    setError('Failed to fetch categories');
                    setLoading(false);
                }
            }
        };

        fetchCategories();
    }, [navigate]);

    if (loading) return <div>Loading categories...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="md:mt-10 mt-2 bg-white flex flex-col justify-center items-center">
            <h2 className="font-medium font-Poppins text-3xl mb-5">Categories Book</h2>
            <div className="flex flex-wrap gap-4 px-6 py-3 w-fit rounded-md">
                {categories.length > 0 ? (
                    categories
                        .filter(category => category && category.cat_name)
                        .map((category, index) => (
                            <Tabbutton 
                                key={index} 
                                to={`/books/${category.cat_name.toLowerCase().replace(/\s+/g, "_")}`}
                            >
                                {category.cat_name}
                            </Tabbutton>
                        ))
                ) : (
                    <p>No categories found</p>
                )}
            </div>
        </div>
    );
};

export default Categories;

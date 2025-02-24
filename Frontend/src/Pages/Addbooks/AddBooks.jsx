import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Box
} from '@mui/material';
import { AddPhotoAlternate } from '@mui/icons-material';
import axios from '../../utils/axios';

const AddBooks = () => {
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [useNewCategory, setUseNewCategory] = useState(false);
  const [newCollection, setNewCollection] = useState('');
  const [useNewCollection, setUseNewCollection] = useState(false);
  const [bookData, setBookData] = useState({
    book_image: '',
    book_name: '',
    book_cat_id: '',
    book_collection_id: '',
    book_launch_date: '',
    book_publisher: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [categoryResponse, collectionResponse] = await Promise.all([
        axios.get('/category'),
        axios.get('/collection')
      ]);
      setCategories(categoryResponse.data);
      setCollections(collectionResponse.data);
    } catch (err) {
      setError('Failed to load categories or collections');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setBookData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      let categoryId = bookData.book_cat_id;
      let collectionId = bookData.book_collection_id;

      if (useNewCategory && newCategory.trim()) {
        const categoryResponse = await axios.post('/category', { cat_name: newCategory });
        categoryId = categoryResponse.data.cat_id;
      }

      if (useNewCollection && newCollection.trim()) {
        const collectionResponse = await axios.post('/collection', { collection_name: newCollection });
        collectionId = collectionResponse.data.collection_id;
      }

      await axios.post('/books', {
        ...bookData,
        book_cat_id: categoryId,
        book_collection_id: collectionId,
      });

      navigate('/browsebook');
    } catch (err) {
      setError('Failed to add book. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="min-h-screen bg-gray-50 py-8">
      <Paper elevation={3} className="max-w-3xl mx-auto p-8">
        <Typography variant="h4" className="text-center mb-6 font-bold text-gray-800">
          Add New Book
        </Typography>

        {error && (
          <Alert severity="error" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box className="flex flex-col items-center p-6 border-2 border-dashed border-gray-300 rounded-lg mb-4">
                <AddPhotoAlternate className="text-gray-400 text-5xl mb-2" />
                <TextField
                  fullWidth
                  name="book_image"
                  label="Book Image URL"
                  value={bookData.book_image}
                  onChange={handleChange}
                  variant="outlined"
                  className="mt-3"
                />
              </Box>
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                required
                name="book_name"
                label="Book Name"
                value={bookData.book_name}
                onChange={handleChange}
                variant="outlined"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              {!useNewCategory ? (
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="book_cat_id"
                    value={bookData.book_cat_id}
                    onChange={handleChange}
                    label="Category"
                  >
                    {categories.map((category) => (
                      <MenuItem key={category.cat_id} value={category.cat_id}>
                        {category.cat_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label="New Category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useNewCategory}
                    onChange={() => setUseNewCategory(!useNewCategory)}
                  />
                }
                label="Add new category"
                className="mt-2"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              {!useNewCollection ? (
                <FormControl fullWidth>
                  <InputLabel>Collection</InputLabel>
                  <Select
                    name="book_collection_id"
                    value={bookData.book_collection_id}
                    onChange={handleChange}
                    label="Collection"
                  >
                    {collections.map((collection) => (
                      <MenuItem key={collection.collection_id} value={collection.collection_id}>
                        {collection.collection_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <TextField
                  fullWidth
                  label="New Collection"
                  value={newCollection}
                  onChange={(e) => setNewCollection(e.target.value)}
                />
              )}
              <FormControlLabel
                control={
                  <Checkbox
                    checked={useNewCollection}
                    onChange={() => setUseNewCollection(!useNewCollection)}
                  />
                }
                label="Add new collection"
                className="mt-2"
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                type="date"
                name="book_launch_date"
                label="Launch Date"
                value={bookData.book_launch_date}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                required
                name="book_publisher"
                label="Publisher"
                value={bookData.book_publisher}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} className="flex justify-end">
              <Button
                type="button"
                variant="outlined"
                className="mr-3"
                onClick={() => navigate(-1)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                className="bg-blue-500"
              >
                {loading ? (
                  <CircularProgress size={24} className="text-white" />
                ) : (
                  'Add Book'
                )}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Box>
  );
};

export default AddBooks;

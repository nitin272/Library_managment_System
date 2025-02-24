import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  Typography, 
  Grid,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Alert
} from '@mui/material';
import LoadingSpinner from '../../Components/LoadingSpinner';
import axios from '../../utils/axios';

const BookStatistics = () => {
  const [statistics, setStatistics] = useState({
    notBorrowed: [],
    outstanding: [],
    topBorrowed: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      setError(null);
      const [notBorrowedRes, outstandingRes, topBorrowedRes] = await Promise.all([
        axios.get('/books/not-borrowed'),
        axios.get('/books/outstanding'),
        axios.get('/books/top-borrowed')
      ]);

      setStatistics({
        notBorrowed: notBorrowedRes.data,
        outstanding: outstandingRes.data,
        topBorrowed: topBorrowedRes.data
      });
    } catch (err) {
      setError('Failed to fetch statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <div className="space-y-6">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper className="p-6">
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Paper elevation={2} className="p-4 text-center">
                  <Typography variant="h4" className="mb-2">
                    {statistics.notBorrowed.length}
                  </Typography>
                  <Typography variant="subtitle1">Available Books</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={2} className="p-4 text-center">
                  <Typography variant="h4" className="mb-2">
                    {statistics.outstanding.length}
                  </Typography>
                  <Typography variant="subtitle1">Outstanding Books</Typography>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper elevation={2} className="p-4 text-center">
                  <Typography variant="h4" className="mb-2">
                    {statistics.topBorrowed.length}
                  </Typography>
                  <Typography variant="subtitle1">Popular Books</Typography>
                </Paper>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} className="p-4">
            <Typography variant="h6" className="mb-4">Available Books</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Book Name</TableCell>
                  <TableCell>Publisher</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statistics.notBorrowed.map((book, index) => (
                  <TableRow key={index}>
                    <TableCell>{book.book_name}</TableCell>
                    <TableCell>{book.book_publisher}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} className="p-4">
            <Typography variant="h6" className="mb-4">Outstanding Books</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Book Name</TableCell>
                  <TableCell>Member</TableCell>
                  <TableCell>Due Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statistics.outstanding.map((book, index) => (
                  <TableRow key={index}>
                    <TableCell>{book.book_name}</TableCell>
                    <TableCell>{book.mem_name}</TableCell>
                    <TableCell>
                      {new Date(book.target_return_date).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>

        <Grid item xs={12}>
          <TableContainer component={Paper} className="p-4">
            <Typography variant="h6" className="mb-4">Most Popular Books</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Book Name</TableCell>
                  <TableCell>Times Borrowed</TableCell>
                  <TableCell>Unique Members</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {statistics.topBorrowed.map((book, index) => (
                  <TableRow key={index}>
                    <TableCell>{book.book_name}</TableCell>
                    <TableCell>{book.times_borrowed}</TableCell>
                    <TableCell>{book.unique_members}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </div>
  );
};

export default BookStatistics; 
import React, { useState, useEffect } from 'react';
import { TextField, Button, Paper, Typography, Alert, MenuItem } from '@mui/material';
import axios from 'axios';

const IssueBook = () => {
  const [books, setBooks] = useState([]);
  const [members, setMembers] = useState([]);
  const [formData, setFormData] = useState({
    book_id: '',
    issuance_member: '',
    issued_by: '',
    target_return_date: '',
    issuance_status: 'Issued'
  });

  const [status, setStatus] = useState({
    success: false,
    error: false,
    message: ''
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [booksRes, membersRes] = await Promise.all([
          axios.get('http://localhost:5000/books', { withCredentials: true }),
          axios.get('http://localhost:5000/members', { withCredentials: true })
        ]);
        setBooks(booksRes.data);
        setMembers(membersRes.data);
        
        const userResponse = await axios.get('http://localhost:5000/user', { 
          withCredentials: true 
        });
        setFormData(prev => ({
          ...prev,
          issued_by: userResponse.data.user._id
        }));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/issuance/issue', formData, {
        withCredentials: true
      });

      if (response.data.issuance) {
        setStatus({
          success: true,
          error: false,
          message: 'Book issued successfully!'
        });
        setFormData({
          book_id: '',
          issuance_member: '',
          issued_by: formData.issued_by,
          target_return_date: '',
          issuance_status: 'Issued'
        });
      }
    } catch (error) {
      setStatus({
        success: false,
        error: true,
        message: error.response?.data?.message || 'Failed to issue book'
      });
    }
  };

  return (
    <div className="p-6">
      <Paper className="p-6 max-w-2xl mx-auto">
        <Typography variant="h5" className="mb-6">Issue Book</Typography>

        {status.success && (
          <Alert severity="success" className="mb-4">{status.message}</Alert>
        )}
        {status.error && (
          <Alert severity="error" className="mb-4">{status.message}</Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            select
            fullWidth
            label="Select Book"
            name="book_id"
            value={formData.book_id}
            onChange={handleChange}
            required
          >
            {books.map((book) => (
              <MenuItem key={book.book_id} value={book.book_id}>
                {book.book_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            select
            fullWidth
            label="Select Member"
            name="issuance_member"
            value={formData.issuance_member}
            onChange={handleChange}
            required
          >
            {members.map((member) => (
              <MenuItem key={member.mem_id} value={member.mem_id}>
                {member.mem_name}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            fullWidth
            label="Target Return Date"
            name="target_return_date"
            type="date"
            value={formData.target_return_date}
            onChange={handleChange}
            required
            InputLabelProps={{ shrink: true }}
          />

          <Button 
            type="submit" 
            variant="contained" 
            color="primary" 
            className="bg-blue-500"
          >
            Issue Book
          </Button>
        </form>
      </Paper>
    </div>
  );
};

export default IssueBook; 
import React, { useState } from 'react';
import { 
  Paper, 
  TextField, 
  Button, 
  Typography, 
  Alert, 
  Snackbar 
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AddMember = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    mem_name: '',
    mem_email: '',
    mem_phone: '',
    mem_address: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/members', formData, {
        withCredentials: true
      });

      if (response.data) {
        setSnackbar({
          open: true,
          message: 'Member added successfully!',
          severity: 'success'
        });
        setTimeout(() => {
          navigate('/admin/members');
        }, 2000);
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Failed to add member',
        severity: 'error'
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="p-6">
      <Paper className="p-6 max-w-2xl mx-auto">
        <Typography variant="h5" className="mb-6">Add New Member</Typography>

        <form onSubmit={handleSubmit} className="space-y-4">
          <TextField
            fullWidth
            label="Name"
            name="mem_name"
            value={formData.mem_name}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Email"
            name="mem_email"
            type="email"
            value={formData.mem_email}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Phone"
            name="mem_phone"
            value={formData.mem_phone}
            onChange={handleChange}
            required
          />

          <TextField
            fullWidth
            label="Address"
            name="mem_address"
            value={formData.mem_address}
            onChange={handleChange}
            multiline
            rows={3}
            required
          />

          <div className="flex gap-4">
            <Button 
              type="submit" 
              variant="contained" 
              color="primary" 
              className="bg-blue-500"
            >
              Add Member
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/admin/members')}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AddMember; 
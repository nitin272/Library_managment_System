import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  Snackbar,
  Fab,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import { Link, useNavigate } from 'react-router-dom';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [editMember, setEditMember] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    mem_name: '',
    mem_email: '',
    mem_phone: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/members', {
          withCredentials: true
        });
        setMembers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch members');
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  const handleEditClick = (member) => {
    setEditMember(member);
    setFormData({
      mem_name: member.mem_name,
      mem_email: member.mem_email,
      mem_phone: member.mem_phone
    });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    setEditMember(null);
    setFormData({
      mem_name: '',
      mem_email: '',
      mem_phone: ''
    });
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5000/members/${editMember.mem_id}`,
        formData,
        { withCredentials: true }
      );
      
      setMembers(members.map(member => 
        member.mem_id === editMember.mem_id ? response.data : member
      ));
      
      handleDialogClose();
      showSnackbar('Member updated successfully', 'success');
    } catch (error) {
      console.error('Error updating member:', error);
      showSnackbar('Failed to update member', 'error');
    }
  };

  const handleDelete = async (memberId) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await axios.delete(`http://localhost:5000/members/${memberId}`, { withCredentials: true });
        fetchMembers(); // Refresh the list
        showSnackbar('Member deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting member:', error);
        showSnackbar('Failed to delete member', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Add new member
  const handleAddMember = async () => {
    try {
      const response = await axios.post('http://localhost:5000/members', formData, {
        withCredentials: true
      });
      
      setMembers([...members, response.data]);
      handleAddDialogClose();
      showSnackbar('Member added successfully', 'success');
    } catch (error) {
      console.error('Error adding member:', error);
      showSnackbar('Failed to add member', 'error');
    }
  };

  const handleAddDialogOpen = () => {
    setFormData({
      mem_name: '',
      mem_email: '',
      mem_phone: ''
    });
    setOpenAddDialog(true);
  };

  const handleAddDialogClose = () => {
    setOpenAddDialog(false);
    setFormData({
      mem_name: '',
      mem_email: '',
      mem_phone: ''
    });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4">Members</Typography>
        <Button 
          variant="contained" 
          color="primary"
          onClick={() => navigate('/admin/add-member')}
        >
          Add New Member
        </Button>
      </div>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.mem_id}>
                <TableCell>{member.mem_name}</TableCell>
                <TableCell>{member.mem_email}</TableCell>
                <TableCell>{member.mem_phone}</TableCell>
                <TableCell>
                  <Button 
                    color="error" 
                    onClick={() => handleDelete(member.mem_id)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Member Dialog */}
      <Dialog open={openAddDialog} onClose={handleAddDialogClose}>
        <DialogTitle>Add New Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="mem_name"
            label="Name"
            type="text"
            fullWidth
            value={formData.mem_name}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="mem_email"
            label="Email"
            type="email"
            fullWidth
            value={formData.mem_email}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="mem_phone"
            label="Phone"
            type="text"
            fullWidth
            value={formData.mem_phone}
            onChange={handleInputChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddDialogClose}>Cancel</Button>
          <Button 
            onClick={handleAddMember} 
            color="primary"
            disabled={!formData.mem_name || !formData.mem_email || !formData.mem_phone}
          >
            Add Member
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Member Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Edit Member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="mem_name"
            label="Name"
            type="text"
            fullWidth
            value={formData.mem_name}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="mem_email"
            label="Email"
            type="email"
            fullWidth
            value={formData.mem_email}
            onChange={handleInputChange}
            required
          />
          <TextField
            margin="dense"
            name="mem_phone"
            label="Phone"
            type="text"
            fullWidth
            value={formData.mem_phone}
            onChange={handleInputChange}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button 
            onClick={handleUpdate} 
            color="primary"
            disabled={!formData.mem_name || !formData.mem_email || !formData.mem_phone}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Members; 
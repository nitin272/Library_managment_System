import React, { useState, useEffect } from 'react';
import {
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import axios from '../../utils/axios';

const MembershipManagement = () => {
  const [memberships, setMemberships] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const [formData, setFormData] = useState({
    member_id: '',
    status: 'Active'
  });

  useEffect(() => {
    fetchMemberships();
    fetchMembers();
  }, []);

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/membership');
      setMemberships(response.data);
    } catch (error) {
      showSnackbar('Error fetching memberships', 'error');
      console.error('Fetch error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async () => {
    try {
      const response = await axios.get('/members');
      setMembers(response.data);
    } catch (error) {
      showSnackbar('Error fetching members', 'error');
      console.error('Members fetch error:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      if (selectedMembership) {
        const response = await axios.put(`/membership/${selectedMembership.membership_id}`, {
          status: formData.status
        });
        showSnackbar(response.data.message, 'success');
      } else {
        const response = await axios.post('/membership', formData);
        showSnackbar(response.data.message, 'success');
      }
      handleCloseDialog();
      fetchMemberships();
    } catch (error) {
      console.error('Submit error:', error);
      showSnackbar(error.response?.data?.error || 'Error processing request', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (membershipId) => {
    if (window.confirm('Are you sure you want to delete this membership?')) {
      try {
        setLoading(true);
        const response = await axios.delete(`/membership/${membershipId}`);
        showSnackbar(response.data.message, 'success');
        fetchMemberships();
      } catch (error) {
        showSnackbar('Error deleting membership', 'error');
        console.error('Delete error:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleOpenDialog = (membership = null) => {
    setSelectedMembership(membership);
    if (membership) {
      setFormData({
        member_id: membership.member_id,
        status: membership.status
      });
    } else {
      setFormData({
        member_id: '',
        status: 'Active'
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedMembership(null);
    setFormData({
      member_id: '',
      status: 'Active'
    });
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <div className="p-6">
      <Paper className="p-6">
        <div className="flex justify-between items-center mb-6">
          <Typography variant="h5">Membership Management</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={() => handleOpenDialog()}
            disabled={loading}
          >
            Add New Membership
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center p-4">
            <CircularProgress />
          </div>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Member Name</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {memberships.map((membership) => (
                  <TableRow key={membership.membership_id}>
                    <TableCell>
                      {members.find(m => m.mem_id === membership.member_id)?.mem_name || 'Unknown'}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        membership.status === 'Active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {membership.status}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Button 
                        onClick={() => handleOpenDialog(membership)}
                        className="mr-2"
                        disabled={loading}
                      >
                        Edit
                      </Button>
                      <Button 
                        color="error" 
                        onClick={() => handleDelete(membership.membership_id)}
                        disabled={loading}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog}>
          <DialogTitle>
            {selectedMembership ? 'Edit Membership' : 'Add New Membership'}
          </DialogTitle>
          <DialogContent>
            <TextField
              select
              fullWidth
              label="Member"
              value={formData.member_id}
              onChange={(e) => setFormData({ ...formData, member_id: e.target.value })}
              margin="normal"
              disabled={selectedMembership || loading}
            >
              {members.map((member) => (
                <MenuItem key={member.mem_id} value={member.mem_id}>
                  {member.mem_name}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              select
              fullWidth
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              margin="normal"
              disabled={loading}
            >
              <MenuItem value="Active">Active</MenuItem>
              <MenuItem value="Inactive">Inactive</MenuItem>
              <MenuItem value="Suspended">Suspended</MenuItem>
            </TextField>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog} disabled={loading}>Cancel</Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              color="primary"
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : (selectedMembership ? 'Update' : 'Add')}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
        >
          <Alert 
            onClose={handleCloseSnackbar} 
            severity={snackbar.severity}
            sx={{ width: '100%' }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Paper>
    </div>
  );
};

export default MembershipManagement; 
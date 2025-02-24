import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from '../../Components/Sidebar';
import { Card, CardContent, Typography } from '@mui/material';
import { FaBook, FaLayerGroup, FaUsers } from 'react-icons/fa';
import axios from '../../utils/axios';
import LoadingSpinner from '../../Components/LoadingSpinner';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalCollections: 0,
    members: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [booksRes, collectionsRes, membersRes] = await Promise.all([
        axios.get('/books'),
        axios.get('/collection'),
        axios.get('/members')
      ]);

      setStats({
        totalBooks: booksRes.data.length,
        totalCollections: collectionsRes.data.length,
        members: membersRes.data
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCardClick = (route) => {
    navigate(`/admin/${route}`);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Dashboard Overview</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card 
            className="transform hover:scale-105 transition-transform duration-200 cursor-pointer"
            onClick={() => handleCardClick('books')}
          >
            <CardContent className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography className="text-gray-500 text-sm mb-2">Total Books</Typography>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {stats.totalBooks}
                  </Typography>
                </div>
                <FaBook className="text-4xl text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="transform hover:scale-105 transition-transform duration-200 cursor-pointer"
            onClick={() => handleCardClick('collections')}
          >
            <CardContent className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography className="text-gray-500 text-sm mb-2">Collections</Typography>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {stats.totalCollections}
                  </Typography>
                </div>
                <FaLayerGroup className="text-4xl text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card 
            className="transform hover:scale-105 transition-transform duration-200 cursor-pointer"
            onClick={() => handleCardClick('members')}
          >
            <CardContent className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div>
                  <Typography className="text-gray-500 text-sm mb-2">Total Members</Typography>
                  <Typography variant="h4" className="font-bold text-gray-800">
                    {stats.members.length}
                  </Typography>
                </div>
                <FaUsers className="text-4xl text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard; 
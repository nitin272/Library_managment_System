import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  FaUsers, 
  FaBook, 
  FaUserPlus, 
  FaExchangeAlt, 
  FaChartBar, 
  FaIdCard 
} from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="bg-gray-800 text-white w-64 min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-8">Admin Dashboard</h2>
      <nav>
        <ul className="space-y-4">
          <li>
            <Link 
              to="/admin/dashboard" 
              className={`flex items-center space-x-3 p-2 rounded ${
                isActive('/admin/dashboard') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <FaBook className="text-xl" />
              <span>Overview</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/members" 
              className={`flex items-center space-x-3 p-2 rounded ${
                isActive('/admin/members') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <FaUsers className="text-xl" />
              <span>Members</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/add-member" 
              className={`flex items-center space-x-3 p-2 rounded ${
                isActive('/admin/add-member') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <FaUserPlus className="text-xl" />
              <span>Add Member</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/issue-book" 
              className={`flex items-center space-x-3 p-2 rounded ${
                isActive('/admin/issue-book') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <FaExchangeAlt className="text-xl" />
              <span>Issue Book</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/statistics" 
              className={`flex items-center space-x-3 p-2 rounded ${
                isActive('/admin/statistics') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <FaChartBar className="text-xl" />
              <span>Book Statistics</span>
            </Link>
          </li>
          <li>
            <Link 
              to="/admin/memberships" 
              className={`flex items-center space-x-3 p-2 rounded ${
                isActive('/admin/memberships') ? 'bg-gray-700' : 'hover:bg-gray-700'
              }`}
            >
              <FaIdCard className="text-xl" />
              <span>Memberships</span>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar; 
import { Outlet } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from './Components/Footer';
import Dashboard from "./Pages/Admin/Dashboard";
import {Router,Routes , BrowserRouter} from "react-router-dom";
import { CircularProgress } from '@mui/material';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16 px-4 md:px-6 lg:px-8">
        <Outlet />
      </div>
      <div id="loading-spinner" className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden">
        <CircularProgress />
      </div>
    </div>
  );
}

export default App;

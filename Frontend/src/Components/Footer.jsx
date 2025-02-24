import React from 'react';
import { Link } from 'react-router-dom';
import { IoMdMail } from 'react-icons/io';
import { FaLocationDot } from 'react-icons/fa6';
import { BsTelephone } from 'react-icons/bs';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="font-Oswald text-3xl font-bold">eBook</h2>
            <p className="text-gray-200 font-Poppins text-sm">
              Your one-stop destination for digital books and library management.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-semibold mb-4 font-Poppins">Quick Links</h3>
            <ul className="space-y-2 font-Poppins text-sm">
              <li>
                <Link to="/" className="hover:text-blue-300 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/browsebook" className="hover:text-blue-300 transition-colors">
                  Browse Books
                </Link>
              </li>
              <li>
                <Link to="/addbooks" className="hover:text-blue-300 transition-colors">
                  Add Books
                </Link>
              </li>
              <li>
                <Link to="/admin/dashboard" className="hover:text-blue-300 transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-semibold mb-4 font-Poppins">Contact Us</h3>
            <ul className="space-y-3 font-Poppins text-sm">
              <li className="flex items-center space-x-2">
                <FaLocationDot className="flex-shrink-0" />
                <span>123 Library Street, Booktown</span>
              </li>
              <li className="flex items-center space-x-2">
                <BsTelephone className="flex-shrink-0" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <IoMdMail className="flex-shrink-0" />
                <span>contact@ebook.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 py-4">
          <p className="text-sm text-center text-gray-200 font-Poppins">
            © {new Date().getFullYear()} eBook. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
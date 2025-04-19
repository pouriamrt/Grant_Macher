import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="container mx-auto flex justify-between items-center py-3">
        <Link to="/" className="text-2xl font-extrabold tracking-tight hover:text-gray-200">Grant Matcher</Link>
        <div className="space-x-6">
          <Link to="/researchers" className="hover:text-gray-200">Researchers</Link>
          <Link to="/grants" className="hover:text-gray-200">Grants</Link>
          <Link to="/matches" className="hover:text-gray-200">Matches</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

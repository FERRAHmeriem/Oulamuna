import React from 'react';
import { Link } from 'react-router-dom';

const AdminHeader = () => {
  return (
    <div className="h-screen w-64 bg-gray-800 text-white flex flex-col p-6 space-y-6 fixed left-0 top-0">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <nav className="flex flex-col space-y-4">
        <Link to="/admin_home" className="hover:text-gray-300">Home</Link>
        <Link to="/admin_articles" className="hover:text-gray-300">Articles</Link>
        <Link to="/admin_savants" className="hover:text-gray-300">Savants</Link>
        <Link to="/admin_statistique" className="hover:text-gray-300">Statistiques</Link>
      </nav>
    </div>
  );
};

export default AdminHeader;

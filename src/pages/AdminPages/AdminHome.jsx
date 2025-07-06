import React from 'react';
import AdminHeader from '../../components/AdminSidebar';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
function AdminHome() {
  const SERVER_URL = import.meta.env.VITE_SERVER;
  const { currentUser } = useSelector((state) => state.user);
  const [admin, setAdmin] = useState('');
  useEffect(() => {
      if (currentUser) {
        setAdmin(currentUser);
      } 
    }, [currentUser]);
    
if (!admin) return <div>Loading...</div>;
  return (
    <div className="flex">
      <AdminHeader />
      <div className="ml-64 p-6 w-full">
        <div className='flex items-center justify-between'>
         <h2 className="text-3xl font-semibold mb-4">Welcome {admin.familyName} {admin.firstName}, to the Admin Dashboard</h2>
         <img className='w-12 h-12  object-cover rounded-full' src={`${SERVER_URL}/api/uploads/${admin.profileImage}`} alt="image" />
        </div>
       
        <p className="text-gray-700">.....</p>
      </div>
    </div>
  );
}

export default AdminHome;

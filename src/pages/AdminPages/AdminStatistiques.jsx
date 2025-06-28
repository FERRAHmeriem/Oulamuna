import React from 'react';
import AdminHeader from '../../components/AdminHeader';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
import profile_pic from '../../testingImages/Malek Bennabi.jpg';

function AdminStatistiques() {
     const { currentUser } = useSelector((state) => state.user);
  const [admin, setAdmin] = useState('');
  useEffect(() => {
      if (currentUser) {
        setAdmin(currentUser);
      } else {
        // Simulate fetch from backend (you can replace this with real API call)
        setAdmin({
          _id: '123456',
          username: "MeriemFrrh",
          ProfileImage: profile_pic,
          email: "mm_ferrah@esi.dz",
          sexe:'femme',
          firstName:'Meriem',
          familyName:'Ferrah',
          birthday:'2004-12-10'
  
        });
      }
    }, [currentUser]);
    
if (!admin) return <div>Loading...</div>;
  return (
    <div className="flex">
      <AdminHeader />
      <div className="ml-64 p-6 w-full">
        <div className='flex items-center justify-between'>
         <h2 className="text-3xl font-semibold mb-4">Welcome {admin.familyName} {admin.firstName}, to the Admin Dashboard</h2>
         <img className='w-32 h-32 object-cover rounded-full' src={admin.ProfileImage} alt="image" />
        </div>
       
        <p className="text-gray-700">.....</p>
      </div>
    </div>
  )
}

export default AdminStatistiques
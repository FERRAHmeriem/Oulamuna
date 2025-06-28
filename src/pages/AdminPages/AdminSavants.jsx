import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AdminHeader from '../../components/AdminHeader';
import { Link } from 'react-router-dom';

import profile_pic from '../../testingImages/iM.jpg';
import image1 from "../../testingImages/Moufdi Zakaria.jpg";
import image2 from "../../testingImages/Malek Bennabi.jpg";
import image3 from "../../testingImages/alarbi-tbass.jpg";

// Enums (utilisés aussi dans AddArticle)
const EPOQUES = {
  contemporaine: "Époque contemporaine",
  coloniale: "Période coloniale",
  ottomane: "Période ottomane",
  moyenAge: "Moyen Âge",
};

const DOMAINS_EXPERTISE = {
  theologie: "Théologie",
  philosophie: "Philosophie",
  litterature: "Littérature",
  sciences: "Sciences",
};

function AdminSavant() {
  const { currentUser } = useSelector((state) => state.user);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setAdmin(currentUser);
    } else {
      setAdmin({
        _id: '123456',
        username: "MeriemFrrh",
        ProfileImage: profile_pic,
        email: "mm_ferrah@esi.dz",
        sexe: 'femme',
        firstName: 'Meriem',
        familyName: 'Ferrah',
        birthday: '2004-12-10'
      });
    }
  }, [currentUser]);

  if (!admin) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <AdminHeader />

      <div className="ml-64 p-6 w-full">
        {/* Header Section */}
        <div className='flex items-center justify-between mb-6'>
          <h2 className="text-3xl font-semibold">
            Bienvenue {admin.familyName} {admin.firstName}, dans le dashboard Admin
          </h2>
          <img className='w-24 h-24 object-cover rounded-full shadow-md' src={admin.ProfileImage} alt="admin" />
        </div>

        {/* Savants Section */}
        <div>
          <h1 className="text-2xl font-bold mb-4">Nouveaux Savants</h1>
          <div className='flex flex-col gap-6'>
            {savants.map((savant, key) => (
              <div key={key} className='flex bg-white shadow-lg rounded-lg overflow-hidden'>
                <img src={savant.picture} alt="savant" className='w-42 h-full object-cover' />
                <div className='p-4 flex items-center justify-between w-full'>
                  <div>
                    <Link to={`/savant/${savant._id}`} className="text-lg font-semibold text-blue-600 hover:underline block">
                      {savant.name}
                    </Link>
                    <p className='text-sm text-gray-600 my-1'>
                      Époque : <span className='font-medium'>{EPOQUES[savant.epoque]}</span>
                    </p>
                    <p className='text-sm text-gray-600'>
                      Domaine : <span className='font-medium'>{DOMAINS_EXPERTISE[savant.domaineExpertise]}</span>
                    </p>
                  </div>
                  <div className='mt-3 flex flex-col gap-2'>
                    <button className='px-4 py-2 text-white bg-[#1f863a] hover:bg-green-700 rounded cursor-pointer'>
                      Approuver
                    </button>
                    <button className='px-4 py-2 text-white bg-[#ba2e5ffe] hover:bg-red-700 rounded cursor-pointer'>
                      Rejeter
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminSavant;

// Données fictives (à remplacer par un appel API si besoin)
const savants = [
  {
    _id: "1",
    name: "Abdelhamid Ben Badis",
    picture: image1,
    epoque: "coloniale",
    domaineExpertise: "theologie",
  },
  {
    _id: "2",
    name: "Khaled El Hassani",
    picture: image2,
    epoque: "ottomane",
    domaineExpertise: "sciences",
  },
  {
    _id: "3",
    name: "Malek Bennabi",
    picture: image3,
    epoque: "contemporaine",
    domaineExpertise: "philosophie",
  },
];

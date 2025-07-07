import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import AdminHeader from '../../components/AdminSidebar';
import { fetchGlobalStats } from '../../utils/admin';
import { ClipLoader } from 'react-spinners';

function AdminStatistiques() {
  const { currentUser } = useSelector((state) => state.user);
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const SERVER_URL = import.meta.env.VITE_SERVER;

  useEffect(() => {
    if (currentUser) {
      setAdmin(currentUser);
    }
  }, [currentUser]);

  useEffect(() => {
    const loadStats = async () => {
      try {
        if (currentUser?.token) {
          const data = await fetchGlobalStats(currentUser.token);
          setStats(data);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des statistiques :", error);
      }
    };
    loadStats();
  }, [currentUser]);

  const { general, byDomain, byLanguage, byEpoque } = stats || {};
  if (!admin) return <div>Chargement...</div>;
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminHeader />
      <div className="ml-64 p-8 w-full">
        {/* Header Section */}
        <div className='flex items-center justify-between mb-8'>
          <div>
            <h2 className="text-3xl font-semibold text-gray-800">Bienvenue {admin.familyName} {admin.firstName}</h2>
       
          </div>
          <img
            className='w-12 h-12 object-cover rounded-full border-2 border-gray-200'
            src={`${SERVER_URL}/api/uploads/${admin.profileImage}`}
            alt="Profil admin"
          />
        </div>

        {!stats ? (
          <div className="flex justify-center items-center h-[60vh]">
            <div className="text-center">
              <ClipLoader size={50} color="#2f7062" />
              <p className="mt-4 text-gray-600">Chargement des statistiques...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Statistiques générales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              <StatCard title="Articles totaux" value={general.totalArticles} />
              <StatCard title="Articles approuvés" value={general.approvedArticles} />
              <StatCard title="Articles en attente" value={general.pendingArticles} />
              <StatCard title="Brouillons" value={general.draftArticles} />
              <StatCard title="Rejetés" value={general.rejectedArticles} />
              <StatCard title="Articles à la une" value={general.featuredArticles} />
              <StatCard title="Vues totales" value={general.totalViews} />
              <StatCard title="Likes totaux" value={general.totalLikes} />
              <StatCard title="Commentaires totaux" value={general.totalComments} />
              <StatCard title="Temps moyen de lecture" value={`${Math.round(general.avgReadingTime)} min`} />
            </div>

            {/* Sections de statistiques */}
            <div className="space-y-8">
              <SectionStats title="Répartition par domaine d'expertise" items={byDomain} />
              <SectionStats title="Répartition par langue" items={byLanguage} />
              <SectionStats title="Répartition par époque" items={byEpoque} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 border-[#2f7062]">
      <div className="flex items-center justify-between mb-3">
        <div className="text-2xl">{icon}</div>
        <div className="text-right">
          <p className="text-3xl font-bold text-gray-800">{value ?? 0}</p>
        </div>
      </div>
      <h4 className="text-gray-600 text-sm font-medium">{title}</h4>
    </div>
  );
}

function SectionStats({ title, items }) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center mb-6">
        <div className="w-1 h-8 bg-[#274a43] rounded-full mr-4"></div>
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="font-medium text-gray-700">{item._id || 'Inconnu'}</span>
            <span className="text-gray-600 font-semibold">{item.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminStatistiques;
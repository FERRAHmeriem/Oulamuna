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

  return (
    <div className="flex">
      <AdminHeader />
      <div className="ml-64 p-6 w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-semibold mb-4">
            Bienvenue {admin?.familyName} {admin?.firstName}, sur le Dashboard Admin
          </h2>
          <img
            className="w-12 h-12 object-cover rounded-full"
            src={`${SERVER_URL}/api/uploads/${admin?.profileImage}`}
            alt="admin"
          />
        </div>

        {!stats ? (
          <div className="flex justify-center items-center h-[60vh]">
            <ClipLoader size={50} color="#2f7062" />
          </div>
        ) : (
          <>
            {/* Statistiques générales */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-8">
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

            {/* Répartition par domaine */}
            <SectionStats title="Répartition par domaine d'expertise" items={byDomain} />

            {/* Répartition par langue */}
            <SectionStats title="Répartition par langue" items={byLanguage} />

            {/* Répartition par époque */}
            <SectionStats title="Répartition par époque" items={byEpoque} />
          </>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value }) {
  return (
    <div className="bg-white rounded-xl shadow p-4">
      <h4 className="text-gray-600 text-sm">{title}</h4>
      <p className="text-2xl font-bold">{value ?? 0}</p>
    </div>
  );
}

function SectionStats({ title, items }) {
  return (
    <div className="mt-10">
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <ul className="space-y-2">
        {items.map((item, index) => (
          <li key={index} className="bg-gray-100 p-3 rounded-md flex justify-between">
            <span>{item._id || 'Inconnu'}</span>
            <span className="font-bold">{item.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AdminStatistiques;

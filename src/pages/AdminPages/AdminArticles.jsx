import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AdminHeader from '../../components/AdminSidebar';
import { getArticles, approveArticle, rejectArticle, fetchArticleAnalytics, archiveArticle } from '../../utils/admin';
import { toast, ToastContainer } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import not_archived from '../../assets/not_archived.png';
const getShortDescription = (text, wordLimit = 15) => {
  if (!text) return '';
  const words = text.split(' ');
  return words.length <= wordLimit
    ? text
    : words.slice(0, wordLimit).join(' ') + '...';
};

function AdminArticles() {
  const { currentUser } = useSelector((state) => state.user);
  const [admin, setAdmin] = useState(null);
  const [articles, setArticles] = useState([]);
  const [filter, setFilter] = useState('all');
  const SERVER_URL = import.meta.env.VITE_SERVER;

  const [loading, setLoading] = useState(true);

  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveNotes, setApproveNotes] = useState('');
  const [selectedApproveId, setSelectedApproveId] = useState(null);

  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [selectedRejectId, setSelectedRejectId] = useState(null);

  const [showStatsModal, setShowStatsModal] = useState(false);
  const [selectedArticleStats, setSelectedArticleStats] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setAdmin(currentUser);
      loadArticles();
    }
  }, [currentUser]);

  const loadArticles = async () => {
    setLoading(true);
    try {
      const res = await getArticles(currentUser.token);
      setArticles(res.data);
      console.log("Articles chargés :", res.data);
    } catch (err) {
      toast.error("Erreur lors du chargement des articles");
    } finally {
      setLoading(false);
    }
  };

  const confirmApprove = async () => {
    try {
      await approveArticle(selectedApproveId, currentUser.token, approveNotes);
      toast.success("Article approuvé !");
      setShowApproveModal(false);
      loadArticles();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Veuillez entrer une raison");
      return;
    }
    try {
      await rejectArticle(selectedRejectId, currentUser.token, rejectReason, approveNotes);
      toast.success("Article rejeté !");
      setShowRejectModal(false);
      loadArticles();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const openStatsModal = async (articleId) => {
    try {
      const stats = await fetchArticleAnalytics(articleId, currentUser.token);
      setSelectedArticleStats(stats);
      setShowStatsModal(true);
    } catch (error) {
      toast.error("Erreur lors du chargement des statistiques");
    }
  };

  const filteredArticles = articles.filter((article) => {
    if (filter === 'all') return true;
    return article.status === filter;
  });
  const handleArchive = async (articleId) => {
    try {
      await archiveArticle(articleId, currentUser.token);
      toast.success('Article archivé avec succès !');
      loadArticles();
    } catch (err) {
      toast.error('Erreur lors de l’archivage.');
    }
  };


  if (!admin) return <div>Loading...</div>;

  return (
    <div className="flex min-h-screen">
      <AdminHeader />

      <div className="ml-64 p-8 w-full">
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

        <div>
          <h1 className="text-2xl font-bold mb-4">Articles</h1>

          <div className="flex gap-3 mb-4">
            {['all', 'draft', 'archived', 'approved', 'rejected'].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded ${filter === status ? 'bg-[#274a43fd] text-white' : 'bg-gray-200 text-gray-700'}`}
              >
                {status === 'all' ? 'Tous' : status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>

          <div className='flex flex-col gap-6'>
            {loading ? (
              <div className="flex justify-center items-center h-[60vh]">
                <ClipLoader size={40} color="#2f7062" />
              </div>
            ) : filteredArticles.length === 0 ? (
              <div className="text-center text-gray-500 mt-8">
                Aucun article trouvé pour ce filtre.
              </div>
            ) : (
              filteredArticles.map((article) => (
                <div key={article._id} className='relative flex bg-white shadow-lg rounded-lg '>
                  <img src={`${SERVER_URL}/api/uploads/${article.imageArticle?.url}`} alt="article" className='w-42 h-64 object-cover rounded-l-lg' />
                  <div className=' p-4 flex items-center justify-between w-full'>
                    <div>
                      <p className="text-2xl font-semibold text-stone-800  block">
                        {article.title}
                      </p>
                      <span
                        className={`font-semibold px-2 py-1 rounded-lg absolute top-0 right-8
                            ${article.status === 'approved' ? 'text-green-700 bg-green-100' : 'text-red-700 bg-red-100'}`}>
                        {article.status}
                      </span>
                      {article.status === 'approved' && <img
                        src={not_archived}
                        onClick={() => handleArchive(article._id)}
                        className="absolute top-[-10px] right-0 w-8 h-8 cursor-pointer hover:scale-105 transition-transform duration-200"
                        alt="archive"
                      />}

                      <p className="text-sm text-gray-600 my-1">
                        {getShortDescription(article.description)}
                      </p>
                      <div className='text-sm text-gray-500 space-y-1'>
                        <Link to={`/profile/${article.author?._id}`} className="hover:underline block">
                          Auteur : {article.author?.userName}
                        </Link>
                        <Link to={`/savant/${article.scholar?._id}`} className="hover:underline block">
                          Sur le Savant : {article.scholar?.name}
                        </Link>
                      </div>
                    </div>

                    <div className="my-3 flex flex-col gap-2 ">
                      {article.status === 'draft' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedApproveId(article._id);
                              setApproveNotes('');
                              setShowApproveModal(true);
                            }}
                            className='px-2 py-2 text-white bg-[#1f863a] hover:bg-green-700 rounded cursor-pointer'
                          >
                            Approuver
                          </button>
                          <button
                            onClick={() => {
                              setSelectedRejectId(article._id);
                              setRejectReason('');
                              setShowRejectModal(true);
                            }}
                            className='px-2 py-2 text-white bg-[#ba2e5f] hover:bg-red-700 rounded cursor-pointer'
                          >
                            Rejeter
                          </button>
                        </>
                      )}
                      {((article.status === 'approved') || (article.status === 'archived')) && (
                        <button
                          onClick={() => openStatsModal(article._id)}
                          className="px-2 py-2 text-white bg-[#274a43fd] hover:bg-[#1f3430fd] rounded cursor-pointer"
                        >
                          Voir les statistiques
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showApproveModal && (
        <Modal
          title="Notes d'approbation (optionnelles)"
          value={approveNotes}
          onChange={setApproveNotes}
          onCancel={() => setShowApproveModal(false)}
          onConfirm={confirmApprove}
          confirmText="Confirmer l'approbation"
          confirmColor="green"
        />
      )}

      {showRejectModal && (
        <Modal
          title="Raison du rejet"
          value={rejectReason}
          onChange={setRejectReason}
          onCancel={() => setShowRejectModal(false)}
          onConfirm={confirmReject}
          confirmText="Confirmer le rejet"
          confirmColor="red"
        />
      )}

      {showStatsModal && selectedArticleStats && (
        <div className="fixed inset-0 bg-[#2435461c] bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">Statistiques de l'article</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <StatBox title="Vues" value={selectedArticleStats.basic.viewCount} />
              <StatBox title="Likes" value={selectedArticleStats.basic.likesCount} />
              <StatBox title="Commentaires" value={selectedArticleStats.basic.commentsCount} />
              <StatBox title="Temps de lecture" value={`${selectedArticleStats.basic.readingTime} min`} />
              <StatBox title="Taux de like" value={`${selectedArticleStats.engagement.likeRate}%`} />
              <StatBox title="Taux de commentaire" value={`${selectedArticleStats.engagement.commentRate}%`} />
              <StatBox title="Status" value={selectedArticleStats.status} />
            </div>
            <h3 className="text-xl font-semibold mt-6 mb-2">10 dernières vues</h3>
            <ul className="space-y-2">
              {selectedArticleStats.tenRecentViews.length === 0 ? (
                <p className="text-gray-500">Aucune vue récente</p>
              ) : (
                selectedArticleStats.tenRecentViews.map((viewer, index) => (
                  <li key={index} className="bg-gray-100 p-3 rounded-md">
                    {viewer.user
                      ? `${viewer.user.firstName} ${viewer.user.familyName} (@${viewer.user.userName})`
                      : 'Utilisateur inconnu'} – {new Date(viewer.viewedAt).toLocaleString()}
                  </li>
                ))
              )}
            </ul>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setShowStatsModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

function StatBox({ title, value }) {
  return (
    <div className="bg-gray-100 rounded-md p-4">
      <h4 className="text-sm text-gray-600">{title}</h4>
      <p className="text-lg font-bold">{value}</p>
    </div>
  );
}

function Modal({ title, value, onChange, onCancel, onConfirm, confirmText, confirmColor }) {
  return (
    <div className="fixed inset-0 bg-[#2435461c] bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <textarea
          className="w-full p-2 border border-gray-300 rounded mb-4"
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Saisir ici..."
        />
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className={`bg-${confirmColor}-600 hover:bg-${confirmColor}-700 text-white px-4 py-2 rounded`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminArticles;

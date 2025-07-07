import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AdminHeader from '../../components/AdminSidebar';
import { Link } from 'react-router-dom';
import { getPendingScholars, approveScholar, rejectScholar } from '../../utils/admin';
import { toast, ToastContainer } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function AdminSavant() {
  const { currentUser } = useSelector((state) => state.user);
  const [admin, setAdmin] = useState(null);
  const [savants, setSavants] = useState([]);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedScholarId, setSelectedScholarId] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectNotes, setRejectNotes] = useState('');
  const SERVER_URL = import.meta.env.VITE_SERVER;
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [approveNotes, setApproveNotes] = useState('');
  const [selectedApproveId, setSelectedApproveId] = useState(null);
  const [isdata, setIsData] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setAdmin(currentUser);
      fetchPending();
    }
  }, [currentUser]);

  const fetchPending = async () => {
    try {
      const res = await getPendingScholars(currentUser.token);
      setSavants(res.data);
      if (res.data != null) setIsData(true);
    } catch (err) {
      toast.error("Erreur lors du chargement des savants en attente.");
    }
  };

  const confirmApprove = async () => {
    try {
      const res = await approveScholar(selectedApproveId, approveNotes, currentUser.token);
      toast.success(res.message || "Savant approuvé !");
      setShowApproveModal(false);
      fetchPending();
    } catch (err) {
      console.error("Approval failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Erreur lors de l'approbation.");
    }
  };

  const handleReject = (id) => {
    setSelectedScholarId(id);
    setRejectReason('');
    setRejectNotes('');
    setShowRejectModal(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Veuillez entrer une raison.");
      return;
    }
    try {
      await rejectScholar(selectedScholarId, rejectReason, currentUser.token, rejectNotes);
      toast.success("Savant rejeté !");
      setShowRejectModal(false);
      fetchPending();
    } catch (err) {
      console.error("Rejection failed:", err.response?.data || err.message);
      toast.error(err.response?.data?.message || "Erreur lors du rejet.");
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
          <h1 className="text-2xl font-bold mb-4">Nouveaux Savants</h1>
          <div className='flex flex-col gap-6'>
            {!savants || !isdata ? (
              <div className="flex justify-center items-center h-[70vh]">
                <ClipLoader size={40} color="#2f7062" />
              </div>
            ) : savants.length > 0 ? (
              savants.map((savant) => (
                <div key={savant._id} className='flex bg-white shadow-lg rounded-lg overflow-hidden'>
                  <img src={`${import.meta.env.VITE_SERVER}/api/uploads/${savant.picture}`} alt="savant" className='w-42 h-64 object-cover' />
                  <div className='p-4 flex items-center justify-between w-full'>
                    <div>
                      <Link to={`/savant/${savant._id}`} className="text-lg font-semibold text-blue-600 hover:underline block">
                        {savant.name}
                      </Link>
                      <p className='text-sm text-gray-600 my-1'>
                        Époque : <span className='font-medium'>{savant.epoque}</span>
                      </p>
                      <p className='text-sm text-gray-600'>
                        Domaine : <span className='font-medium'>{savant.domaineExpertise}</span>
                      </p>
                    </div>
                    <div className='mt-3 flex flex-col gap-2'>
                      <button
                        onClick={() => {
                          setSelectedApproveId(savant._id);
                          setShowApproveModal(true);
                          setApproveNotes('');
                        }}
                        className='px-4 py-2 text-white bg-[#1f863a] hover:bg-green-700 rounded'
                      >
                        Approuver
                      </button>
                      <button onClick={() => handleReject(savant._id)} className='px-4 py-2 text-white bg-[#ba2e5f] hover:bg-red-700 rounded'>
                        Rejeter
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center">Aucun savant en attente.</p>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-[#2435461c] bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Raison du rejet</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-3"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Expliquez pourquoi ce savant est rejeté..."
            />
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows={3}
              value={rejectNotes}
              onChange={(e) => setRejectNotes(e.target.value)}
              placeholder="Notes internes (optionnelles)"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Annuler
              </button>
              <button
                onClick={confirmReject}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Confirmer le rejet
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Modal */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-[#2435461c] bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
            <h2 className="text-xl font-semibold mb-4">Notes d'approbation (optionnelles)</h2>
            <textarea
              className="w-full p-2 border border-gray-300 rounded mb-4"
              rows={4}
              value={approveNotes}
              onChange={(e) => setApproveNotes(e.target.value)}
              placeholder="Ajouter des remarques internes ou des détails..."
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowApproveModal(false)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Annuler
              </button>
              <button
                onClick={confirmApprove}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Confirmer l'approbation
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default AdminSavant;

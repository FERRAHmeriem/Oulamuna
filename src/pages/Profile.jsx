import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ClipLoader from "react-spinners/ClipLoader";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import bookOpen from '../assets/news.png';
import comment from '../assets/commentaire.png';
import grid from '../assets/list.png';
import clock from '../assets/eye.png';
import heart from '../assets/empty_heart.png';
import background from '../assets/savant_background.png';
import ArticleCard from '../components/ArticleCard';

import { getArticlesByAuthor } from '../utils/Article';

const SERVER_URL = import.meta.env.VITE_SERVER;

function Profile() {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [user, setUser] = useState(null);
  const [articles, setArticles] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingArticles, setLoadingArticles] = useState(false);

  const [data, setData] = useState({
    nombreArticle: 0,
    nombreLikes: 0,
    nombreComments: 0,
    nombreCategory: 0,
    lecture: 0, // utilisé ici comme total des vues
  });

  useEffect(() => {
    const fetchUserById = async (userId, token) => {
      try {
        const res = await fetch(`${SERVER_URL}/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const result = await res.json();
        if (res.ok) {
          setUser(result.data);
        } else {
          console.error(result.message || "Erreur utilisateur");
        }
      } catch (err) {
        console.error("Erreur de requête :", err);
      }
    };

    if (currentUser && currentUser._id === id) {
      setUser(currentUser);
    } else if (currentUser?.token) {
      fetchUserById(id, currentUser.token);
    }
  }, [id, currentUser]);

  useEffect(() => {
    const loadArticles = async () => {
      if (!user || !currentUser?.token) return;

      setLoadingArticles(true);
      try {
        const result = await getArticlesByAuthor(id, page, 6, currentUser.token);
        if (result.success) {
          const newArticles = result.data.articles;

          const totalLikes = newArticles.reduce((sum, a) => sum + (a.likesCount || 0), 0);
          const totalComments = newArticles.reduce((sum, a) => sum + (a.commentsCount || 0), 0);
          const totalViews = newArticles.reduce((sum, a) => sum + (a.viewCount || 0), 0);

          const domaines = new Set([
            ...articles.map(a => a.domaineExpertise),
            ...newArticles.map(a => a.domaineExpertise)
          ]);

          setArticles((prev) => [...prev, ...newArticles]);
          setHasMore(result.pagination.hasNextPage);

          setData((prev) => ({
            ...prev,
            nombreArticle: result.pagination.totalItems,
            nombreLikes: prev.nombreLikes + totalLikes,
            nombreComments: prev.nombreComments + totalComments,
            nombreCategory: domaines.size,
            lecture: prev.lecture + totalViews
          }));
        }
      } catch (err) {
        console.error("Erreur lors du chargement des articles :", err);
      } finally {
        setLoadingArticles(false);
      }
    };

    loadArticles();
  }, [user, page]);

  function getAge(birthday) {
    const birthDate = new Date(birthday);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center bg-[#173B33]">
        <ClipLoader color="#F4ECD3" loading={true} size={60} />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className='space-y-32 bg-[#173B33]'>
        <div className="w-full mb-64 relative">
          <img src={background} alt="background" className="w-full h-[300px] object-cover" />
          <div className="absolute w-screen right-0 bottom-[-200px] text-center flex items-center justify-around gap-16">
            <div className='flex gap-16 justify-center items-center'>
              <img
                src={`${SERVER_URL}/api/uploads/${user.profileImage}`}
                alt="image"
                className="w-72 h-72 rounded-full object-cover shadow-stone-700 shadow-xl"
              />
              <span className="block text-4xl font-semibold text-[#F4ECD3] mt-2">{user.userName}</span>
            </div>

            {(currentUser?._id === id) && (
              <button className="mt-2 px-4 py-2 text-[#F4ECD3] bg-[#202E2C] text-lg font-semibold rounded-lg cursor-pointer hover:scale-101">
                <Link to="/edit_profile">Modifier le Profile</Link>
              </button>
            )}
          </div>
        </div>

        <div className='rounded-xl overflow-hidden bg-[#F4ECD3] flex items-stretch justify-between shadow-lg shadow-stone-700 mx-16 gap-4'>
          {[
            { label: 'Articles', icon: bookOpen, value: data.nombreArticle },
            { label: 'Likes reçus', icon: heart, value: data.nombreLikes },
            { label: 'Commentaires reçus', icon: comment, value: data.nombreComments },
            { label: 'Catégories explorées', icon: grid, value: data.nombreCategory },
            { label: 'Nombre de vues', icon: clock, value: data.lecture },
          ].map((item, index) => (
            <div
              key={index}
              className='flex-1  bg-[#EBE3CB] shadow-lg shadow-stone-700 flex flex-col items-center justify-center gap-2 p-4'
            >
              <p className='text-2xl text-stone-800 font-semibold text-center'>{item.label}</p>
              <img src={item.icon} alt="" className='w-20 h-20' />
              <p className="text-xl text-[#173B33] font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className='flex items-start mx-16 gap-4'>
          <div className='basis-1/4 mt-10 bg-[#F4ECD3] rounded-lg shadow-lg shadow-stone-700 py-8 px-4'>
            <h2 className='text-3xl font-bold text-[#173B33] mb-6'>Infos personnelles</h2>
            <div className='flex flex-col gap-4 text-xl text-stone-800'>
              <div className='flex items-center gap-4'>
                <p className='font-semibold'>Nom de l’auteur: </p>
                <p className='uppercase'>{user.firstName} {user.familyName}</p>
              </div>
              <div className='flex items-center gap-4'>
                <p className='font-semibold'>Email: </p>
                <p>{user.email}</p>
              </div>
              <div className='flex items-center gap-4'>
                <p className='font-semibold'>Âge: </p>
                <p>{getAge(user.birthday)} ans</p>
              </div>
              <div className='flex items-center gap-4'>
                <p className='font-semibold'>Sexe: </p>
                <p>{user.sexe}</p>
              </div>
            </div>
          </div>

          <div className='basis-3/4 mt-10 bg-[#F4ECD3] rounded-lg shadow-lg shadow-stone-700 p-8'>
            <h1 className='text-3xl font-bold text-[#173B33] mb-6'>Les articles de {user.userName}</h1>

            {articles.length === 0 ? (
              <p className="text-xl text-center text-[#173B33]">
                Aucun article trouvé pour cet auteur.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-2 justify-center gap-4">
                  {articles.map((article, index) => (
                    <ArticleCard key={index} article={article} />
                  ))}
                </div>

                {hasMore && (
                  <div className="flex justify-center mt-6">
                    <button
                      onClick={() => setPage((prev) => prev + 1)}
                      className="px-6 py-2 bg-[#1A3A34] text-white rounded-md hover:bg-[#274a43fd] transition"
                      disabled={loadingArticles}
                    >
                      {loadingArticles ? "Chargement..." : "Voir plus"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;

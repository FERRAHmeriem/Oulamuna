import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import AdminHeader from '../../components/AdminHeader';
import profile_pic from '../../testingImages/iM.jpg';
import image1 from "../../testingImages/image1.jpg";
import image2 from "../../testingImages/image2.jpg";
import image3 from "../../testingImages/image3.jpg";

// Function to truncate text to first 15 words
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

        {/* Articles Section */}
        <div>
          <h1 className="text-2xl font-bold mb-4">Nouveaux Articles</h1>
          <div className='flex flex-col  gap-6'>
            {articles.map((article, key) => (
              <div key={key} className='flex bg-white shadow-lg rounded-lg overflow-hidden'>
                <img src={article.imageArticle.url} alt="article" className='w-42 h-full object-cover' />
                <div className='p-4 flex items-center justify-between w-full'>
                  <div>
                    <Link to={`/article/${key}`} className="text-lg font-semibold text-blue-600 hover:underline block">
                      {article.title}
                    </Link>
                    <p className="text-sm text-gray-600 my-1">
                      {getShortDescription(article.description)}
                    </p>
                    <div className='text-sm text-gray-500 space-y-1'>
                      <Link to={`/profile/${article.author}`} className="hover:underline block">
                        Auteur : {article.author}
                      </Link>
                      <Link to={`/savant/${article.scholarId}`} className="hover:underline block">
                        Sur le Savant : {article.scholarName}
                      </Link>
                    </div>
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

export default AdminArticles;

// ARTICLES MOCK (use your data or import it from another file)
const articles = [
  {
    title: "Abdelhamid Ben Badis et la construction de l'identité algérienne",
    description: "L’œuvre de Abdelhamid Ben Badis s’inscrit dans la résistance intellectuelle à la domination coloniale. En mettant en avant l’histoire, la langue et la foi, il a restauré chez les Algériens la fierté d’être eux-mêmes. Son discours, profondément enraciné dans les valeurs nationales, a contribué à forger l’unité du peuple.",
    scholarName: "Abdelhamid Ben Badis",
    scholarId: 1,
    author: "665ed80d4e76fbd63f08a58a",
    imageArticle: { url: image1 }
  },
  {
    title: "Spiritualité dans la pensée de Khaled El Hassani",
    description: "La spiritualité était au cœur de la démarche de Khaled El Hassani. Pour lui, la foi ne se limitait pas aux rituels, mais s’exprimait dans le comportement, la justice et le service de la communauté.",
    scholarName: "Khaled El Hassani",
    scholarId: 2,
    author: "665ed80d4e76fbd63f08a58a",
    imageArticle: { url: image2 }
  },
  {
    title: "L'éthique dans la vie de Malek Bennabi",
    description: "Malek Bennabi incarnait une éthique rigoureuse. Son intégrité, sa sincérité et son engagement faisaient de lui un modèle. Il refusa les compromissions et fit toujours passer l’intérêt général avant ses intérêts personnels.",
    scholarName: "Malek Bennabi",
    scholarId: 3,
    author: "665ed80d4e76fbd63f08a58a",
    imageArticle: { url: image3 }
  }
];

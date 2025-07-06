import React from 'react';
import { Link } from 'react-router-dom';
function ArticleCard({ article }) {
  // Fonction utilitaire pour tronquer la description
  const truncateDescription = (text, maxWords = 60) => {
    const words = text.split(' ');
    return words.length > maxWords ? words.slice(0, maxWords).join(' ') + '...' : text;
  };

  return (
    <div className="bg-[#274a43fd] rounded-lg p-2">
      <div className="relative h-full border-2 border-stone-800 rounded-lg p-4 shadow-lg shadow-stone-700 bg-white flex flex-col justify-between">
        <div className="border-b-2 border-stone-800 pb-4">
          <h1 className="text-2xl text-center font-semibold text-stone-800">{article?.scholar?.name || article.scholarName}</h1>
        </div>

        <div className="py-4 flex-1 flex flex-col">
          <h1 className="text-4xl text-center font-semibold text-stone-800">{article.title}</h1>
          <div className="flex items-start mt-4 mb-4 gap-4">
            <p className="basis-3/5">
              {truncateDescription(article.description)}
            </p>
            <img
              className="basis-2/5 h-52 w-40 rounded-xl object-cover shadow-stone-700 shadow-xl"
              src={`${import.meta.env.VITE_SERVER}/api/uploads/${article.imageArticle.url}`}
              alt=""
            />
          </div>
          <Link
            className="py-2 px-8 bg-[#274a43fd] text-white font-medium tracking-wide cursor-pointer rounded-lg hover:bg-[#1A3A34] transition-colors duration-200 w-fit"
            to={`/article/${article._id}`} // utilise _id au lieu de id
          >
            Savoir Plus
          </Link>
        </div>

        <p className="border-t-2 border-stone-800 pt-2 mt-auto text-sm" style={{ marginBottom: '10px' }}>
          Écrit par{' '}
          <Link to={`/profile/${article.author?._id}`} className="font-semibold underline cursor-pointer hover:text-emerald-800">
            {article.author.userName}
          </Link>
        </p>
        
      </div>
    </div>
  );
}

export default ArticleCard;

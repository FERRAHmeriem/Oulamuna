import React, { useEffect, useState } from 'react';
import ArticleCard from './ArticleCard';
import { fetchScholarArticles } from '../utils/Article'; // Vérifie le chemin
import { ClipLoader } from 'react-spinners';

function ArticleParSavant({ savantId }) {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadArticles = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetchScholarArticles({ id: savantId });
        setArticles(res.articles); // 👈 accéder à data.articles
      } catch (err) {
        console.error("Erreur lors de la récupération des articles :", err);
        setError("Une erreur est survenue lors du chargement des articles.");
      } finally {
        setLoading(false);
      }
    };

    if (savantId) {
      loadArticles();
    }
  }, [savantId]);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <ClipLoader color="#1A3A34" size={40} />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  if (articles.length === 0) {
    return <p className="text-center text-gray-500">Aucun article trouvé pour ce savant.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 justify-center gap-6">
      {articles.map((article, index) => (
        <ArticleCard key={article._id || index} article={article} />
      ))}
    </div>
  );
}

export default ArticleParSavant;

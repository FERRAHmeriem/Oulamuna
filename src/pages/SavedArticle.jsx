import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import ArticleCard from "../components/ArticleCard";
import { Link } from 'react-router-dom';
import save from '../assets/save.png';
import time from '../assets/time.png';
import language from '../assets/language.png';
import { searchArticles, fetchAllArticles } from '../utils/Article';
import { fetchScholarList } from '../utils/Savant';
import { EPOQUES, DOMAINS_EXPERTISE, LANGUAGES } from '../utils/Article_constant';
import { ClipLoader } from "react-spinners";
import Select from 'react-select';

function SavedArticle() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  // Filtres
  const [selectedEpoque, setSelectedEpoque] = useState(null);
  const [selectedLangue, setSelectedLangue] = useState(null);
  const [selectedDomaine, setSelectedDomaine] = useState(null);
  const [selectedScholar, setSelectedScholar] = useState(null);
  const [searchTitle, setSearchTitle] = useState('');
  const [scholarOptions, setScholarOptions] = useState([]);

  useEffect(() => {
    fetchScholarList().then((res) => {
      setScholarOptions(res.map(s => ({ value: s.name, label: s.name })));
    });
  }, []);

  const fetchArticles = async (reset = false) => {
    setLoading(true);
    try {
      const filters = {};
      if (searchTitle.trim()) filters.title = searchTitle;
      if (selectedEpoque) filters.epoque = selectedEpoque.value;
      if (selectedLangue) filters.langue = selectedLangue.value;
      if (selectedDomaine) filters.domaine = selectedDomaine.value;
      if (selectedScholar) filters.scholarName = selectedScholar.value;
      console.log("Filters:", filters);
      let response;
      if (Object.keys(filters).length > 0) {
        response = await searchArticles({ ...filters, page, limit: 10 });
      } else {
        response = await fetchAllArticles({ page, limit: 10 });
      }
      console.log("Response:", response);
      const { data, pagination } = response;
      if (reset) {
        setArticles(data);
      } else {
        setArticles((prev) => [...prev, ...data]);
      }

      setHasMore(pagination?.hasNextPage ?? false);
    } catch (err) {
      console.error("Erreur lors du chargement des articles :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles(page === 1);
  }, [page]);

  const handleFilter = () => {
    setPage(1);
    setArticles([]);
    fetchArticles(true);
  };

  const handleReset = () => {
    setSearchTitle('');
    setSelectedEpoque(null);
    setSelectedLangue(null);
    setSelectedDomaine(null);
    setSelectedScholar(null);
    setPage(1);
    setArticles([]);
    fetchArticles(true);
  };

  const handleVoirPlus = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  return (
    <div className="bg-[#1A3A34]">
      <Header />
      <div className="flex flex-col items-center justify-center gap-16 py-16 px-10">
        <div className="p-8 bg-[#1F463D] shadow-[#25302993] shadow-lg rounded-lg w-full space-y-6">
          <h1 className='text-[#FAF2E1] text-left text-8xl font-semibold'>Vos Articles Sauvgardées</h1>
        </div>

        <div className="flex w-full gap-5">
          {/* FILTRES */}
          <div className="bg-[#1F463D] shadow-lg rounded-lg basis-1/4 px-4 py-6 flex flex-col gap-6">
            <input
              type="text"
              placeholder="Rechercher par titre"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              className="w-full px-4 py-2 bg-white border-2 border-[#1A3A34] rounded-xl placeholder-gray-600 text-stone-800"
            />

            <Select
              options={EPOQUES.map(e => ({ label: e, value: e }))}
              value={selectedEpoque}
              onChange={setSelectedEpoque}
              placeholder="Époque"
            />

            <Select
              options={LANGUAGES.map(l => ({ label: l, value: l }))}
              value={selectedLangue}
              onChange={setSelectedLangue}
              placeholder="Langue"
            />

            <Select
              options={DOMAINS_EXPERTISE.map(d => ({ label: d, value: d }))}
              value={selectedDomaine}
              onChange={setSelectedDomaine}
              placeholder="Domaine"
            />

            <Select
              options={scholarOptions}
              value={selectedScholar}
              onChange={setSelectedScholar}
              placeholder="Savant"
            />

            <button
              onClick={handleFilter}
              className="w-full px-4 py-2 bg-[#FAF2E1] rounded-lg text-stone-800 font-semibold hover:bg-[#e5ddcb]"
            >
              Filtrer
            </button>

            <button
              onClick={handleReset}
              className="w-full px-4 py-2 bg-red-100 rounded-lg text-red-700 font-semibold hover:bg-red-200"
            >
              Réinitialiser
            </button>
          </div>

          {/* ARTICLES */}
          <div className="bg-[#1F463D] shadow-lg rounded-lg basis-4/6 py-12 px-16">
            {articles.length === 0 && !loading ? (
              <p className="text-center text-2xl text-[#FAF2E1]">Aucun article trouvé.</p>
            ) : (
              <>
                <div className="flex flex-col gap-6">
                  {articles.map((article, index) => (
                    <ArticleCard key={index} article={article} />
                  ))}
                </div>
                {hasMore && (
                  <div className="flex justify-center mt-10">
                    <button
                      onClick={handleVoirPlus}
                      className="mt-6 px-6 py-2 rounded bg-[#FAF2E1] text-[#1A3A34] font-semibold hover:bg-[#e0d6bd]"
                    >
                      {loading ? <ClipLoader size={20} color="#1A3A34" /> : "Voir plus"}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* PANEL DROITE */}
          <div className="bg-[#1F463D] shadow-lg rounded-lg basis-1/5 px-4 py-6 space-y-4">
            <div className="bg-[#1A3A34] flex flex-col items-center rounded-lg justify-center gap-4 p-2">
              <p className="text-[#FAF2E1] text-2xl font-semibold">Explorer des Articles</p>
              <button className=" py-2 border-2 bg-[#FAF2E1] rounded-xl text-stone-800">
                <Link to={`/articles`}>Voir les articles </Link>
              </button>
            </div>
            <div className="bg-[#1A3A34] flex flex-col items-center rounded-lg justify-center gap-4 p-2">
              <p className="text-[#FAF2E1] text-2xl font-semibold">Créer des nouveaux Articles</p>
              <button className="px-2 py-2 border-2 bg-[#FAF2E1] rounded-xl text-stone-800">
                <Link to="/ajouter_article">Ajouter Un Article</Link>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SavedArticle;

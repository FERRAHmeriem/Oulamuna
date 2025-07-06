import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { getAllScholars, searchScholars } from "../utils/Savant";
import { EPOQUES, DOMAINS_EXPERTISE } from "../utils/Article_constant";

const ListeSavant = () => {
  const [scholars, setScholars] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEpoque, setSelectedEpoque] = useState(null);
  const [selectedDomaine, setSelectedDomaine] = useState(null);

  const navigate = useNavigate();

  const fetchScholars = async (reset = false) => {
    setLoading(true);
    try {
      const filters = {};
      if (searchTerm.trim()) filters.name = searchTerm;
      if (selectedEpoque) filters.epoque = selectedEpoque.value;
      if (selectedDomaine) filters.domaineExpertise = selectedDomaine.value;

      let response;
      if (Object.keys(filters).length > 0) {
        response = await searchScholars({ ...filters, page, limit: 10 });
      } else {
        response = await getAllScholars({ page, limit: 10 });
      }

      const { data, pagination } = response;
      if (reset) {
        setScholars(data);
      } else {
        setScholars((prev) => [...prev, ...data]);
      }

      setHasMore(pagination?.hasNextPage ?? false);
    } catch (error) {
      console.error("Erreur lors du chargement des savants", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScholars(page === 1);
  }, [page]);

  const handleVoirPlus = () => {
    if (hasMore) setPage((prev) => prev + 1);
  };

  const handleClick = (id) => {
    navigate(`/savant/${id}`);
  };

  const handleFilter = () => {
    setPage(1);
    setScholars([]);
    fetchScholars(true);
  };

  const handleReset = () => {
    setSearchTerm("");
    setSelectedEpoque(null);
    setSelectedDomaine(null);
    setPage(1);
    setScholars([]);
    fetchScholars(true);
  };

  return (
    <>
      <div className="flex w-full gap-5 mb-12">
        <div className="flex flex-col bg-[#1F463D] shadow-[#25302993] shadow-lg rounded-lg basis-1/5 px-4 py-6 gap-6">
          <div className="bg-[#1A3A34] flex flex-col gap-2 items-center p-4 rounded-lg">
            <p className="text-[#FAF2E1] text-md">Filtrer par Nom</p>
            <input
              type="text"
              placeholder="Entrer le Nom"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border-1 bg-white rounded-lg placeholder-gray-500 text-stone-800 focus:outline-none focus:border-[#1A3A34] transition-colors"
            />
          </div>

          <div className="bg-[#1A3A34] flex flex-col gap-2 items-center p-4 rounded-lg">
            <p className="text-[#FAF2E1] text-md">Filtrer par époque</p>
            <Select
              options={EPOQUES.map((epoque) => ({
                label: epoque,
                value: epoque,
              }))}
              value={selectedEpoque}
              onChange={setSelectedEpoque}
              placeholder="Choisir une époque"
              className="w-full"
            />
          </div>

          <div className="bg-[#1A3A34] flex flex-col gap-2 items-center p-4 rounded-lg">
            <p className="text-[#FAF2E1] text-md">Filtrer par domaine</p>
            <Select
              options={DOMAINS_EXPERTISE.map((domain) => ({
                label: domain,
                value: domain,
              }))}
              value={selectedDomaine}
              onChange={setSelectedDomaine}
              placeholder="Choisir un domaine"
              className="w-full"
            />
          </div>

          <button
            onClick={handleFilter}
            className="w-full px-4 py-2 border-2 bg-[#FAF2E1] rounded-lg text-stone-800 font-semibold hover:bg-[#e5ddcb]"
          >
            Filtrer
          </button>

          <button
            onClick={handleReset}
            className="w-full px-4 py-2 border-2 bg-red-100 rounded-lg text-red-700 font-semibold hover:bg-red-200"
          >
            Réinitialiser
          </button>
        </div>

        <div className="bg-[#1F463D] shadow-[#25302993] shadow-lg rounded-lg basis-4/5 py-12 px-6">
          <p className="text-[#FAF2E1] text-center text-5xl font-semibold pb-16">
            Liste Des Savants
          </p>

          {scholars.length === 0 && !loading ? (
            <p className="text-center text-2xl text-[#FAF2E1]">
              Aucun résultat trouvé.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-12 justify-center items-center px-16">
                {scholars.map((savant) => (
                  <div
                    key={savant._id}
                    className="bg-[#1A3A34] shadow-md rounded-xl overflow-hidden w-64 text-center cursor-pointer transition-transform transform hover:scale-101 hover:shadow-lg"
                    onClick={() => handleClick(savant._id)}
                  >
                    <img
                      src={`${import.meta.env.VITE_SERVER}/api/uploads/${savant.picture}`}
                      alt={savant.name}
                      className="w-full h-80 object-cover"
                    />
                    <div className="bg-[#1A3A34] py-3 text-[#FAF2E1] font-medium rounded-b-xl">
                      <p className="text-lg">{savant.name}</p>
                      <p className="text-sm text-center italic">
                        {savant.epoque}
                      </p>
                      <p className="text-sm text-center italic">
                        {savant.domaineExpertise}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center mt-10">
                  <button
                    onClick={handleVoirPlus}
                    className="mt-6 px-6 py-2 rounded bg-[#FAF2E1] text-[#1A3A34] font-semibold hover:bg-[#e0d6bd]"
                  >
                    {loading ? (
                      <ClipLoader size={20} color="#1A3A34" />
                    ) : (
                      "Voir plus"
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ListeSavant;

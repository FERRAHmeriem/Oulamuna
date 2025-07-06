import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import background from "../assets/savant_background.png";
import Header from '../components/Header';
import ArticleParSavant from '../components/ArticleParSavant';
import { getScholarById } from '../utils/savant';
import { ClipLoader } from 'react-spinners';

function Savant() {
  const { id } = useParams();
  const [savant, setSavant] = useState(null);
  const [loading, setLoading] = useState(true);
 const Navigate = useNavigate()

  useEffect(() => {
    const fetchSavant = async () => {
      try {
        const data = await getScholarById(id);
        setSavant(data.scholar);
        
      } catch (err) {
        console.error("Erreur lors du fetch du savant :", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSavant();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ClipLoader size={50} color="#1A3A34" />
      </div>
    );
  }
  if (!savant) {
    Navigate('/not-found')
  }

  return (
    <div>
      <Header />
      <div className='space-y-32'>
        <div className="w-full relative">
          <img src={background} alt="background" className="w-full object-cover" />
          <div className="absolute left-1/2 bottom-[-52px] transform -translate-x-1/2">
            <img
              src={`${import.meta.env.VITE_SERVER}/api/uploads/${savant.picture}`}
              alt={savant.name}
              className="w-120 h-120 rounded-full object-cover shadow-stone-700 shadow-xl"
            />
          </div>
        </div>

        <div className='space-y-4 px-32'>
          <h1 className='text-center font-semibold text-stone-800 text-5xl'>{savant.name}</h1>
          <p className='text-center text-stone-800 text-xl'>{savant.biography }</p>
        </div>

        <div className='mx-16 mb-16 border-2 border-stone-800 rounded-lg px-4 py-8 space-y-16'>
          
        <h1 className="text-center text-5xl text-stone-800 font-semibold">Articles sur {savant.name}</h1>
          <ArticleParSavant savantId={savant._id} />
        </div>
      </div>
    </div>
  );
}

export default Savant;

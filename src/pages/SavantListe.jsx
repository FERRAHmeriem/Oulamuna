import React from 'react';
import Header from '../components/Header';
import { Link } from 'react-router-dom';
import ListeSavant from '../components/ListeSavant';

function SavantListe() {
  return (
    <div className="bg-[#1A3A34]">
      <Header />
      <div className="flex flex-col items-center justify-center gap-16 p-16">
        <div className="p-8 bg-[#1F463D] shadow-[#25302993] shadow-lg rounded-lg w-full flex justify-between items-center">
          <div className='space-y-6 '>
            <h1 className='text-[#FAF2E1] text-left text-8xl font-semibold'>Nos savants</h1>
            <h2 className='text-[#FAF2E1] text-left text-3xl font-semibold'>Les Grands Savants Algériens</h2>
          </div>

          <div className="bg-[#1A3A34] flex flex-col items-center rounded-lg justify-center gap-4 p-4">
            <p className="text-[#FAF2E1] text-md text-left">Vous Trouvez Pas Votre Savant Préféré ?</p>
            <button className="px-4 py-2 border-2 bg-[#FAF2E1] rounded-lg text-stone-800">
              <Link to="/ajouter_savant">Ajouter Un Savant</Link>
            </button>
          </div>
        </div>

        {/* Le composant ListeSavant gère le filtrage et l'affichage */}
        <ListeSavant />
      </div>
    </div>
  );
}

export default SavantListe;

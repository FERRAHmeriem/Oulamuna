import React from 'react'
import Header from '../components/Header'
import { Link } from 'react-router-dom'
import ListeSavant from '../components/ListeSavant'

function SavantListe() {
  return (
    <div className="bg-[#1A3A34]">
        <Header/>
        <div className="flex flex-col items-center justify-center gap-16 p-16">
            <div className="p-8 bg-[#1F463D] shadow-[#25302993] shadow-lg rounded-lg w-full space-y-6">
                <h1 className='text-[#FAF2E1] text-left text-8xl font-semibold '>
                    Nos savants
                </h1>
                <h2 className='text-[#FAF2E1] text-left text-3xl font-semibold '>
                    Les Grands Savants Algériens
                </h2>
                <input 
                type="text"
                placeholder='Rechercher un savant'
                 className="w-[75%] px-4 py-2  border-2 bg-[#FAF2E1] rounded-lg placeholder-stone-600 text-stone-800 focus:outline-none focus:border-[#1A3A34] transition-colors"
                />
            </div>
            <div className="flex w-full gap-5  ">
                <div className="flex flex-col bg-[#1F463D] shadow-[#25302993] shadow-lg rounded-lg basis-1/5 px-4 py-6 gap-6">
                    <div className="bg-[#1A3A34] flex flex-col items-center rounded-lg justify-center gap-4 p-4">
                        <p className="text-[#FAF2E1] text-md text-left ">Vous Trouvez Pas Votre Savant Preferé ? </p>
                        <button className=" px-4 py-2  border-2 bg-[#FAF2E1] rounded-lg placeholder-stone-600 text-stone-800 focus:outline-none focus:border-[#1A3A34] transition-colors">
                            <Link to="/add_savant">Ajouter Un Savant</Link>
                        </button>
                    </div>
                    <div className="bg-[#1A3A34] flex flex-col items-center rounded-lg justify-center gap-4 p-4">
                        <p className="text-[#FAF2E1] text-md text-center ">Explorez nos catégories</p>
                        <button className=" px-4 py-2  border-2 bg-[#FAF2E1] rounded-lg placeholder-stone-600 text-stone-800 focus:outline-none focus:border-[#1A3A34] transition-colors">
                            <Link>Voir Les Catégories</Link>
                        </button>
                    </div>
                    <div className="bg-[#1A3A34] flex flex-col items-center rounded-lg justify-center gap-4 p-4">
                        <p className="text-[#FAF2E1] text-md text-center ">À quelle époque souhaitez-vous explorer nos savants ?</p>
                        <button className=" px-4 py-2  border-2 bg-[#FAF2E1] rounded-lg placeholder-stone-600 text-stone-800 focus:outline-none focus:border-[#1A3A34] transition-colors">
                            <Link>Explorez par époque</Link>
                        </button>
                    </div>
                </div>
                <div className="bg-[#1F463D] shadow-[#25302993] shadow-lg rounded-lg basis-4/5 py-12 ">
                    <ListeSavant/>
                </div>
            </div>
        </div>
    </div>
  )
}

export default SavantListe
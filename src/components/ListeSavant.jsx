import React from 'react'
import image1 from '../testingImages/Abdelhamid Ben Badis.jpg'
import image2 from '../testingImages/khaled_el_hassani_ben_el_hachmi.png'
import image3 from '../testingImages/alarbi-tbass.jpg'
import image4 from '../testingImages/Malek Bennabi.jpg'
import image5 from '../testingImages/Moufdi Zakaria.jpg'
import image6 from '../testingImages/Si_mhamed_ben_rahal.png'
import { useNavigate } from 'react-router-dom'
function ListeSavant() {
  const navigate = useNavigate();
  const handleClick = (id) => {
    navigate(`/savant/${id}`);
  }
    //fetching la liste des savants & store it in a var called ListeSavant
  return (
    <>
    <p className='text-[#FAF2E1] text-center text-5xl font-semibold pb-16 '>Liste Des Savants</p>
     <div className="flex flex-wrap justify-center gap-12">
        {ListeSavantData.map((savant, index) => (
          <div
            key={index}
            className="bg-[#1A3A34] shadow-md rounded-xl overflow-hidden w-64 text-center cursor-pointer transition-transform transform hover:scale-101 hover:shadow-lg"
            onClick={() => handleClick(savant.id)}
          >
            <img
              src={savant.image}
              alt={savant.name}
              className="w-full h-80 object-cover"
            />
            <div className="bg-[#1A3A34] py-3 text-[#FAF2E1] text-sm font-medium rounded-b-xl">
              {savant.name}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default ListeSavant

const ListeSavantData = [
  {
    id: 1,
    name: "Abdelhamid Ben Badis",
    image: image1,
  },
  {
    id: 2,
    name: "Khaled El hassani Ben El Hachmi",
    image: image2,
  },
  {
    id: 3,
    name: "Alarbi tbassi",
    image: image3,
  },
  {
    id: 4,
    name: "Malek Bennabi",
    image: image4,
  },
  {
    id: 5,
    name: "Moufdi Zakaria",
    image: image5,
  },
  {
    id: 6,
    name: "Si M'hamed Ben Rahal",
    image: image6,
  },
]
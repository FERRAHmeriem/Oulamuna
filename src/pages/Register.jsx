import React , { useState } from "react"
import Header from "../components/Header"
import image from "../assets/login_image.png"
function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de connexion ici
    console.log('Connexion:', { username, password });
  };
  return (
    <div className="flex flex-col gap-[2%] justify-start h-screen bg-[#1A3A34]">
      <Header/>
      <div className="flex items-center bg-[#EBE3CB]  mx-50 rounded-4xl overflow-hidden h-[85vh]">
        <div className="basis-2/5  ">
        <img className="w-fit" src={image} alt="image" />
      </div>
        <div className=" px-32 basis-3/5 ">
        <h1 className=" text-4xl font-bold text-stone-800 mb-8 text-left">
          S'inscrire
        </h1>
        <p className="text-stone-700 text-left mb-12 leading-relaxed text-xl">
          Veuillez saisir vos informations personnelles.
        </p>
        
        <div className="space-y-6 ">
          <div>
            <input 
              type="text" 
              placeholder="NOM D'UTILISATEUR" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-[75%] px-4 py-3  border-2 border-[#1a3a34ab] rounded-sm placeholder-stone-600 text-stone-800 focus:outline-none focus:border-[#1A3A34] transition-colors"
            />
          </div>
          <div>
            <input 
              type="text" 
              placeholder="PRENOM" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-[75%] px-4 py-3  border-2 border-[#1a3a34ab] rounded-sm placeholder-stone-600 text-stone-800 focus:outline-none focus:border-[#1A3A34] transition-colors"
            />
          </div>
          <div>
            <input 
              type="text" 
              placeholder="ADDRESSE EMAIL" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-[75%] px-4 py-3  border-2 border-[#1a3a34ab] rounded-sm placeholder-stone-600 text-stone-800 focus:outline-none focus:border-[#1A3A34] transition-colors"
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="MOT DE PASSE" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-[75%] px-4 py-3  border-2 border-[#1a3a34ab] rounded-sm placeholder-stone-600 text-stone-800 focus:outline-none focus:border-[#1A3A34] transition-colors"
            />
          </div>
        
          <button 
            type="button"
            onClick={handleSubmit}
            className="w-[75%] py-3 bg-[#274a43fd] text-white font-medium tracking-wide rounded-sm hover:bg-[#1A3A34] transition-colors duration-200 cursor-pointer"
          >
            SUIVANT
          </button>
        </div>
      </div>
      
      </div>
    </div>

  )
}

export default Register 
import React, { useState, useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from "../components/Header";
import loginImage from "../assets/login_image.png";
import ProfileImage from "../assets/profile_pic.png";

function Register() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [image, setImage] = useState(null);

  const [counter, setCounter] = useState(0);
  const fileInputRef = useRef(null);

  const AddCounter = () => {
    if (counter === 0 && firstName && lastName && email && password) {
      setCounter(1);
    } else if (counter === 1 && birthDate && gender) {
      setCounter(2);
    } else {
      toast.error("Veuillez remplir tous les champs !");
    }
  };

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!image) {
      toast.error("Veuillez sélectionner une photo de profil !");
      return;
    }

    const formData = {
      username: `${firstName} ${lastName}`,
      email,
      password,
      birthDate,
      gender,
      image,
    };

    console.log("Infos soumises :", formData);
  };

  return (
    <div className="flex flex-col gap-[2%] justify-start h-screen bg-[#1A3A34]">
      <Header />
      <div className="flex items-center bg-[#EBE3CB]  mx-50 rounded-4xl overflow-hidden h-[85vh]">
        <div className="basis-2/5">
          <img className="w-fit" src={loginImage} alt="image" />
        </div>

        <div className={counter === 0 ? 'px-32 basis-3/5' : 'hidden'}>
          <h1 className="text-4xl font-bold text-stone-800 mb-8 text-left">S'inscrire</h1>
          <p className="text-stone-700 text-left mb-12 leading-relaxed text-xl">Veuillez saisir vos informations personnelles.</p>

          <div className="space-y-6">
            <input
              type="text"
              placeholder="NOM"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-[75%] px-4 py-3 border-2 border-[#1a3a34ab] rounded-sm text-stone-800"
            />
            <input
              type="text"
              placeholder="PRENOM"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-[75%] px-4 py-3 border-2 border-[#1a3a34ab] rounded-sm text-stone-800"
            />
            <input
              type="email"
              placeholder="ADDRESSE EMAIL"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-[75%] px-4 py-3 border-2 border-[#1a3a34ab] rounded-sm text-stone-800"
            />
            <input
              type="password"
              placeholder="MOT DE PASSE"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-[75%] px-4 py-3 border-2 border-[#1a3a34ab] rounded-sm text-stone-800"
            />
            <button
              type="button"
              onClick={AddCounter}
              className="w-[75%] py-3 bg-[#274a43fd] text-white rounded-sm"
            >
              SUIVANT
            </button>
          </div>
        </div>

        <div className={counter === 1 ? 'px-32 basis-3/5' : 'hidden'}>
          <h1 className="text-4xl font-bold text-stone-800 mb-8 text-left">S'inscrire</h1>
          <p className="text-stone-700 text-left mb-12 text-xl">Veuillez saisir vos informations démographiques.</p>

          <div className="space-y-6">
            <div>
              <p className="text-lg font-bold">Date de Naissance</p>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-[75%] px-4 py-3 border-2 border-[#1a3a34ab] rounded-sm text-stone-800"
              />
            </div>
            <div className="flex items-center gap-4">
              <p className="text-lg font-bold">Genre :</p>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={gender === "male"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                <span className="ml-1">Homme</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={gender === "female"}
                  onChange={(e) => setGender(e.target.value)}
                  required
                />
                <span className="ml-1">Femme</span>
              </label>
            </div>
            <button
              type="button"
              onClick={AddCounter}
              className="w-[75%] py-3 bg-[#274a43fd] text-white rounded-sm"
            >
              SUIVANT
            </button>
          </div>
        </div>

        <div className={counter === 2 ? 'px-32 basis-3/5' : 'hidden'}>
          <h1 className="text-4xl font-bold text-stone-800 mb-8 text-left">S'inscrire</h1>
          <p className="text-stone-700 text-left mb-12 text-xl">Veuillez sélectionner votre photo de profile</p>

          <div className="flex flex-col items-center space-y-6">
            <img
              src={image || ProfileImage}
              alt="Profile"
              onClick={handleImageClick}
              className="w-64 h-64 rounded-full object-cover border-2 cursor-pointer hover:opacity-80"
            />
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="w-[75%] py-3 bg-[#274a43fd] text-white rounded-sm"
            >
              CONFIRMER
            </button>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default Register;

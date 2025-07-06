import React, { useState, useRef  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import loginImage from "../assets/login_image.png";
import ProfileImage from "../assets/profile_pic.png";

import { submitFullRegister } from "../redux/user/authAction";

// ✅ Email format checker
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ✅ Password strength checker
const isStrongPassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&_])[A-Za-z\d@$!%*?#&_]{8,}$/;
  return passwordRegex.test(password);
};

function Register() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate(); 
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [sexe, setGender] = useState("");
  const [image, setImage] = useState(null);
  const [counter, setCounter] = useState(0);

  const fileInputRef = useRef(null);

  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const AddCounter = async () => {
    if (counter === 0) {
      if (!firstName || !lastName || !userName || !email || !password) {
        toast.error("Veuillez remplir tous les champs !");
        return;
      }

      if (!isValidEmail(email)) {
        toast.error("Format d'adresse email invalide !");
        return;
      }

      if (!isStrongPassword(password)) {
        toast.error("Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.");
        return;
      }

      setCounter(1);

    } else if (counter === 1) {
      if (!birthDate || !sexe) {
        toast.error("Veuillez remplir tous les champs !");
        return;
      }

      setCounter(2);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const file = fileInputRef.current.files[0];

    if (!file) {
      toast.error("Veuillez sélectionner une photo de profil !");
      return;
    }

    const formData = {
      firstName,
      familyName :lastName,
      userName,
      email,
      password,
      birthday: birthDate,
      sexe,
      profileImage: file
    };

    const result = await dispatch(submitFullRegister(formData));
    if (result.success) {
      toast.success("Inscription terminée !");
      navigate("/login")
    }
  };

  return (
    <div className="flex flex-col gap-[2%] justify-start h-screen bg-[#1A3A34]">
      <Header />
      <div className="flex items-center bg-[#EBE3CB] mx-50 rounded-4xl overflow-hidden h-[85vh]">
        <div className="basis-2/5">
          <img className="w-fit" src={loginImage} alt="image" />
        </div>

        {/* Step 1 */}
        <div className={counter === 0 ? "px-32 basis-3/5" : "hidden"}>
          <h1 className="text-4xl font-bold text-stone-800 mb-8 text-left">S'inscrire</h1>
          <p className="text-stone-700 text-left mb-12 leading-relaxed text-xl">Veuillez saisir vos informations personnelles.</p>

          <div className="space-y-6">
            <input type="text" placeholder="NOM" value={lastName} onChange={(e) => setLastName(e.target.value)} required className="w-[75%] px-4 py-3 border-2 border-[#1a3a34ab] rounded-sm text-stone-800" />
            <input type="text" placeholder="PRENOM" value={firstName} onChange={(e) => setFirstName(e.target.value)} required className="w-[75%] px-4 py-3 border-2 border-[#1a3a34ab] rounded-sm text-stone-800" />
            <input type="text" placeholder="NOM D'UTILISATEUR" value={userName} onChange={(e) => setUserName(e.target.value)} required className="w-[75%] px-4 py-3 border-2 border-[#1a3a34ab] rounded-sm text-stone-800" />
            <input type="email" placeholder="ADDRESSE EMAIL" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-[75%] px-4 py-3 border-2 border-[#1a3a34ab] rounded-sm text-stone-800" />
            <input type="password" placeholder="MOT DE PASSE" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-[75%] px-4 py-3 border-2 border-[#1a3a34ab] rounded-sm text-stone-800" />
            <button type="button" onClick={AddCounter} className="w-[75%] py-3 bg-[#274a43fd] text-white rounded-sm" disabled={loading}>{loading ? "Chargement..." : "SUIVANT"}</button>
          </div>
        </div>

        {/* Step 2 */}
        <div className={counter === 1 ? "px-32 basis-3/5" : "hidden"}>
          <h1 className="text-4xl font-bold text-stone-800 mb-8 text-left">S'inscrire</h1>
          <p className="text-stone-700 text-left mb-12 text-xl">Veuillez saisir vos informations démographiques.</p>

          <div className="space-y-6">
            <div>
              <p className="text-lg font-bold">Date de Naissance</p>
              <input type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required className="w-[75%] px-4 py-3 border-2 border-[#1a3a34ab] rounded-sm text-stone-800" />
            </div>
            <div className="flex items-center gap-4">
              <p className="text-lg font-bold">Genre :</p>
              <label className="flex items-center">
                <input type="radio" name="sexe" value="Homme" checked={sexe === "Homme"} onChange={(e) => setGender(e.target.value)} />
                <span className="ml-1">Homme</span>
              </label>
              <label className="flex items-center">
                <input type="radio" name="sexe" value="Femme" checked={sexe === "Femme"} onChange={(e) => setGender(e.target.value)} />
                <span className="ml-1">Femme</span>
              </label>
            </div>
            <button type="button" onClick={AddCounter} className="w-[75%] py-3 bg-[#274a43fd] text-white rounded-sm" disabled={loading}>{loading ? "Chargement..." : "SUIVANT"}</button>
          </div>
        </div>

        {/* Step 3 */}
        <div className={counter === 2 ? "px-32 basis-3/5" : "hidden"}>
          <h1 className="text-4xl font-bold text-stone-800 mb-8 text-left">S'inscrire</h1>
          <p className="text-stone-700 text-left mb-12 text-xl">Veuillez sélectionner votre photo de profil</p>

          <div className="flex flex-col items-center space-y-6">
            <img src={image ? URL.createObjectURL(image) : ProfileImage} alt="Profile" onClick={handleImageClick} className="w-64 h-64 rounded-full object-cover border-2 cursor-pointer hover:opacity-80" />
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <button type="submit" onClick={handleSubmit} className="w-[75%] py-3 bg-[#274a43fd] text-white rounded-sm" disabled={loading}>{loading ? "Chargement..." : "CONFIRMER"}</button>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default Register;
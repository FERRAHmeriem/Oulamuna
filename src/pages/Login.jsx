import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import image from "../assets/login_image.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../redux/user/userAction";

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const currentUser = useSelector((state) => state.user.currentUser);

 useEffect(() => {
  if (currentUser) {
    if (currentUser.role === "admin") {
      navigate("/admin_home");
    } else {
      navigate(`/profile/${currentUser._id}`);
    }
  }
}, [currentUser, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userName || !password) {
      toast.error("Veuillez remplir tous les champs !");
      return;
    }

    await dispatch(loginUser({ userName, password }));
    // Redirection happens in useEffect when currentUser is set
    
  };

  return (
    <div className="flex flex-col gap-[2%] justify-start h-screen bg-[#1A3A34]">
      <Header />
      <div className="flex items-center bg-[#EBE3CB] overflow-hidden mx-50 h-[85vh] rounded-4xl">
        <div className="p-12 basis-3/5">
          <h1 className="text-4xl font-bold text-stone-800 mb-8 text-left">
            Content De Te Revoir!!
          </h1>
          <p className="text-stone-700 text-left mb-12 leading-relaxed text-xl">
            Bienvenue ! Découvrez et célébrez l'héritage
            <br />
            des savants algériens
          </p>

          <div className="space-y-6">
            <input
              type="text"
              placeholder="NOM D'UTILISATEUR"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-[75%] px-4 py-3 border-2 border-[#1a3a34ab] rounded-sm placeholder-stone-600 text-stone-800 focus:outline-none focus:border-[#1A3A34] transition-colors"
            />
            <input
              type="password"
              placeholder="MOT DE PASSE"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-[75%] px-4 py-3 border-2 border-[#1a3a34ab] rounded-sm placeholder-stone-600 text-stone-800 focus:outline-none focus:border-[#1A3A34] transition-colors"
            />
            <button
              type="button"
              onClick={handleSubmit}
              className="w-[75%] py-3 bg-[#274a43fd] text-white font-medium tracking-wide rounded-sm hover:bg-[#1A3A34] transition-colors duration-200 cursor-pointer"
            >
              SE CONNECTER
            </button>
          </div>
        </div>
        <div className="basis-2/5">
          <img className="w-full" src={image} alt="image" />
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}

export default Login;

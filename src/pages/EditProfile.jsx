import React, { useRef, useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
} from "../redux/user/userSlice";
import "react-toastify/dist/ReactToastify.css";
import Header from "../components/Header";
import defaultImage from "../assets/profile_pic.png";
import axios from "axios";

const EditProfile = () => {
  const [step, setStep] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { currentUser } = useSelector((state) => state.user);

  const [firstName, setFirstName] = useState("");
  const [familyName, setFamilyName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [sexe, setSexe] = useState("");
  const [userName, setUserName] = useState("");
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setFirstName("");
      setFamilyName("");
      setEmail("");
      setBirthday("");
      setSexe("");
      setUserName("");
      setImage( defaultImage);
    }
  }, [currentUser]);

  const handleImageClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleNext = () => {
    if (step === 0) {
      setStep(1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("firstName", firstName || "");
    formData.append("familyName", familyName || "");
    formData.append("email", email || "");
    formData.append("birthday", birthday || "");
    formData.append("sexe", sexe || "");
    formData.append("userName", userName || "");
    if (imageFile) {
      formData.append("profileImage", imageFile);
    }

    try {
      dispatch(updateUserStart());

      const res = await axios.patch(
        `${import.meta.env.VITE_SERVER}/api/users/update/${currentUser._id}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${currentUser.token}`,
          },
        }
      );

      const updatedUser = res.data.user;

      dispatch(updateUserSuccess(updatedUser));
      localStorage.setItem("currentUser", JSON.stringify(updatedUser));

      toast.success("Profil mis à jour avec succès !");
      setTimeout(() => navigate(`/profile/${updatedUser._id}`), 1500);
    } catch (error) {
      console.error(error);
      dispatch(
        updateUserFailure(error.response?.data?.message || "Erreur lors de la mise à jour")
      );
      toast.error(
        error.response?.data?.message || "Erreur lors de la mise à jour"
      );
    }
  };

  return (
    <div className="flex flex-col gap-[2%] justify-start bg-[#1A3A34] min-h-screen">
      <Header />
      <div className="flex items-center bg-[#EBE3CB] my-20 mx-50 rounded-4xl p-16">
        {step === 0 && (
          <div className="w-full space-y-6">
            <h1 className="text-5xl font-bold text-[#193c35] text-center">
              MODIFIER MON PROFIL
            </h1>
            <input
              type="text"
              placeholder="Prénom"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="w-full border-2 border-[#193c35] rounded-md p-3"
            />
            <input
              type="text"
              placeholder="Nom"
              value={familyName}
              onChange={(e) => setFamilyName(e.target.value)}
              className="w-full border-2 border-[#193c35] rounded-md p-3"
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border-2 border-[#193c35] rounded-md p-3"
            />
            <input
              type="date"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
              className="w-full border-2 border-[#193c35] rounded-md p-3"
            />
            <select
              value={sexe}
              onChange={(e) => setSexe(e.target.value)}
              className="w-full border-2 border-[#193c35] rounded-md p-3"
            >
              <option value="">Sélectionnez le sexe</option>
              <option value="homme">Homme</option>
              <option value="femme">Femme</option>
              <option value="autre">Autre</option>
            </select>
            <input
              type="text"
              placeholder="Nom d'utilisateur"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full border-2 border-[#193c35] rounded-md p-3"
            />
            <div className="flex justify-center">
              <button
                onClick={handleNext}
                className="bg-[#193c35] text-white px-6 py-2 rounded-md hover:bg-[#0f2a25]"
              >
                SUIVANT
              </button>
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="w-full flex flex-col items-center justify-center text-[#193c35] gap-10">
            <h2 className="text-5xl font-bold">PHOTO DE PROFIL</h2>
            <div className="border-2 border-[#193c35] rounded-md bg-[#fdf1d3] p-6 w-[600px] text-center">
              <p className="font-semibold text-lg mb-4">
                Cliquez pour télécharger une nouvelle photo
              </p>
              <div
                onClick={handleImageClick}
                className="w-full flex justify-center cursor-pointer"
              >
                <img
                  src={image || defaultImage}
                  alt="photo profil"
                  className="w-52 h-52 mb-4 object-cover rounded-full"
                />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <button
              onClick={handleNext}
              className="bg-[#193c35] text-white px-6 py-2 rounded-md hover:bg-green-700"
            >
              ENREGISTRER
            </button>
          </div>
        )}
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default EditProfile;

import React, { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import Header from "../components/Header";
import defaultImage from "../assets/profile_pic.png";
import { EPOQUES, DOMAINS_EXPERTISE } from "../utils/Article_constant";
import { addScholar } from "../utils/Savant";

const AddSavant = () => {
  const [step, setStep] = useState(0);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [selectedEpoque, setSelectedEpoque] = useState(null);
  const [selectedDomaine, setSelectedDomaine] = useState(null);
  const [selectedDescription, setselectedDescription] = useState('')
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const { currentUser } = useSelector((state) => state.user);

  const toSelectOptions = (arr) =>
    arr.map((item) => ({ label: item, value: item }));

  const handleImageClick = () => fileInputRef.current.click();

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
      setImageFile(file);
    }
  };

  const handleNext = () => {
    if (step === 0) {
      if (
        name.trim().length < 2 ||
        !selectedEpoque ||
        !selectedDomaine
      ) {
        toast.error("Veuillez remplir tous les champs obligatoires !");
        return;
      }
    }
    if (step === 1) {
      if (!imageFile) {
        toast.error("Veuillez télécharger une photo !");
        return;
      }
      handleSubmit();
    } else {
      setStep(step + 1);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!imageFile) {
      toast.error("Veuillez sélectionner une image !");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("epoque", selectedEpoque?.value);
    formData.append("domaineExpertise", selectedDomaine?.value);
    formData.append("biography", selectedDescription);
    formData.append("picture", imageFile);
    console.log(formData.biography);
   
    try {
      const result = await addScholar(formData, currentUser.token);
      toast.success("Savant ajouté avec succès !");
      setTimeout(() => {
          navigate("/savants");
      }, 1000);
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Erreur lors de l'ajout du savant"
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
              AJOUTER UN SAVANT
            </h1>
            <input
              type="text"
              placeholder="Nom complet du savant"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border-2 border-[#193c35] rounded-md p-3 mb-4 text-[#193c35]"
            />
            <textarea
              placeholder="Biography du Savant"
              value={selectedDescription}
              onChange={(e) => setselectedDescription(e.target.value)}
              className="w-full border-2 border-[#193c35] rounded-md p-3 mb-4 text-[#193c35]"
            />
            <div className="mb-4">
              <label className="text-[#193c35] mb-1 block">Époque</label>
              <Select
                options={toSelectOptions(EPOQUES)}
                value={selectedEpoque}
                onChange={setSelectedEpoque}
                placeholder="Sélectionnez une époque"
              />
            </div>
            <div className="mb-4">
              <label className="text-[#193c35] mb-1 block">
                Domaine d'expertise
              </label>
              <Select
                options={toSelectOptions(DOMAINS_EXPERTISE)}
                value={selectedDomaine}
                onChange={setSelectedDomaine}
                placeholder="Sélectionnez un domaine"
              />
            </div>
            <div className="flex justify-center items-center">
              <button
                type="button"
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
            <h2 className="text-5xl font-bold">PHOTO DU SAVANT</h2>
            <div className="border-2 border-[#193c35] rounded-md bg-[#fdf1d3] p-6 w-[600px] text-center">
              <p className="font-semibold text-lg mb-4">
                Veuillez télécharger une photo
              </p>
              <div
                onClick={handleImageClick}
                className="w-full flex justify-center cursor-pointer"
              >
                <img
                  src={image || defaultImage}
                  alt="photo savant"
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

export default AddSavant;

import React, { useRef, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import Header from "../components/Header";
import defaultImage from "../assets/profile_pic.png";
import { EPOQUES, DOMAINS_EXPERTISE } from "../utils/Article_constant";

const AddSavant = () => {
  const [step, setStep] = useState(0);
  const fileInputRef = useRef(null);

  const [name, setName] = useState("");
  const [selectedEpoque, setSelectedEpoque] = useState(null);
  const [selectedDomaine, setSelectedDomaine] = useState(null);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const toSelectOptions = (arr) => arr.map((item) => ({ label: item, value: item }));

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
      if (name.trim().length < 2 || !selectedEpoque || !selectedDomaine) {
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

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("epoque", selectedEpoque.value);
    formData.append("domaineExpertise", selectedDomaine.value);
    formData.append("picture", imageFile);

    console.log("Savant soumis :", {
      name,
      epoque: selectedEpoque.value,
      domaineExpertise: selectedDomaine.value,
      picture: imageFile,
    });

    toast.success("Savant ajouté avec succès !");
  };

  return (
    <div className="flex flex-col gap-[2%] justify-start bg-[#1A3A34] min-h-screen">
      <Header />
      <div className="flex items-center bg-[#EBE3CB] my-20 mx-50 rounded-4xl p-16">
        {/* Étape 1 : Infos du savant */}
        {step === 0 && (
          <div className="w-full space-y-6">
            <h1 className="text-5xl font-bold text-[#193c35] text-center">AJOUTER UN SAVANT</h1>
            <input
              type="text"
              placeholder="Nom complet du savant"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              <label className="text-[#193c35] mb-1 block">Domaine d'expertise</label>
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

        {/* Étape 2 : Téléchargement photo */}
        {step === 1 && (
          <div className="w-full flex flex-col items-center justify-center text-[#193c35] gap-10">
            <h2 className="text-5xl font-bold">PHOTO DU SAVANT</h2>
            <div className="border-2 border-[#193c35] rounded-md bg-[#fdf1d3] p-6 w-[600px] text-center">
              <p className="font-semibold text-lg mb-4">Veuillez télécharger une photo</p>
              <div onClick={handleImageClick} className="w-full flex justify-center cursor-pointer">
                <img src={image || defaultImage} alt="photo savant" className="w-52 h-52  mb-4 object-cover rounded-full" />
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

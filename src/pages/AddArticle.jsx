// AddArticle.jsx
import React, { useState, useRef } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import Header from "../components/Header";
import ArticleAjouter from "../assets/addArticle.png";
import imageDeposée from "../assets/imagedepose.png";
import videoDeposée from "../assets/videodepose.png";
import {
  EPOQUES,
  LANGUAGES,
  DOMAINS_EXPERTISE,
} from "../utils/Article_constant";

const AddArticle = () => {
  const [counter, setCounter] = useState(0);
  const fileInputRef = useRef(null);
  const [titre, setTitre] = useState("");
  const [subStep, setSubStep] = useState(0);
  const [description, setDescription] = useState("");
  const [selectedEpoque, setSelectedEpoque] = useState(null);
  const [selectedLangue, setSelectedLangue] = useState(null);
  const [selectedDomaines, setSelectedDomaines] = useState([]);
  const [image, setImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [sections, setSections] = useState([
    { title: "", content: "", pictures: [], videos: [], order: 1 },
    { title: "", content: "", pictures: [], videos: [], order: 2 },
  ]);

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

  const AddCounter = () => {
    if (
      (counter === 0 && titre && selectedEpoque && selectedLangue && selectedDomaines.length > 0) ||
      (counter === 1 && imageFile)
    ) {
      setCounter((prev) => prev + 1);
    } else {
      toast.error("Veuillez remplir tous les champs obligatoires !");
    }
  };

  const isSectionValid = (section) => {
    const hasMedia = section.pictures.length > 0 || section.videos.length > 0;
    return section.title.trim() !== "" && section.content.trim() !== "" && hasMedia;
  };

  const handleSectionChange = (index, field, value) => {
    const updated = [...sections];
    updated[index][field] = value;
    setSections(updated);
  };

  const addSection = () => {
    setSections([...sections, { title: "", content: "", pictures: [], videos: [], order: sections.length + 1 }]);
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    if (!imageFile) {
      toast.error("Veuillez sélectionner une image !");
      return;
    }
    const data = new FormData();
    data.append("titre", titre);
    data.append("description", description);
    data.append("epoque", selectedEpoque?.value);
    data.append("langue", selectedLangue?.value);
    data.append("domaines", JSON.stringify(selectedDomaines.map((d) => d.value)));
    data.append("image", imageFile);
    data.append("sections", JSON.stringify(sections));

    console.log("Formulaire soumis :", {
      titre,
      description,
      epoque: selectedEpoque?.value,
      langue: selectedLangue?.value,
      domaines: selectedDomaines.map((d) => d.value),
      imageFile,
      sections,
    });

    toast.success("Article enregistré avec succès !");
  };

  return (
    <div className="flex flex-col gap-[2%] justify-start bg-[#1A3A34] min-h-screen">
      <Header />
      <div className="flex items-center bg-[#EBE3CB] my-20 mx-50 rounded-4xl p-16">
        {/* Étape 1 */}
        <div className={counter === 0 ? "w-full space-y-6" : "hidden"}>
          <h1 className="text-5xl font-bold text-[#193c35] text-center">CRÉER UN NOUVEL ARTICLE</h1>
          <input type="text" placeholder="Titre de l'article" value={titre} onChange={(e) => setTitre(e.target.value)} className="w-full border-2 border-[#193c35] rounded-md p-3 mb-4 text-[#193c35]" />
          <textarea rows="5" placeholder="Description (facultatif)" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full border-2 border-[#193c35] rounded-md p-3 mb-4 text-[#193c35]" />
          <div className="mb-4">
            <label className="text-[#193c35] mb-1 block">Époque</label>
            <Select options={toSelectOptions(EPOQUES)} value={selectedEpoque} onChange={setSelectedEpoque} placeholder="Sélectionnez une époque" />
          </div>
          <div className="mb-4">
            <label className="text-[#193c35] mb-1 block">Langue</label>
            <Select options={toSelectOptions(LANGUAGES)} value={selectedLangue} onChange={setSelectedLangue} placeholder="Sélectionnez une langue" />
          </div>
          <div className="mb-6">
            <label className="text-[#193c35] mb-1 block">Domaines d'expertise</label>
            <Select isMulti options={toSelectOptions(DOMAINS_EXPERTISE)} value={selectedDomaines} onChange={setSelectedDomaines} placeholder="Sélectionnez un ou plusieurs domaines" />
          </div>
          <div className="flex justify-center items-center">
            <button type="button" onClick={AddCounter} className="bg-[#193c35] text-white px-6 py-2 rounded-md hover:bg-[#0f2a25]">SUIVANT</button>
          </div>
        </div>

        {/* Étape 2 */}
        <div className={counter === 1 ? "w-full flex flex-col items-center justify-center text-[#193c35] gap-10" : "hidden"}>
          <h2 className="text-5xl font-bold">CRÉER UN NOUVEL ARTICLE</h2>
          <div className="border-2 border-[#193c35] rounded-md bg-[#fdf1d3] p-6 w-[600px] text-center">
            <p className="font-semibold text-lg mb-4">Veuillez télécharger une photo miniature</p>
            <div onClick={handleImageClick} className="w-full flex justify-center cursor-pointer">
              <img src={image || ArticleAjouter} alt="miniature" className="w-52 mb-4 object-cover rounded-md" />
            </div>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
          </div>
          <button onClick={AddCounter} className="bg-[#193c35] text-white px-6 py-2 rounded-md hover:bg-[#0f2a25]">SUIVANT</button>
        </div>

        {/* Étape 3 */}
        <div className={counter === 2 ? "w-full" : "hidden"}>
          <h2 className="text-4xl font-bold text-center text-[#193c35] mb-6">SECTIONS DE L'ARTICLE</h2>
          <div className="space-y-6">
            {sections.map((section, idx) => (
              <div key={idx} className={subStep === idx ? "block" : "hidden"}>
                <h3 className="text-2xl font-bold mb-2">Section {idx + 1}</h3>
                <input type="text" placeholder="Titre" value={section.title} onChange={(e) => handleSectionChange(idx, "title", e.target.value)} className="w-full border p-2 mb-2" />
                <textarea rows="4" placeholder="Contenu" value={section.content} onChange={(e) => handleSectionChange(idx, "content", e.target.value)} className="w-full border p-2 mb-4" />
                <div className="flex items-center justify-around">
                <div className="mb-4 flex flex-col items-center">
                  <label className="font-semibold text-lg block mb-2 text-[#193c35]">Ajouter une ou plusieurs images</label>
                  <div className="cursor-pointer w-40" onClick={() => document.getElementById(`img-upload-${idx}`).click()}>
                    <img src={imageDeposée} alt="Uploader une image" className="w-40 border rounded-md hover:opacity-80 cursor-pointer" />
                  </div>
                  <input type="file" id={`img-upload-${idx}`} accept="image/*" multiple className="hidden" 
                    onChange={(e) => {
                    const files = Array.from(e.target.files).map((file) => ({ file, preview: URL.createObjectURL(file) }));
                    const updated = [...sections];
                    updated[idx].pictures = [...updated[idx].pictures, ...files];
                    setSections(updated);
                  }} />
                  <div className="flex flex-wrap gap-2 mt-2">
                    {section.pictures.map((img, i) => (
                      <img key={i} src={img.preview} alt={`img-${i}`} className="w-24 h-24 object-cover border rounded" />
                    ))}
                  </div>
                </div>

                <div className="mb-4 flex flex-col items-center">
                  <label className="font-semibold text-lg block mb-2 text-[#193c35]">Ajouter une ou plusieurs vidéos</label>
                  <div className="cursor-pointer w-40" onClick={() => document.getElementById(`vid-upload-${idx}`).click()}>
                    <img src={videoDeposée} alt="Uploader une vidéo" className="w-40 border rounded-md hover:opacity-80" />
                  </div>
                  <input type="file" id={`vid-upload-${idx}`} accept="video/*" multiple className="hidden" onChange={(e) => {
                    const files = Array.from(e.target.files).map((file) => ({ file, preview: URL.createObjectURL(file) }));
                    const updated = [...sections];
                    updated[idx].videos = [...updated[idx].videos, ...files];
                    setSections(updated);
                  }} />
                  <div className="flex flex-wrap gap-4 mt-2">
                    {section.videos.map((vid, i) => (
                      <video key={i} src={vid.preview} controls className="w-48 h-32 border rounded" />
                    ))}
                  </div>
                </div>
                </div>
              </div>
            ))}

            <div className="flex justify-between mt-4">
              <button disabled={subStep === 0} onClick={() => setSubStep(subStep - 1)} className="bg-gray-500 text-white px-4 py-2 rounded disabled:opacity-50">Précédent</button>
              {subStep < sections.length - 1 ? (
                <button onClick={() => {
                  if (isSectionValid(sections[subStep])) {
                    setSubStep(subStep + 1);
                  } else {
                    toast.error("Veuillez remplir tous les champs de la section !");
                  }
                }} className="bg-[#193c35] text-white px-4 py-2 rounded">Suivant</button>
              ) : (
                <button onClick={() => {
                  if (isSectionValid(sections[subStep])) {
                    handleSubmit();
                  } else {
                    toast.error("Veuillez remplir tous les champs de la section !");
                  }
                }} className="bg-green-600 text-white px-4 py-2 rounded">Soumettre</button>
              )}
            </div>
            <button onClick={addSection} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">Ajouter une section</button>
          </div>
        </div>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default AddArticle;

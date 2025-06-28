import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Header from '../components/Header';
import bookOpen from '../assets/book-open.png';
import comment from '../assets/comment.png';
import grid from '../assets/grid.png';
import clock from '../assets/clock.png';
import heart from '../assets/heart.png';
import background from '../assets/savant_background.png'; 
import profile_pic from '../testingImages/iM.jpg';


import ArticleCard from '../components/ArticleCard';
import image1 from "../testingImages/image1.jpg"
import image2 from "../testingImages/image2.jpg"
import image3 from "../testingImages/image3.jpg"

function Profile() {
  const [user, setUser] = useState(null);
  const [filteredArticles , setfilteredArticles] =useState(articles)
  const [data, setData] = useState({
    nombreArticle: 12,
    nombreLikes: 48,
    nombreComments: 25,
    nombreCategory: 5,
    lecture: '1h 45min',
  });

  const { currentUser } = useSelector((state) => state.user);
  const { id } = useParams();

  useEffect(() => {
    if (currentUser && currentUser._id === id) {
      setUser(currentUser);
    } else {
      // Simulate fetch from backend (you can replace this with real API call)
      setUser({
        _id: id,
        username: "MeriemFrrh",
        ProfileImage: profile_pic,
        email: "mm_ferrah@esi.dz",
        sexe:'femme',
        firstName:'Meriem',
        familyName:'Ferrah',
        birthday:'2004-12-10'

      });
    }
  }, [id, currentUser]);
function getAge(birthday) {
  const birthDate = new Date(birthday);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
if (!user) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <div className='space-y-32 bg-[#173B33]'>
        <div className="w-full mb-64 relative">
          <img src={background} alt="background" className="w-full h-[300px] object-cover" />
          <div className="absolute w-screen right-0 bottom-[-200px]  text-center flex items-center justify-around gap-16 ">
            <img
              src={user.ProfileImage}
              alt="image"
              className="w-72 h-72 rounded-full object-cover shadow-stone-700 shadow-xl"
            />
            <span className="block text-4xl font-semibold text-[#F4ECD3] mt-2">{user.username}</span>
            {(currentUser?._id === id) ? (
              <button className="mt-2 px-4 py-2 text-[#F4ECD3] bg-[#202E2C] text-lg font-semibold rounded-lg cursor-pointer hover:scale-101">Modifier le Profile</button>
            ) : (
              <div></div>
            )}
          </div>
        </div>

            <div className='rounded-lg bg-[#F4ECD3] flex items-stretch justify-between  shadow-lg shadow-stone-700  mx-16 gap-4'>
        {[
          { label: 'Articles', icon: bookOpen, value: data.nombreArticle },
          { label: 'Likes reçues', icon: heart, value: data.nombreLikes },
          { label: 'Commentaires reçus', icon: comment, value: data.nombreComments },
          { label: 'Catégories explorées', icon: grid, value: data.nombreCategory },
          { label: 'Temps de lecture', icon: clock, value: data.lecture },
        ].map((item, index) => (
          <div
            key={index}
            className='flex-1 rounded-lg bg-[#EBE3CB] shadow-lg shadow-stone-700  flex flex-col items-center justify-center gap-2 p-4'
          >
            <p className='text-2xl text-stone-800 font-semibold text-center'>{item.label}</p>
            <img src={item.icon} alt="" className='w-26 h-26' />
            <p className="text-xl text-[#173B33] font-bold">{item.value}</p>
          </div>
        ))}
      </div>


        <div className='flex items-start mx-16 gap-4 '>
          <div className='basis-1/4  mt-10 bg-[#F4ECD3] rounded-lg shadow-lg shadow-stone-700 p-8'>
            <h2 className='text-3xl font-bold text-[#173B33] mb-6'>Infos personnelles</h2>
            <div className='flex flex-col gap-4 text-xl text-stone-800'>
              <div className='flex items-center justify-between '>
                <p className='font-semibold'>Nom de l’auteur :</p>
                <p>{user.firstName} {user.familyName}</p>
              </div>
              <div className='flex items-center gap-4'>
                <p className='font-semibold'>Email :</p>
                <p>{user.email}</p>
              </div>
              <div className='flex items-center gap-4'>
                <p className='font-semibold'>Âge :</p>
                <p>{getAge(user.birthday)} ans</p>
              </div>
              <div className='flex items-center gap-4'>
                <p className='font-semibold'>Sexe :</p>
                <p>{user.sexe}</p>
              </div>
            </div>
          </div>

          <div className='basis-3/4 mt-10 bg-[#F4ECD3] rounded-lg shadow-lg shadow-stone-700 p-8 '>
          <h1 className='text-3xl font-bold text-[#173B33] mb-6'>Les articles de {user.username}</h1>
             <div className="grid grid-cols-2 justify-center gap-4">
            {filteredArticles.map((article, index) => (
                <ArticleCard key={index} article ={article}  />
            ))}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
const articles = [
  {
    "title": "L'engagement de Abdelhamid Ben Badis pour l'éducation",
    "description": "Abdelhamid Ben Badis a consacré sa vie à la diffusion du savoir dans un contexte colonial difficile. À travers des écoles et des enseignements novateurs, il a permis l’éveil d’une génération prête à défendre son identité nationale. Son approche était centrée sur la pédagogie islamique moderne, conjuguant foi, science et ouverture au monde.",
    "scholarName": "Abdelhamid Ben Badis",
    "scholarId": 1,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Éducation",
    "imageArticle": {
      "url": image1
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Abdelhamid Ben Badis et la construction de l'identité algérienne",
    "description": "L’œuvre de Abdelhamid Ben Badis s’inscrit dans la résistance intellectuelle à la domination coloniale. En mettant en avant l’histoire, la langue et la foi, il a restauré chez les Algériens la fierté d’être eux-mêmes. Son discours, profondément enraciné dans les valeurs nationales, a contribué à forger l’unité du peuple.",
    "scholarName": "Abdelhamid Ben Badis",
    "scholarId": 1,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Identité nationale",
    "imageArticle": {
      "url": image1
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Réformes religieuses proposées par Abdelhamid Ben Badis",
    "description": "Réformateur dans l’âme, Abdelhamid Ben Badis souhaitait purifier l’islam des pratiques étrangères à sa source. Il prônait un retour aux textes fondamentaux, dans une lecture adaptée à son époque. Sa pensée religieuse était critique, moderne, et en phase avec les défis sociaux et politiques de son temps.",
    "scholarName": "Abdelhamid Ben Badis",
    "scholarId": 1,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Réforme religieuse",
    "imageArticle": {
      "url": image1
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Spiritualité dans la pensée de Abdelhamid Ben Badis",
    "description": "La spiritualité était au cœur de la démarche de Abdelhamid Ben Badis. Pour lui, la foi ne se limitait pas aux rituels, mais s’exprimait dans le comportement, la justice et le service de la communauté. Il insistait sur une religion vécue intérieurement, fondée sur la sincérité et l’exemplarité.",
    "scholarName": "Abdelhamid Ben Badis",
    "scholarId": 1,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Spiritualité",
    "imageArticle": {
      "url":image1
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Réformes religieuses proposées par Si M'hamed Ben Rahal",
    "description": "Réformateur dans l’âme, Si M'hamed Ben Rahal souhaitait purifier l’islam des pratiques étrangères à sa source. Il prônait un retour aux textes fondamentaux, dans une lecture adaptée à son époque. Sa pensée religieuse était critique, moderne, et en phase avec les défis sociaux et politiques de son temps.",
    "scholarName": "Si M'hamed Ben Rahal",
    "scholarId": 6,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Réforme religieuse",
    "imageArticle": {
      "url": image1
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "Spiritualité dans la pensée de Si M'hamed Ben Rahal",
    "description": "La spiritualité était au cœur de la démarche de Si M'hamed Ben Rahal. Pour lui, la foi ne se limitait pas aux rituels, mais s’exprimait dans le comportement, la justice et le service de la communauté. Il insistait sur une religion vécue intérieurement, fondée sur la sincérité et l’exemplarité.",
    "scholarName": "Si M'hamed Ben Rahal",
    "scholarId": 6,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Spiritualité",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "La langue et la culture chez Si M'hamed Ben Rahal",
    "description": "La défense de la langue était pour Si M'hamed Ben Rahal un acte de résistance. Il la considérait comme un vecteur fondamental de la culture et de l’identité. En écrivant, enseignant et publiant, il s’opposa à la francisation et œuvra à la renaissance linguistique et culturelle de l’Algérie.",
    "scholarName": "Si M'hamed Ben Rahal",
    "scholarId": 6,
    "epoque": "Coloniale",
    "articleLanguage": "fr",
    "domaineExpertise": "Linguistique",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  },
  {
    "title": "L'éthique dans la vie de Si M'hamed Ben Rahal",
    "description": "Si M'hamed Ben Rahal incarnait une éthique rigoureuse. Son intégrité, sa sincérité et son engagement faisaient de lui un modèle. Il refusa les compromissions, défendit les plus faibles et fit toujours passer l’intérêt général avant ses intérêts personnels. Sa vie fut un exemple de droiture morale.",
    "scholarName": "Si M'hamed Ben Rahal",
    "scholarId": 6,
    "epoque": "Coloniale",
    "articleLanguage": "ar",
    "domaineExpertise": "Éthique",
    "imageArticle": {
      "url": image2
    },
    "sections": [],
    "pdfFiles": [],
    "author": "665ed80d4e76fbd63f08a58a"
  }
];
import React from 'react'
import { useParams } from 'react-router-dom'
import background from "../assets/savant_background.png"
import Header from '../components/Header'
import ArticleParSavant from '../components/ArticleParSavant'


import image1 from '../testingImages/Abdelhamid Ben Badis.jpg'
import image2 from '../testingImages/khaled_el_hassani_ben_el_hachmi.png'
import image3 from '../testingImages/alarbi-tbass.jpg'
import image4 from '../testingImages/Malek Bennabi.jpg'
import image5 from '../testingImages/Moufdi Zakaria.jpg'
import image6 from '../testingImages/Si_mhamed_ben_rahal.png'


function Savant() {
  const { id } = useParams();
  //fetching the savant by id
  const savantId = parseInt(id); 
  const savant = ListeSavantData.find((savant) => savant.id === savantId);
  return (
    <div>
        <Header/>
        <div className='space-y-32'>
           <div className="w-full relative">
            <img src={background} alt="background" className="w-full object-cover " />

            <div className="absolute left-1/2 bottom-[-52px] transform -translate-x-1/2">
                <img
                src={savant.image}
                alt={savant.name}
                className="w-120 h-120 rounded-full object-cover shadow-stone-700 shadow-xl"
                />
            </div>
            </div>

            <div className='space-y-4 px-32'> 
                <h1 className='text-center font-semibold text-stone-800 text-5xl'>{savant.name}</h1>
                <p className='text-center  text-stone-800 text-xl' >{savant.description}</p>
            </div>
            <div className='px-16'>
                <ArticleParSavant savantId={savant.id}/>
            </div>
        </div>
    </div>
  )
}

export default Savant
const ListeSavantData = [
  {
    id: 1,
    name: "Abdelhamid Ben Badis",
    image: image1,
    description: "Abdelhamid Ben Badis (1889-1940) fut une figure majeure du renouveau islamique en Algérie durant l'époque coloniale. Visionnaire et réformateur, il a consacré sa vie à défendre l'identité arabo-musulmane du peuple algérien, menacée par la politique d’assimilation française. Il a fondé l'Association des Ulémas Musulmans Algériens en 1931, à travers laquelle il a promu une éducation moderne, la purification de l'islam des pratiques superstitieuses et la valorisation de la langue arabe. Ses écoles ont permis à des milliers d'Algériens de s’instruire et de résister pacifiquement à la domination culturelle coloniale. Ben Badis est aujourd’hui considéré comme le père spirituel du nationalisme algérien moderne."
  },
  {
    id: 2,
    name: "Khaled El Hassani Ben El Hachmi",
    image: image2,
    description: "Émir Khaled (1875-1936), petit-fils de l'Émir Abdelkader, est l’un des premiers leaders politiques algériens à revendiquer l’égalité des droits entre Algériens et Français. Officier de l’armée, puis homme politique, il a utilisé sa notoriété et son statut social pour défendre les intérêts des Algériens au sein du Parlement français. Refusant de rester silencieux face aux injustices coloniales, il a porté les revendications de son peuple sur la scène internationale. Son combat, bien que limité par les lois coloniales, a inspiré toute une génération de militants nationalistes et semé les premières graines d’une résistance politique organisée en Algérie."
  },
  {
    id: 3,
    name: "Alarbi Tbassi",
    image: image3,
    description: "Alarbi Tbassi fut l’un des compagnons les plus fidèles d’Abdelhamid Ben Badis au sein de l’Association des Ulémas Musulmans Algériens. Enseignant, intellectuel et militant engagé, il a joué un rôle central dans la diffusion de l’éducation religieuse et patriotique. Tbassi croyait fermement que la régénération de l’Algérie passait par la réforme de l’islam, la connaissance et la conscience identitaire. À travers ses sermons, ses cours et ses écrits, il a contribué à éveiller les consciences et à résister à l’effacement culturel imposé par la colonisation. Il est considéré comme l’un des piliers de la réforme islamique en Algérie."
  },
  {
    id: 4,
    name: "Malek Bennabi",
    image: image4,
    description: "Malek Bennabi (1905-1973) est un penseur algérien majeur du XXe siècle, reconnu pour ses réflexions profondes sur la décadence du monde musulman et les voies de sa renaissance. Auteur du célèbre concept de « colonisabilité », il affirme que la faiblesse des sociétés musulmanes réside dans leur perte de créativité et leur soumission mentale. Dans ses ouvrages, il analyse les causes du déclin civilisationnel islamique et appelle à une reconstruction culturelle fondée sur la science, la spiritualité et la pensée critique. Son œuvre, traduite dans plusieurs langues, influence encore aujourd’hui de nombreux intellectuels dans le monde islamique. Il a joué un rôle déterminant dans la formation idéologique de la jeunesse algérienne indépendante."
  },
  {
    id: 5,
    name: "Moufdi Zakaria",
    image: image5,
    description: "Moufdi Zakaria (1908-1977), surnommé le poète de la Révolution, est l’auteur des paroles de l’hymne national algérien « Kassaman ». Nationaliste convaincu, il a utilisé la poésie comme arme de résistance contre l’occupation française. Son œuvre est traversée par un patriotisme ardent, une foi inébranlable dans la liberté de l’Algérie et un style lyrique saisissant. Il fut emprisonné plusieurs fois pour ses prises de position politiques, mais cela n’a jamais entamé son engagement. Moufdi Zakaria a légué à la nation un héritage culturel et identitaire précieux, à travers lequel la voix du peuple algérien continue de résonner."
  },
  {
    id: 6,
    name: "Si M'hamed Ben Rahal",
    image: image6,
    description: "Si M’hamed Ben Rahal fut un savant et enseignant très respecté dans les cercles religieux algériens, notamment dans les zaouïas. Profondément attaché à la tradition islamique, il a joué un rôle de passeur de savoir à une époque où l’enseignement religieux subissait de fortes pressions sous la colonisation. Par son engagement discret mais déterminé, il a contribué à préserver l'identité spirituelle de nombreuses communautés rurales. Il est également connu pour son humilité, sa sagesse et son attachement aux valeurs morales et éducatives de l’islam. Son influence, bien que locale, a marqué durablement les esprits de ceux qu’il a formés."
  }
];


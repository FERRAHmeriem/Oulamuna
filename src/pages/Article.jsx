import React from 'react'
import { Link, useParams } from 'react-router-dom'
import Header from "../components/Header"
import image1 from "../testingImages/image1.jpg"
import image2 from "../testingImages/image2.jpg"
import image3 from "../testingImages/image3.jpg"
import savant from "../testingImages/Abdelhamid Ben Badis.jpg"
import video1 from "../testingImages/video1.mp4"
import video2 from "../testingImages/video2.mp4"

import comment from '../assets/comment.png';
import heart from '../assets/heart.png';

function Article() {
  const { id } = useParams();

  // Mock article data
  const article = {
    title: "L'engagement de Abdelhamid Ben Badis pour l'éducation",
    description:
      "Abdelhamid Ben Badis a consacré sa vie à la diffusion du savoir dans un contexte colonial difficile. À travers des écoles et des enseignements novateurs, il a permis l’éveil d’une génération prête à défendre son identité nationale. Son approche était centrée sur la pédagogie islamique moderne, conjuguant foi, science et ouverture au monde.",
    scholarName: "Abdelhamid Ben Badis",
    scholarId: 1,
    scholarImage: savant,
    publishedAt: "1930-01-01",
    epoque: "Coloniale",
    articleLanguage: "fr",
    domaineExpertise: "Éducation",
    imageArticle: {
      url: image1,
    },
    sections: [
      {
        title: "Un système éducatif modernisé",
        content:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur? ",
        pictures: [
          { url: image2 },
          { url: image3 },
        ],
        videos: [
          { url: video1 }
        ],
        order: 1,
      },
      {
        title: "Le rôle des mosquées et des cercles de savoir",
        content:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
        pictures: [
          { url: image1 }
        ],
        videos: [
          { url: video2 },
          { url: video2 },
        ],
        order: 2,
      },{
        title: "Le rôle des mosquées et des cercles de savoir",
        content:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
        pictures: [
          { url: image1 }
        ],
        videos: [],
        order: 3,
      },{
        title: "Conclusion",
        content:
          "Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?",
        pictures: [],
        videos: [],
        order: 4,
      }
    ],
    pdfFiles: [],
    author: "665ed80d4e76fbd63f08a58a"
  };

  return (
    <div>
      <Header />
      <div className='m-16 p-16  space-y-16'>
        <div className='flex w-full items-start justify-between'>
          <div className='basis-3/4 space-y-4'>
            <h1 className='font-bold text-stone-800 text-5xl'>{article.title}</h1>
            <p className=' text-stone-800 text-lg'>{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{article.description}</p>
          </div>
          <div className='basis-1/4 flex flex-col items-center justify-center gap-2'>
            <img src={article.scholarImage} alt="image savant" className='w-42 h-42 object-cover' />
            <Link to={`/Savant/${article.scholarId}`} className='font-semibold text-[#2f7062] text-lg'>{article.scholarName}</Link>
            <h3 className='font-semibold text-stone-800 text-lg'>{article.publishedAt}</h3>
          </div>
        </div>

        <div className='space-y-6'>
          {article.sections.map((section, index) => (
            <div key={index} className='flex flex-col gap-4 items-center justify-center'>
              <div className='flex align-start justify-between gap-4 w-full'>
                <div className={section.pictures.length > 0 ? "basis-3/4 space-y-4" : "space-y-4"}>
                  <h1 className='font-bold text-stone-800 text-4xl'>{section.title}</h1>
                  <p className=' text-stone-800 text-lg'>{'\u00A0'}{'\u00A0'}{'\u00A0'}{'\u00A0'}{section.content}</p>
                </div>
                <div className="basis-1/4 flex flex-col items-center justify-center gap-1">
                  {section.pictures.map((picture, idx) => (
                    <img key={idx} src={picture.url} alt={`section-${index}-image-${idx}`} className='w-42 h-42 object-cover rounded-lg shadow-lg shadow-stone-400' />
                  ))}
                </div>
              </div>

              {section.videos.length > 0 && (
                <div
                  className={`my-4 w-full gap-4 flex flex-wrap ${
                    section.videos.length === 1 || section.videos.length % 2 !== 0
                      ? "justify-center"
                      : "justify-between"
                  }`}
                >
                  {section.videos.map((video, idx) => (
                    <div key={idx} className='w-full md:w-[48%] h-64'>
                      <video controls className='w-full h-full rounded-lg shadow-lg shadow-stone-400'>
                        <source src={video.url} type="video/mp4" />
                      </video>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
           <div className='rounded-lg bg-[#F4ECD3] flex items-center  shadow-lg shadow-stone-400 px-72 m-16 gap-6'>
              {[
                { label: 'Likes reçues', icon: heart, value:  130 },
                { label: 'Commentaires reçus', icon: comment, value: 120 },
              ].map((item, index) => (
                <div
                  key={index}
                  className='basis-1/2 rounded-lg bg-[#EBE3CB] shadow-lg shadow-stone-400  flex flex-col items-center justify-center gap-2 p-2  '
                >
                  <p className='text-xl text-stone-800 font-semibold text-center'>{item.label}</p>
                  <img src={item.icon} alt="" className='w-20 h-20' />
                  <p className="text-xl text-[#173B33] font-bold">{item.value}</p>
                </div>
              ))}
            </div>
    </div>
  )
}

export default Article

import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Header from '../components/Header';
import { getArticle, toggleLike, addComment } from '../utils/Article';
import comment from '../assets/commentaire.png';
import heart from '../assets/empty_heart.png';
import like from '../assets/like.png';
import { ClipLoader } from 'react-spinners';
import { useSelector } from 'react-redux';

function Article() {
  const { id } = useParams();
  const { currentUser } = useSelector((state) => state.user);

  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedByUser, setLikedByUser] = useState('');
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [commentContent, setCommentContent] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      const data = await getArticle(id , currentUser?.token);
      setArticle(data);
      console.log('Article data:', data);
      const sorted = data.comments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComments(sorted);
      const hasLiked = data.likes?.some(like => like.user._id === currentUser._id);
      setLikedByUser(hasLiked);
      setLikesCount(data.likesCount || 0);
      setLoading(false);
    };
    fetchArticle();
  }, [id]);

  const handleLike = async () => {
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await toggleLike(article._id, currentUser.token);
      setLikedByUser(res.data.userHasLiked);
      setLikesCount(res.data.likesCount);
    } catch (error) {
      console.error('Erreur lors du like :', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;
    try {
      const res = await addComment(article._id, commentContent, null, currentUser.token);
      setComments((prev) => [res.data, ...prev]);
      setCommentContent('');
    } catch (err) {
      console.error('Erreur commentaire:', err);
    }
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    if (!replyContent.trim()) return;
    try {
      const res = await addComment(article._id, replyContent, parentId, currentUser.token);
      setComments((prev) => [res.data, ...prev]);
      setReplyingTo(null);
      setReplyContent('');
    } catch (err) {
      console.error('Erreur réponse:', err);
    }
  };

  const getRelativeDate = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHr = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHr / 24);

    if (diffDay === 0) return `Aujourd'hui à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDay === 1) return `Hier à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDay < 7) return `Il y a ${diffDay} jours à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    if (diffDay < 14) return `Il y a une semaine à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
    return `${date.toLocaleDateString('fr-FR')} à ${date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
  };

  const renderComments = (comments) => {
    const parents = comments.filter((c) => !c.parentComment);
    const childrenByParent = {};

    comments.forEach((comment) => {
      if (comment.parentComment) {
        const parentId = comment.parentComment;
        if (!childrenByParent[parentId]) {
          childrenByParent[parentId] = [];
        }
        childrenByParent[parentId].push(comment);
      }
    });

    return parents.map((comment) => (
      <div key={comment._id} className="mb-4">
        <div className="bg-[#FAF9F6] p-4 rounded shadow">
          <div className="flex items-center gap-3 mb-2">
            <img
              src={`${import.meta.env.VITE_SERVER}/api/uploads/${comment.author.profileImage}`}
              className="w-10 h-10 rounded-full"
              alt="author"
            />
            <div>
              <p className="font-semibold">{comment.author.firstName} {comment.author.familyName}</p>
              <p className="text-sm text-gray-500">@{comment.author.userName}</p>
              <p className="text-xs text-gray-400">{getRelativeDate(comment.createdAt)}</p>
            </div>
          </div>
          <p className="text-gray-800">{comment.content}</p>
          <button
            onClick={() => setReplyingTo(comment._id)}
            className="text-blue-500 text-sm mt-1 hover:underline"
          >
            Répondre
          </button>

          {replyingTo === comment._id && (
            <form onSubmit={(e) => handleReplySubmit(e, comment._id)} className="mt-2 flex items-center justify-center gap-6">
              <input
                type="text"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Votre réponse..."
                className="w-full p-2 border border-gray-300 rounded"
              />
              <button type="submit" className="mt-1 text-white bg-[#2f7062] px-4 py-1 rounded">
                Envoyer
              </button>
            </form>
          )}
        </div>

        {childrenByParent[comment._id] &&
          childrenByParent[comment._id].map((reply) => (
            <div key={reply._id} className="ml-12 mt-2 bg-[#F9F6F0] p-4 rounded shadow">
              <div className="flex items-center gap-3 mb-2">
                <img
                  src={`${import.meta.env.VITE_SERVER}/api/uploads/${reply.author.profileImage}`}
                  className="w-8 h-8 rounded-full"
                  alt="reply-author"
                />
                <div>
                  <p className="font-semibold text-sm">{reply.author.firstName} {reply.author.familyName}</p>
                  <p className="text-xs text-gray-500">@{reply.author.userName}</p>
                  <p className="text-xs text-gray-400">{getRelativeDate(reply.createdAt)}</p>
                </div>
              </div>
              <p className="text-gray-800 text-sm">{reply.content}</p>
            </div>
          ))}
      </div>
    ));
  };
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={80} color="#2f7062" />
      </div>
    );
  }

  return (
    <div>
      <Header />
      <div className="m-16 p-16 space-y-16">
        {/* Infos Article */}
        <div className="flex w-full items-start justify-between">
          <div className="basis-3/4 space-y-4">
            <h1 className="font-bold text-stone-800 text-5xl">{article.title}</h1>
            <p className="text-stone-800 text-lg">{'\u00A0'.repeat(4)}{article.description}</p>
          </div>
          <div className="basis-1/4 flex flex-col items-center justify-center gap-2">
            <img
              src={`${import.meta.env.VITE_SERVER}/api/uploads/${article.scholar.picture}`}
              alt="image savant"
              className="w-42 h-42 object-cover"
            />
            <Link to={`/Savant/${article.scholar._id}`} className="font-semibold text-[#2f7062] text-lg">
              {article.scholar.name}
            </Link>
            <h3 className="font-semibold text-stone-800 text-lg">{formatDate(article.createdAt)}</h3>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {article.sections.map((section, index) => (
            <div key={index} className="flex flex-col gap-4 items-center justify-center">
              <div className="flex align-start justify-between gap-4 w-full">
                <div className={section.pictures.length > 0 ? "basis-3/4 space-y-4" : "space-y-4"}>
                  <h1 className="font-bold text-stone-800 text-4xl">{section.title}</h1>
                  <p className="text-stone-800 text-lg">{'\u00A0'.repeat(4)}{section.content}</p>
                </div>
                <div className="basis-1/4 flex flex-col items-center justify-center gap-1">
                  {section.pictures.map((pic, idx) => (
                    <img
                      key={idx}
                      src={`${import.meta.env.VITE_SERVER}/api/uploads/${pic.url}`}
                      alt={`section-${index}-img-${idx}`}
                      className="w-42 h-42 object-cover rounded-lg shadow-lg shadow-stone-400"
                    />
                  ))}
                </div>
              </div>

              {section.videos.length > 0 && (
                <div
                  className={`my-4 w-full gap-4 flex flex-wrap ${
                    section.videos.length === 1 || section.videos.length % 2 !== 0
                      ? 'justify-center'
                      : 'justify-between'
                  }`}
                >
                  {section.videos.map((video, idx) => (
                    <div key={idx} className="w-full md:w-[48%] h-64">
                      <video controls className="w-full h-full rounded-lg shadow-lg shadow-stone-400">
                        <source
                          src={`${import.meta.env.VITE_SERVER}/api/uploads/${video.url}`}
                          type="video/mp4"
                        />
                      </video>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Fichiers PDF */}
        {article.pdfFiles?.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-[#2f7062]">Documents PDF associés</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {article.pdfFiles.map((file, index) => (
                <div key={index} className="border border-gray-300 p-4 rounded-lg bg-white shadow-sm">
                  <iframe
                    src={`${import.meta.env.VITE_SERVER}/api/uploads/${file.url}`}
                    className="w-full h-96 rounded"
                  />
                  <a
                    href={`${import.meta.env.VITE_SERVER}/api/uploads/${file.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline block mt-2 text-sm text-center"
                  >
                    Ouvrir dans un nouvel onglet
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Likes & Commentaires */}
        <div className="rounded-lg bg-[#F4ECD3] flex items-center shadow-lg px-72 m-16 gap-6">
          <div
            className="basis-1/2 rounded-lg bg-[#EBE3CB] shadow-lg flex flex-col items-center justify-center gap-2 p-2 cursor-pointer"
            onClick={handleLike}
          >
            <p className="text-xl font-semibold">Likes reçus</p>
            {isLiking ? (
              <ClipLoader size={40} color="#2f7062" />
            ) : likedByUser ? (
              <img src={like} alt="like" className="w-20 h-20" />
            ) : (
              <img src={heart} alt="heart" className="w-20 h-20" />
            )}
            <p className="text-xl font-bold text-[#173B33]">{likesCount}</p>
          </div>

          <div className="basis-1/2 rounded-lg bg-[#EBE3CB] shadow-lg flex flex-col items-center justify-center gap-2 p-2">
            <p className="text-xl font-semibold">Commentaires reçus</p>
            <img src={comment} alt="comment" className="w-20 h-20" />
            <p className="text-xl font-bold text-[#173B33]">{comments.length}</p>
          </div>
        </div>

        {/* Zone commentaire */}
        <div className="space-y-6">
          <form onSubmit={handleCommentSubmit} className='flex items-center justify-center gap-10'>
            <input
              type="text"
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="Ajouter un commentaire..."
              className="w-full p-3 border border-gray-300 rounded"
            />
            <button className="mt-2 px-6 py-2 bg-[#173B33] text-white rounded">Commenter</button>
          </form>

          <div className="mt-6">
            {renderComments(comments)}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Article;

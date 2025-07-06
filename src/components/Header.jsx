import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "/logo.png";
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../redux/user/userAction'; 
const SERVER_URL = import.meta.env.VITE_SERVER;

function Header() {
  const { currentUser, loading } = useSelector(state => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  return (
    <div className='px-[40px] flex flex-row justify-between items-center py-4 shadow-lg shadow-[#161c1b95] bg-[#1A3A34] text-[#FAF2E1]'>
      <img src={logo} alt="logo" className='w-10' />
      <Link to="/">Page d'Accueil</Link>
      <Link to="/savants">Découvrez Nos Savants</Link>
      <Link to="/articles">Articles</Link>

      {currentUser ? (
        <div className='flex justify-center items-center gap-9'>
          <Link to={`/profile/${currentUser._id}`}>
            <img
              src={`${SERVER_URL}/api/uploads/${currentUser.profileImage}`}
              alt="image"
              className="rounded-full object-cover w-12 h-12"
            />
          </Link>
          <button onClick={handleLogoutClick} className="hover:underline">
            {loading ? 'Déconnexion...' : 'Se déconnecter'}
          </button>
        </div>
      ) : (
        <div className='flex flex-row gap-9'>
          <Link to="/Register">Créer Un Compte</Link>
          <Link to="/login">Se Connecter</Link>
        </div>
      )}
    </div>
  );
}

export default Header;

import React from 'react';
import { Link } from 'react-router-dom';
import logo from "/logo.png"
import {useSelector} from 'react-redux'
function Header() {
    const {currentUser} = useSelector(state => state.user)

    return (
        <div className='px-[40px] flex flex-row justify-between items-center py-4 shadow-lg shadow-[#161c1b95] bg-[#1A3A34] text-[#FAF2E1]'>
            <img src={logo} alt="logo" className='w-10'/>
            <Link to="/">Page d'Accueil</Link>
            <Link to="/savants">Découvrez Nos Savants</Link>
            <Link to="/articles">Articles</Link>

            {currentUser ? (
                <div className='flex flex-row gap-9'>
                    <Link to={`/profile/${currentUser._id}`}>Créer Un Compte</Link>
                    <Link to="/login">Se Connecter</Link>
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

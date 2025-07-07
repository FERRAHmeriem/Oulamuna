import React from 'react';
import { Link } from 'react-router-dom';

function Notfound() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow flex flex-col items-center justify-center text-center p-6">
        <h1 className="text-9xl font-bold text-[#1A3A34] mb-8">404</h1>
        <h2 className="text-2xl font-semibold mb-2">Page introuvable</h2>
        <p className="text-gray-600 mb-6">
         Désolé, la page que vous cherchez n’existe pas ou a été déplacée.
        </p>
        <Link
          to="/"
          className="px-6 py-2 bg-[#1A3A34]  text-white rounded-md hover:scale-101 transition-transform duration-300 shadow-lg shadow-[#161c1b95] text-lg"
        >
         Retour à l’accueil
        </Link>
      </div>
    </div>
  );
}

export default Notfound;

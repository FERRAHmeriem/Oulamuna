import React from 'react';
import { MonitorOff } from 'lucide-react';

const Unsupported = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f2f2f2] text-center px-4">
      <div className="bg-white p-10 rounded-xl shadow-lg max-w-md w-full">
        <MonitorOff className="w-20 h-20 text-[#1A3A34] mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-[#1A3A34] mb-4">
          Accès limité
        </h1>
        <p className="text-[#444] text-base">
          Ce site n’est pas disponible sur mobile ou tablette.<br />
          Veuillez utiliser un ordinateur pour y accéder.
        </p>
      </div>
    </div>
  );
};

export default Unsupported;

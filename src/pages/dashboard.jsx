import React from 'react';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();


  const usuarioEmail = localStorage.getItem('usuarioEmail') || "Usuário";

  const handleLogout = () => {
    localStorage.removeItem('usuarioEmail');
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Bem-vindo(a), {usuarioEmail}!</h1>
        <p className="text-gray-600 mb-6">
          Você está logado no sistema. 
        </p>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;

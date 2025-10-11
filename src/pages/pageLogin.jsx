/**
 * Nome do arquivo: pageCadastro
 * Data de criação: 18/08/25
 * Autor: Leonardo Costa Ferreira
 * Matrícula: 01738044
 *
 * Descrição: Pagina de login do usuario
 *
 * Funcionalidades: página para Login do usuario, pede email e senha do usuario já cadastrado.
 */

import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensagem("");
    setLoading(true);

    if (!email || !senha) {
      setMensagem("Preencha todos os campos!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/v1/client/login", { email, senha });
      setMensagem(response.data.mensagem || `Bem-vindo, ${email}!`);
      setEmail(""); 
      setSenha("");
      setTimeout(() => navigate("/dashboard"), 1000);
    } catch (error) {
      const errorMessage = error.response?.data?.mensagem || "Erro ao fazer login. Verifique suas credenciais.";
      setMensagem(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      {/* Círculos decorativos de fundo */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      
      <div className="relative w-full max-w-md">
        {/* Card principal */}
        <div className="bg-white backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-gray-100">
          {/* Header com ícone */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Bem-vindo!</h1>
            <p className="text-gray-500 mt-2 text-sm">Entre com suas credenciais</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Campo Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                type="email" 
                placeholder="seu@email.com" 
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                disabled={loading} 
              />
            </div>

            {/* Campo Senha */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input 
                value={senha} 
                onChange={e => setSenha(e.target.value)} 
                type="password" 
                placeholder="Sua senha" 
                required
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                disabled={loading} 
              />
            </div>

            {/* Link Esqueci senha - opcional */}
            <div className="text-right">
              <button type="button" className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline">
                Esqueceu a senha?
              </button>
            </div>

            {/* Botão de submit */}
            <button 
              type="submit"
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Entrando...
                </span>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          {/* Mensagem de feedback */}
          {mensagem && (
            <div className={`mt-4 p-3 rounded-xl text-center text-sm font-medium ${
              mensagem.includes("Erro") || mensagem.includes("Preencha")
                ? 'bg-red-50 text-red-700 border border-red-200' 
                : 'bg-green-50 text-green-700 border border-green-200'
            }`}>
              {mensagem}
            </div>
          )}

          {/* Link para cadastro */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Não tem uma conta?{' '}
              <Link to="/cadastro" className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all">
                Cadastre-se aqui
                <UserPlus className="w-4 h-4" />
              </Link>
            </p>
          </div>
        </div>

        {/* Badge de segurança */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <Lock className="w-3 h-3" />
          <span>Conexão segura e criptografada</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
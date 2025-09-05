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
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensagem("");

    try {
      const response = await axios.post(
        "http://localhost:3000/v1/client/login",
        {
          email,
          senha,
        }
      );
      setMensagem(response.data.mensagem || `Login realizado com sucesso! Bem-vindo, ${email}!`);
      setEmail("");
      setSenha("");

    } catch (error) {
      console.error("Erro ao fazer login:", error);
      const errorMessage = error.response?.data?.mensagem || "Erro ao fazer login. Por favor, verifique suas credenciais.";
      setMensagem(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 font-sans p-4">
      <div className="w-full max-w-sm bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Login</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            required
          />
          <input
            type="password"
            placeholder="Digite sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full px-5 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-200"
            required
          />
          <button
            type="submit"
            className={`w-full bg-green-600 text-white py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-700'}`}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="text-center text-sm text-gray-600 mt-6">
          Não tem conta?{" "}
          <Link to="/cadastro" className="text-green-600 hover:underline font-medium">
            Cadastre-se aqui
          </Link>
        </p>
        {mensagem && (
          <p className={`text-center mt-4 font-medium ${mensagem.includes('sucesso') || mensagem.includes('Bem-vindo') ? 'text-green-600' : 'text-red-600'}`}>
            {mensagem}
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;
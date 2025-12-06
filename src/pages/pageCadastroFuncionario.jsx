/**
 * Nome do arquivo: pageCadastroFuncionario
 * Data de criação: 05/12/24
 * Autor: Leonardo Costa Ferreira
 * Matrícula: 01738044
 *
 * Descrição: Página feita para pegar dados de funcionários
 *
 * Funcionalidades: Dados gerados vão para o banco de dados, para ficar alocado.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, Briefcase, Award, Mail, Lock, UserPlus, LogIn } from 'lucide-react';

const CadastroFuncionario = () => {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cargo, setCargo] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validarCampos = () => {
    if (!nome || !email || !senha) {
      setMensagem("Nome, email e senha são obrigatórios!");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMensagem("Digite um email válido!");
      return false;
    }
    if (senha.length < 6) {
      setMensagem("A senha deve ter no mínimo 6 caracteres!");
      return false;
    }
    return true;
  };

  const handleCadastro = async (e) => {
    e.preventDefault();
    setMensagem("");

    if (!validarCampos()) return;

    setLoading(true);

    try {
      const resposta = await axios.post(
        "http://localhost:3000/api/funcionarios/register",
        { 
          nome, 
          email, 
          cargo: cargo || "Funcionário",
          especialidade: especialidade || null,
          senha 
        }
      );

      setMensagem(resposta.data.mensagem || "Cadastro realizado com sucesso!");

      
      setNome("");
      setEmail("");
      setCargo("");
      setEspecialidade("");
      setSenha("");

      
      setTimeout(() => navigate("/"), 1500);

    } catch (erro) {
      setMensagem(erro.response?.data?.mensagem || erro.response?.data?.error || "Erro ao cadastrar funcionário");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      {/* Círculos decorativos de fundo */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>

      <div className="relative w-full max-w-md">
        {/* Card */}
        <div className="bg-white backdrop-blur-lg shadow-2xl rounded-3xl p-8 border border-gray-100">
          {/* Ícone */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <UserPlus className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Cadastro Funcionário</h1>
            <p className="text-gray-500 mt-2 text-sm">Crie sua conta profissional</p>
          </div>

          <div className="space-y-4">
            {/* Nome */}
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={nome}
                onChange={e => setNome(e.target.value)}
                type="text"
                placeholder="Nome completo"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                disabled={loading}
              />
            </div>

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                placeholder="seu@email.com"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                disabled={loading}
              />
            </div>

            {/* Cargo */}
            <div className="relative">
              <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={cargo}
                onChange={e => setCargo(e.target.value)}
                type="text"
                placeholder="Cargo (ex: Técnico, Eletricista...)"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1 ml-1">Opcional - padrão será "Funcionário"</p>
            </div>

            {/* Especialidade */}
            <div className="relative">
              <Award className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={especialidade}
                onChange={e => setEspecialidade(e.target.value)}
                type="text"
                placeholder="Especialidade (ex: Elétrica, Hidráulica...)"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                disabled={loading}
              />
              <p className="text-xs text-gray-500 mt-1 ml-1">Opcional - informe sua área de atuação</p>
            </div>

            {/* Senha */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                value={senha}
                onChange={e => setSenha(e.target.value)}
                type="password"
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                disabled={loading}
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mt-4">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">
                  <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-xs text-blue-700">
                  Seus dados profissionais serão complementados pelo administrador após o cadastro.
                </p>
              </div>
            </div>

            {/* Botão */}
            <button
              onClick={handleCadastro}
              className={`w-full py-3 px-4 rounded-xl font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Cadastrando...
                </span>
              ) : (
                "Criar Conta Profissional"
              )}
            </button>
          </div>

          {/* Mensagem de feedback */}
          {mensagem && (
            <div className={`mt-4 p-3 rounded-xl text-center text-sm font-medium ${
              mensagem.includes("Erro") || 
              mensagem.includes("obrigatórios") || 
              mensagem.includes("Digite") || 
              mensagem.includes("mínimo")
                ? 'bg-red-50 text-red-700 border border-red-200'
                : 'bg-green-50 text-green-700 border border-green-200'
              }`}>
              {mensagem}
            </div>
          )}

          {/* Link do login */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Já tem uma conta?{' '}
              <button 
                onClick={() => navigate("/")}
                className="text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 hover:gap-2 transition-all"
              >
                Fazer Login
                <LogIn className="w-4 h-4" />
              </button>
            </p>
          </div>

          {/* Link para cadastro cliente */}
          <div className="mt-3 text-center">
            <p className="text-sm text-gray-600">
              É cliente?{' '}
              <button 
                onClick={() => navigate("/cadastro")}
                className="text-purple-600 hover:text-purple-700 font-semibold"
              >
                Cadastre-se aqui
              </button>
            </p>
          </div>
        </div>

        {/* Badge de segurança */}
        <div className="mt-6 flex items-center justify-center gap-2 text-xs text-gray-500">
          <Lock className="w-3 h-3" />
          <span>Seus dados estão protegidos e seguros</span>
        </div>
      </div>
    </div>
  );
};

export default CadastroFuncionario;
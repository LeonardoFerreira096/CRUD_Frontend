/**
 * Nome do arquivo: pageCadastro
 * Data de criação: 18/08/25
 * Autor: Leonardo Costa Ferreira
 * Matrícula: 01738044
 *
 * Descrição: Página feita para pegar dados de clientes
 *
 * Funcionalidades: Dados gerados vão para o banco de dados, para ficar alocado.
 */


import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Cadastro = () => {
  const [nome, setNome] = useState("");
  const [endereco, setEndereco] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validarCampos = () => {
    if (!nome || !endereco || !telefone || !email || !senha) {
      setMensagem("Preencha todos os campos!");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMensagem("Digite um email válido!");
      return false;
    }
    const telefoneRegex = /^\d{10,11}$/;
    if (!telefoneRegex.test(telefone.replace(/\D/g, ''))) {
      setMensagem("Digite um telefone válido (somente números)!");
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
        "http://localhost:3000/v1/client/register",
        { nome, endereco, telefone, email, senha }
      );
      setMensagem(resposta.data.mensagem || "Cadastro realizado com sucesso!");
      setNome(""); setEndereco(""); setTelefone(""); setEmail(""); setSenha("");
      setTimeout(() => navigate("/"), 1500);
    } catch (erro) {
      setMensagem(erro.response?.data?.mensagem || "Erro ao cadastrar cliente");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 font-sans p-4">
      <div className="w-full max-w-sm bg-white shadow-xl rounded-2xl p-8">
        <h1 className="font-bold text-center text-3xl mb-6 text-gray-800">Cadastro de Cliente</h1>
        <form onSubmit={handleCadastro} className="flex flex-col gap-4">
          <input value={nome} onChange={e => setNome(e.target.value)} type="text" placeholder="Nome" required
            className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            disabled={loading} />
          <input value={endereco} onChange={e => setEndereco(e.target.value)} type="text" placeholder="Endereço" required
            className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            disabled={loading} />
          <input value={telefone} onChange={e => setTelefone(e.target.value)} type="tel" placeholder="Telefone" required
            className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            disabled={loading} />
          <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="Email" required
            className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            disabled={loading} />
          <input value={senha} onChange={e => setSenha(e.target.value)} type="password" placeholder="Senha" required
            className="border-2 border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            disabled={loading} />
          <button type="submit"
            className={`bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 shadow-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}>
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>
        {mensagem && <p className={`text-center mt-4 font-medium ${mensagem.includes("Erro") ? 'text-red-600' : 'text-green-600'}`}>{mensagem}</p>}
        <div className="mt-6 text-center text-sm">
          <Link to="/" className="text-blue-600 hover:underline font-medium">
            Já tem uma conta? Faça Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Cadastro;

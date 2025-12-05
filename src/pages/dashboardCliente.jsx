// src/pages/dashboardCliente.jsx
import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';


function DashboardCliente() {
  const [minhasOrdens, setMinhasOrdens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [usuario, setUsuario] = useState(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    dataInicio: '',
    dataPrevistaTermino: ''
  });

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(user);
    loadMinhasOrdens();
  }, []);

  const getToken = () => localStorage.getItem('token');

  const loadMinhasOrdens = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/ordens-servico/cliente/minhas`, {
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });
      
      if (!response.ok) throw new Error('Erro ao carregar ordens');
      
      const data = await response.json();
      setMinhasOrdens(data);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao carregar suas ordens de serviço');
    } finally {
      setLoading(false);
    }
  };

  const handleSolicitarServico = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/ordens-servico/cliente/solicitar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) throw new Error('Erro ao solicitar serviço');
      
      alert('Serviço solicitado com sucesso!');
      closeModal();
      loadMinhasOrdens();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao solicitar serviço');
    }
  };

  const openModal = () => {
    setFormData({
      nome: '',
      descricao: '',
      dataInicio: '',
      dataPrevistaTermino: ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      pendente: { label: 'Pendente', class: 'bg-yellow-100 text-yellow-800' },
      em_andamento: { label: 'Em Andamento', class: 'bg-blue-100 text-blue-800' },
      concluida: { label: 'Concluída', class: 'bg-green-100 text-green-800' },
      cancelada: { label: 'Cancelada', class: 'bg-red-100 text-red-800' }
    };
    
    const statusInfo = statusMap[status] || statusMap.pendente;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.class}`}>
        {statusInfo.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl text-gray-600">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Meus Serviços</h1>
            <p className="text-gray-600 mt-1">Bem-vindo(a), {usuario?.nome}!</p>
          </div>
          <button
            onClick={openModal}
            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-lg hover:shadow-xl"
          >
            + Solicitar Serviço
          </button>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-gray-500 text-sm font-medium">Total</div>
            <div className="text-3xl font-bold text-gray-900 mt-2">
              {minhasOrdens.length}
            </div>
          </div>
          <div className="bg-yellow-50 p-6 rounded-lg shadow">
            <div className="text-yellow-700 text-sm font-medium">Pendentes</div>
            <div className="text-3xl font-bold text-yellow-800 mt-2">
              {minhasOrdens.filter(o => o.status === 'pendente').length}
            </div>
          </div>
          <div className="bg-blue-50 p-6 rounded-lg shadow">
            <div className="text-blue-700 text-sm font-medium">Em Andamento</div>
            <div className="text-3xl font-bold text-blue-800 mt-2">
              {minhasOrdens.filter(o => o.status === 'em_andamento').length}
            </div>
          </div>
          <div className="bg-green-50 p-6 rounded-lg shadow">
            <div className="text-green-700 text-sm font-medium">Concluídas</div>
            <div className="text-3xl font-bold text-green-800 mt-2">
              {minhasOrdens.filter(o => o.status === 'concluida').length}
            </div>
          </div>
        </div>

        {/* Lista de Ordens */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Histórico de Solicitações</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Início</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {minhasOrdens.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                      Você ainda não possui ordens de serviço.
                      <br />
                      <button 
                        onClick={openModal}
                        className="text-green-600 hover:text-green-700 font-medium mt-2"
                      >
                        Solicitar seu primeiro serviço
                      </button>
                    </td>
                  </tr>
                ) : (
                  minhasOrdens.map((ordem) => (
                    <tr key={ordem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{ordem.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                        {ordem.nome}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {ordem.descricao || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(ordem.dataInicio).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(ordem.status)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Solicitar Novo Serviço</h2>
                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-3xl font-bold"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSolicitarServico} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Serviço *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Ex: Manutenção, Instalação, Reparo..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição do Serviço *
                  </label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Descreva detalhadamente o serviço necessário..."
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data Desejada *
                    </label>
                    <input
                      type="date"
                      name="dataInicio"
                      value={formData.dataInicio}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previsão de Conclusão
                    </label>
                    <input
                      type="date"
                      name="dataPrevistaTermino"
                      value={formData.dataPrevistaTermino}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 mt-6">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition"
                  >
                    Solicitar Serviço
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashboardCliente;
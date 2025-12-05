// src/pages/dashboardAdm.jsx
import React, { useState, useEffect } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function DashboardAdm() {
  const [ordensServico, setOrdensServico] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentOrdem, setCurrentOrdem] = useState(null);
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    nome: '',
    clienteId: '',
    descricao: '',
    dataInicio: '',
    dataPrevistaTermino: '',
    status: 'pendente'
  });

  const getToken = () => localStorage.getItem('token');

  // 🔥 FUNÇÃO QUE ESTAVA FALTANDO
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  useEffect(() => {
    loadData();
  }, [filterStatus]);

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadOrdensServico(),
        loadClientes(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadOrdensServico = async () => {
    const url = filterStatus
      ? `${API_URL}/ordens-servico/admin?status=${filterStatus}`
      : `${API_URL}/ordens-servico/admin`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });

    if (!response.ok) throw new Error('Erro ao carregar ordens de serviço');
    const data = await response.json();
    setOrdensServico(data);
  };

  const loadClientes = async () => {
    const response = await fetch(`${API_URL}/ordens-servico/clientes`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    if (!response.ok) throw new Error('Erro ao carregar clientes');
    const data = await response.json();
    setClientes(data);
  };

  const loadStats = async () => {
    const response = await fetch(`${API_URL}/ordens-servico/stats`, {
      headers: {
        'Authorization': `Bearer ${getToken()}`
      }
    });
    if (!response.ok) throw new Error('Erro ao carregar estatísticas');
    const data = await response.json();
    setStats(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/ordens-servico/admin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          ...formData,
          clienteId: parseInt(formData.clienteId)
        })
      });

      if (!response.ok) throw new Error('Erro ao criar ordem de serviço');

      alert('Ordem de serviço criada com sucesso!');
      closeModal();
      loadData();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao criar ordem de serviço');
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_URL}/ordens-servico/admin/${currentOrdem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({
          ...formData,
          clienteId: parseInt(formData.clienteId)
        })
      });

      if (!response.ok) throw new Error('Erro ao atualizar ordem de serviço');

      alert('Ordem de serviço atualizada com sucesso!');
      closeModal();
      loadData();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar ordem de serviço');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta ordem de serviço?')) return;

    try {
      const response = await fetch(`${API_URL}/ordens-servico/admin/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${getToken()}`
        }
      });

      if (!response.ok) throw new Error('Erro ao deletar ordem de serviço');

      alert('Ordem de serviço deletada com sucesso!');
      loadData();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao deletar ordem de serviço');
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/ordens-servico/admin/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error('Erro ao atualizar status');
      loadData();
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar status');
    }
  };

  const openCreateModal = () => {
    setEditMode(false);
    setCurrentOrdem(null);
    setFormData({
      nome: '',
      clienteId: '',
      descricao: '',
      dataInicio: '',
      dataPrevistaTermino: '',
      status: 'pendente'
    });
    setShowModal(true);
  };

  const openEditModal = (ordem) => {
    setEditMode(true);
    setCurrentOrdem(ordem);
    setFormData({
      nome: ordem.nome,
      clienteId: ordem.clienteId.toString(),
      descricao: ordem.descricao || '',
      dataInicio: ordem.dataInicio.split('T')[0],
      dataPrevistaTermino: ordem.dataPrevistaTermino
        ? ordem.dataPrevistaTermino.split('T')[0]
        : '',
      status: ordem.status
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditMode(false);
    setCurrentOrdem(null);
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
        {/* Header com Badge Admin e botão Sair */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
              <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs font-semibold rounded-full">
                ADMIN
              </span>
            </div>
            <p className="text-gray-600 mt-1">Controle total do sistema</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={openCreateModal}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition duration-200 shadow-lg hover:shadow-xl"
            >
              + Nova Ordem
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-gray-500 text-sm font-medium">Total</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">
                {stats.total}
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg shadow">
              <div className="text-yellow-700 text-sm font-medium">Pendentes</div>
              <div className="text-3xl font-bold text-yellow-800 mt-2">
                {stats.pendentes}
              </div>
            </div>

            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <div className="text-blue-700 text-sm font-medium">Em Andamento</div>
              <div className="text-3xl font-bold text-blue-800 mt-2">
                {stats.emAndamento}
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg shadow">
              <div className="text-green-700 text-sm font-medium">Concluídas</div>
              <div className="text-3xl font-bold text-green-800 mt-2">
                {stats.concluidas}
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-lg shadow">
              <div className="text-red-700 text-sm font-medium">Canceladas</div>
              <div className="text-3xl font-bold text-red-800 mt-2">
                {stats.canceladas}
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow mb-6">
          <label className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Filtrar por status:</span>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">Todos</option>
              <option value="pendente">Pendente</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluida">Concluída</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </label>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nome
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Data Início
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Previsão
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ações
                  </th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">
                {ordensServico.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      Nenhuma ordem de serviço encontrada
                    </td>
                  </tr>
                ) : (
                  ordensServico.map((ordem) => (
                    <tr key={ordem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {ordem.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {ordem.nome}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ordem.clientes?.nome || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(ordem.dataInicio).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {ordem.dataPrevistaTermino
                          ? new Date(ordem.dataPrevistaTermino).toLocaleDateString('pt-BR')
                          : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(ordem.status)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => openEditModal(ordem)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Editar
                        </button>

                        <select
                          value={ordem.status}
                          onChange={(e) =>
                            handleStatusChange(ordem.id, e.target.value)
                          }
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="pendente">Pendente</option>
                          <option value="em_andamento">Em Andamento</option>
                          <option value="concluida">Concluída</option>
                          <option value="cancelada">Cancelada</option>
                        </select>

                        <button
                          onClick={() => handleDelete(ordem.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Deletar
                        </button>
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
                <h2 className="text-2xl font-bold text-gray-900">
                  {editMode ? 'Editar Ordem de Serviço' : 'Nova Ordem de Serviço'}
                </h2>

                <button
                  onClick={closeModal}
                  className="text-gray-400 hover:text-gray-600 text-3xl font-bold"
                >
                  ×
                </button>
              </div>

              <form
                onSubmit={editMode ? handleUpdate : handleCreate}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome da Ordem *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cliente *
                  </label>
                  <select
                    name="clienteId"
                    value={formData.clienteId}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    required
                  >
                    <option value="">Selecione um cliente</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>
                        {cliente.nome}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descrição
                  </label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Descreva os detalhes da ordem de serviço..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Data de Início *
                    </label>
                    <input
                      type="date"
                      name="dataInicio"
                      value={formData.dataInicio}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Previsão de Término
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em_andamento">Em Andamento</option>
                    <option value="concluida">Concluída</option>
                    <option value="cancelada">Cancelada</option>
                  </select>
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
                    {editMode ? 'Atualizar' : 'Criar'}
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

export default DashboardAdm;

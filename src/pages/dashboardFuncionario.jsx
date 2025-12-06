import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

function DashboardFuncionario() {
  const [todasOrdens, setTodasOrdens] = useState([]);
  const [minhasOrdens, setMinhasOrdens] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [activeTab, setActiveTab] = useState('todas');
  const [usuario, setUsuario] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('usuario'));
    setUsuario(user);
    loadData();
  }, [filterStatus]);

  const getToken = () => localStorage.getItem('token');

  // ===== Logout =====
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    navigate('/login');
  };

  const loadData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadTodasOrdens(),
        loadMinhasOrdens(),
        loadStats()
      ]);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTodasOrdens = async () => {
    const url = filterStatus 
      ? `${API_URL}/ordens-servico/funcionario/todas?status=${filterStatus}` 
      : `${API_URL}/ordens-servico/funcionario/todas`;
    
    const response = await fetch(url, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    
    if (!response.ok) throw new Error('Erro ao carregar ordens');
    const data = await response.json();
    setTodasOrdens(data);
  };

  const loadMinhasOrdens = async () => {
    const response = await fetch(`${API_URL}/ordens-servico/funcionario/minhas`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    
    if (!response.ok) throw new Error('Erro ao carregar minhas ordens');
    const data = await response.json();
    setMinhasOrdens(data);
  };

  const loadStats = async () => {
    const response = await fetch(`${API_URL}/ordens-servico/stats`, {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    
    if (!response.ok) throw new Error('Erro ao carregar estatísticas');
    const data = await response.json();
    setStats(data);
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`${API_URL}/ordens-servico/funcionario/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!response.ok) throw new Error('Erro ao atualizar status');
      
      await loadData();
      alert('Status atualizado com sucesso!');
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao atualizar status');
    }
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

  const ordensExibidas = activeTab === 'todas' ? todasOrdens : minhasOrdens;

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
        {/* Header com botão Sair */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Painel de Trabalho</h1>
            <p className="text-gray-600 mt-1">
              Bem-vindo(a), {usuario?.nome}! | {usuario?.especialidade || usuario?.cargo}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold transition shadow-lg"
          >
            Sair
          </button>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="text-gray-500 text-sm font-medium">Total Geral</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</div>
            </div>
            <div className="bg-yellow-50 p-6 rounded-lg shadow">
              <div className="text-yellow-700 text-sm font-medium">Pendentes</div>
              <div className="text-3xl font-bold text-yellow-800 mt-2">{stats.pendentes}</div>
            </div>
            <div className="bg-blue-50 p-6 rounded-lg shadow">
              <div className="text-blue-700 text-sm font-medium">Em Andamento</div>
              <div className="text-3xl font-bold text-blue-800 mt-2">{stats.emAndamento}</div>
            </div>
            <div className="bg-green-50 p-6 rounded-lg shadow">
              <div className="text-green-700 text-sm font-medium">Concluídas</div>
              <div className="text-3xl font-bold text-green-800 mt-2">{stats.concluidas}</div>
            </div>
            <div className="bg-purple-50 p-6 rounded-lg shadow">
              <div className="text-purple-700 text-sm font-medium">Minhas Alocações</div>
              <div className="text-3xl font-bold text-purple-800 mt-2">{minhasOrdens.length}</div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-t-lg shadow border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('todas')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'todas'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Todas as Ordens ({todasOrdens.length})
            </button>
            <button
              onClick={() => setActiveTab('minhas')}
              className={`px-6 py-4 font-medium ${
                activeTab === 'minhas'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Minhas Alocações ({minhasOrdens.length})
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-4 shadow mb-0 border-b border-gray-200">
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
        <div className="bg-white rounded-b-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serviço</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data Início</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Atualizar Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {ordensExibidas.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      {activeTab === 'todas' 
                        ? 'Nenhuma ordem de serviço encontrada'
                        : 'Você não possui ordens alocadas no momento'
                      }
                    </td>
                  </tr>
                ) : (
                  ordensExibidas.map((ordem) => (
                    <tr key={ordem.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{ordem.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{ordem.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>{ordem.clientes?.nome || 'N/A'}</div>
                        <div className="text-xs text-gray-400">{ordem.clientes?.telefone}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">{ordem.descricao || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(ordem.dataInicio).toLocaleDateString('pt-BR')}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{getStatusBadge(ordem.status)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select
                          value={ordem.status}
                          onChange={(e) => handleStatusChange(ordem.id, e.target.value)}
                          className="text-sm border border-gray-300 rounded px-3 py-1 focus:outline-none focus:ring-2 focus:ring-green-500"
                        >
                          <option value="pendente">Pendente</option>
                          <option value="em_andamento">Em Andamento</option>
                          <option value="concluida">Concluída</option>
                          <option value="cancelada">Cancelada</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Info Card */}
        {activeTab === 'minhas' && minhasOrdens.length > 0 && (
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Ordens Alocadas</h3>
                <p className="mt-1 text-sm text-blue-700">
                  Estas são as ordens de serviço que foram especificamente alocadas para você. 
                  Mantenha os status atualizados para melhor controle do trabalho.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default DashboardFuncionario;
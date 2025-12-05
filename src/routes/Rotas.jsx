// Rotas.jsx / App.jsx (Refatorado)
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import PageLogin from '../pages/pageLogin';
import PageCadastro from '../pages/pageCadastro';
import CadastroFuncionario from '../pages/pageCadastroFuncionario';
import DashboardCliente from '../pages/dashboardCliente';
import DashboardFuncionario from '../pages/dashboardFuncionario';
import DashboardAdm from '../pages/dashboardAdm';


function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(usuario.role)) {
    switch (usuario.role) {
      case 'cliente':
        return <Navigate to="/dashboard-cliente" replace />;
      case 'funcionario':
        return <Navigate to="/dashboard-funcionario" replace />;
      case 'admin':
        return <Navigate to="/dashboard-admin" replace />;
      default:
        return <Navigate to="/login" replace />;
    }
  }

  return children;
}


function PublicRoute({ children }) {
  const token = localStorage.getItem('token');
  const usuario = JSON.parse(localStorage.getItem('usuario') || '{}');

  if (token) {
    switch (usuario.role) {
      case 'cliente':
        return <Navigate to="/dashboard-cliente" replace />;
      case 'funcionario':
        return <Navigate to="/dashboard-funcionario" replace />;
      case 'admin':
        return <Navigate to="/dashboard-admin" replace />;
      default:
        break;
    }
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rotas Públicas */}
        <Route path="/login" element={<PublicRoute><PageLogin /></PublicRoute>} />
        <Route path="/cadastro" element={<PublicRoute><PageCadastro /></PublicRoute>} />
        <Route path="/" element={<PublicRoute><PageLogin /></PublicRoute>} />

        {/* Rotas Protegidas - ADMIN */}
        <Route
          path="/cadastro-funcionario"
          element={<ProtectedRoute allowedRoles={['admin']}><CadastroFuncionario /></ProtectedRoute>} // <-- CORRIGIDO!
        />
        <Route path="/dashboard-admin" element={<ProtectedRoute allowedRoles={['admin']}><DashboardAdm /></ProtectedRoute>} />

        {/* Rotas Protegidas - CLIENTE */}
        <Route path="/dashboard-cliente" element={<ProtectedRoute allowedRoles={['cliente']}><DashboardCliente /></ProtectedRoute>} />

        {/* Rotas Protegidas - FUNCIONÁRIO */}
        <Route path="/dashboard-funcionario" element={<ProtectedRoute allowedRoles={['funcionario', 'admin']}><DashboardFuncionario /></ProtectedRoute>} />

        {/* Rota 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
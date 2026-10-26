import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from '@/components/auth/AuthProvider'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import LoginPage from '@/pages/LoginPage'
import CadastroPage from '@/pages/CadastroPage'
import HubPage from '@/pages/HubPage'
import LeilaoFretePage from '@/pages/modulos/LeilaoFretePage'

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rota raiz redireciona para /hub */}
        <Route path="/" element={<Navigate to="/hub" replace />} />

        {/* Públicas */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/cadastro" element={<CadastroPage />} />

        {/* Protegidas */}
        <Route
          path="/hub"
          element={
            <ProtectedRoute>
              <HubPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/modulos/leilao-frete"
          element={
            <ProtectedRoute>
              <LeilaoFretePage />
            </ProtectedRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/hub" replace />} />
      </Routes>
    </AuthProvider>
  )
}

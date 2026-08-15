import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Dashboard from './pages/Dashboard';
import Groups from './pages/Groups';
import GroupDetail from './pages/GroupDetail';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Money from './pages/Money';

const PrivateRoute = ({ children }) => {
  const { token, loading } = useContext(AuthContext);
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0b10]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
        <p className="text-on-surface-variant text-sm font-label-sm">Loading SplitMint...</p>
      </div>
    </div>
  );
  return token ? children : <Navigate to="/login" replace />;
};


function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/auth" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route 
        path="/dashboard" 
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/money" 
        element={
          <PrivateRoute>
            <Money />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/groups" 
        element={
          <PrivateRoute>
            <Groups />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/groups/:id" 
        element={
          <PrivateRoute>
            <GroupDetail />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/analytics" 
        element={
          <PrivateRoute>
            <Analytics />
          </PrivateRoute>
        } 
      />
      <Route 
        path="/settings" 
        element={
          <PrivateRoute>
            <Settings />
          </PrivateRoute>
        } 
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;

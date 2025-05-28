import { useEffect } from 'react';
import { useNavigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import Navbar from './Navbar';
import { logVisitor } from '@/utils/edgeFunctions';

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const Layout = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => navigate('/login');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    let visitorId = localStorage.getItem('visitor_id');
    if (!visitorId) {
      visitorId = generateUUID();
      localStorage.setItem('visitor_id', visitorId);
    }
    logVisitor(location.pathname, visitorId);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
        userName={user?.full_name}
        profileImage={user?.profile_image}
      />
      <main className="flex-grow pt-16">
        <Outlet />
      </main>
      <footer className="bg-gray-50 border-t">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} LinkedPost Generator. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;

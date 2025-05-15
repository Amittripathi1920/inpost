import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "./Navbar";

const Layout = () => {
  const { isAuthenticated, logout, user } = useAuth(); // Destructuring user from useAuth
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate("/login");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        isAuthenticated={isAuthenticated}
        onLogin={handleLogin}
        onLogout={handleLogout}
        userName={user?.full_name} // Assuming full_name is the user's name
        profileImage={user?.profile_image} // Assuming profile_image is the profile image URL
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

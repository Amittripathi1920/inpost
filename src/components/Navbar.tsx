import { Link } from "react-router-dom";
import NavbarDesktop from "./nav/NavbarDesktop";
import NavbarMobile from "./nav/NavbarMobile";
import NavLinks from "./nav/NavLinks";

type NavbarProps = {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
  userName?: string;
  profileImage?: string;
};

const Navbar = ({
  isAuthenticated,
  onLogin,
  onLogout,
  userName = "User",
  profileImage,
}: NavbarProps) => {
  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <svg
                className="h-8 w-auto text-primary"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 17L17 7M17 7H8M17 7V16"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
              </svg>
              <span className="ml-2 text-xl font-bold text-gray-800">LinkedPost</span>
            </Link>
            <NavLinks isAuthenticated={isAuthenticated} className="hidden md:ml-6 md:flex md:space-x-8" />
          </div>
          <NavbarDesktop
            isAuthenticated={isAuthenticated}
            onLogin={onLogin}
            onLogout={onLogout}
            userName={userName}
            profileImage={profileImage}
          />
          <NavbarMobile
            isAuthenticated={isAuthenticated}
            onLogin={onLogin}
            onLogout={onLogout}
            userName={userName}
            profileImage={profileImage}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

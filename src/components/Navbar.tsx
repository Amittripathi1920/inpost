import { Link } from "react-router-dom";
import NavbarDesktop from "./nav/NavbarDesktop";
import NavbarMobile from "./nav/NavbarMobile";
import NavLinks from "./nav/NavLinks";
import logoWhite from "@/assets/logo_white.png"; // Adjust path if needed


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
              <img
                src={logoWhite}
                alt="EchoPost Logo"
                className="h-8 w-auto filter brightness-0 invert"
              />
            </Link>
            <NavLinks
              isAuthenticated={isAuthenticated}
              className="hidden md:ml-6 md:flex md:space-x-8"
            />
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

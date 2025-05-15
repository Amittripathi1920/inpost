import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface NavbarMobileProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
  userName?: string;
  profileImage?: string;
}

const NavbarMobile = ({
  isAuthenticated,
  onLogin,
  onLogout,
  userName = "User",
  profileImage,
}: NavbarMobileProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const userInitial = userName.charAt(0).toUpperCase();

  return (
    <>
      <div className="md:hidden flex items-center">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        >
          <span className="sr-only">Open main menu</span>
          <svg
            className={`${isMobileMenuOpen ? "hidden" : "block"} h-6 w-6`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg
            className={`${isMobileMenuOpen ? "block" : "hidden"} h-6 w-6`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className={`${isMobileMenuOpen ? "block" : "hidden"} md:hidden bg-white`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Home
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/generate"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Generate Post
              </Link>
              <Link
                to="/dashboard"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Dashboard
              </Link>
            </>
          )}
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {isAuthenticated ? (
            <>
              <div className="flex items-center px-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={profileImage || ""} alt={userName} />
                  <AvatarFallback className="bg-primary text-white">
                    {userInitial}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{userName}</div>
                </div>
                <div className="ml-auto">
                  <button
                    onClick={onLogout}
                    className="flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">Logout</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                      />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Edit Profile
                </Link>
                <button
                  onClick={() => {
                    onLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <div className="mt-3 space-y-1 px-2">
              <Button
                className="w-full mb-2"
                variant="outline"
                onClick={() => {
                  onLogin();
                  setIsMobileMenuOpen(false);
                }}
              >
                Login
              </Button>
              <Button
                className="w-full"
                onClick={() => {
                  onLogin();
                  setIsMobileMenuOpen(false);
                }}
              >
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default NavbarMobile;

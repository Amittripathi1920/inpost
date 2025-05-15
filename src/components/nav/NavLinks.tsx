
import { Link } from "react-router-dom";

interface NavLinksProps {
  isAuthenticated: boolean;
  className?: string;
}

const NavLinks = ({ isAuthenticated, className = "" }: NavLinksProps) => {
  return (
    <div className={className}>
      <Link
        to="/"
        className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
      >
        Home
      </Link>
      {isAuthenticated && (
        <>
          <Link
            to="/generate"
            className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Generate Post
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300"
          >
            Dashboard
          </Link>
        </>
      )}
    </div>
  );
};

export default NavLinks;

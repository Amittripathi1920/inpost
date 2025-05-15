import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";

interface NavbarDesktopProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
  userName?: string;
  profileImage?: string;
}

const NavbarDesktop = ({
  isAuthenticated,
  onLogin,
  onLogout,
  userName = "User",
  profileImage,
}: NavbarDesktopProps) => {
  return (
    <div className="hidden md:ml-6 md:flex md:items-center">
      {isAuthenticated ? (
        <UserMenu userName={userName} profileImage={profileImage} onLogout={onLogout} />
      ) : (
        <div className="flex space-x-4">
          <Button variant="outline" onClick={onLogin}>Login</Button>
          <Button onClick={onLogin}>Sign Up</Button>
        </div>
      )}
    </div>
  );
};

export default NavbarDesktop;

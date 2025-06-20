import { Link, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext"; 

const Topbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserContext(); // AuthContext

  // Logout handler
  const handleLogout = () => {
    logout(); // Clear tokens/context
    navigate("/sign-in"); // Redirect to sign-in page
  };

  return (
    <section className="topbar">
      <div className="flex-between py-4 px-5">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/Ram.svg"
            alt="logo"
            width={190}
            height={38}
          />
        </Link>

        <div className="flex gap-4">
          <Button
            variant="ghost"
            className="shad-button_ghost"
            onClick={handleLogout}
          >
            <img src="/assets/icons/log-out.svg" alt="logout" />
          </Button>

          <Link to={`/profile/${user?.id || ""}`} className="flex-center gap-3">
            <img
              src={user?.image || "/assets/icons/profile-picture.svg"}
              alt="profile"
              className="h-8 w-8 rounded-full"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Topbar;

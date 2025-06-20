import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useUserContext } from "@/context/AuthContext"; // your auth context
import { sidebarLinks } from "@/constants";
import type { INavLink } from "@/types";

const LeftSidebar = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const { user, logout } = useUserContext(); // Assuming your AuthContext provides user & logout

  // Logout handler
  const handleLogout = () => {
    logout(); // clear tokens, context, etc.
    navigate("/sign-in"); // redirect to sign-in page after logout
  };

  return (
    <nav className="leftsidebar">
      <div className="flex flex-col gap-11">
        <Link to="/" className="flex gap-3 items-center">
          <img
            src="/assets/images/Ram.svg"
            alt="logo"
            width={200}
            height={46}
          />
        </Link>

        <Link to="auth/profile" className="flex gap-3 items-center">
          <img
            src={user?.image || "/assets/icons/profile-picture.svg"}
            alt="profile"
            className="h-14 w-14 rounded-full"
          />

          <div className="flex flex-col">
            <p className="body-bold">{user?.name || "Guest User"}</p>
            <p className="small-regular text-light-3">@{user?.username || "guest"}</p>
          </div>
        </Link>

        <ul className="flex flex-col gap-6">
          {sidebarLinks.map((link: INavLink) => {
            const isActive = pathname === link.route;

            return (
              <li
                key={link.label}
                className={`leftsidebar-link group ${isActive ? "bg-rose-950" : ""}`}
              >
                <NavLink
                  to={link.route}
                  className="flex gap-4 items-center p-4"
                >
                  <img
                    src={link.imgURL}
                    alt={link.label}
                    className={`group-hover:invert-white ${isActive ? "invert-white" : ""}`}
                  />
                  {link.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      <Button
        variant="ghost"
        className="shad-button_ghost"
        onClick={handleLogout}
      >
        <img src="/assets/icons/log-out.svg" alt="logout" />
        <p className="small-medium lg:base-medium">Logout</p>
      </Button>
    </nav>
  );
};

export default LeftSidebar;

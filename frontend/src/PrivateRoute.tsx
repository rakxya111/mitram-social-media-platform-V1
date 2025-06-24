import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext";

const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useUserContext();
  const location = useLocation();

  console.log("PrivateRoute - isAuthenticated:", isAuthenticated, "isLoading:", isLoading, "path:", location.pathname);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-lg font-semibold">Checking authentication...</p>
      </div>
    );
  }

  // Redirect to sign-in if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  // Render protected content if authenticated
  return <Outlet />;
};

export default PrivateRoute;
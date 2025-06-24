import { Navigate, Outlet } from "react-router-dom";
import { useUserContext } from "@/context/AuthContext"; // adjust path as needed

const AuthLayout = () => {
  const { isAuthenticated, isLoading } = useUserContext();

  

  if (isLoading) {
    return (
      <div className="w-full h-screen flex justify-center items-center">
        <p className="text-center text-lg font-semibold">Checking authentication...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" />;

  }
  

  return (
    <>
      <section className="flex flex-1 justify-center items-center flex-col py-10">
        <Outlet />
      </section>
      <img
        src="/assets/images/MITRAM-side-imgg.svg"
        alt="logo"
        className="hidden xl:block h-screen w-1/2 object-cover bg-no-repeat"
      />
    </>
  );
};

export default AuthLayout;

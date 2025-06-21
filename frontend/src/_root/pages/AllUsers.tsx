import UserCard from "@/components/shared/UserCard";
import { useToast } from "@/hooks/use-toast";
import { useGetUsers } from "@/lib/Django/queries";
import { Loader } from "lucide-react";
import { useEffect } from "react";

const AllUsers = () => {
  const { toast } = useToast();

  const {
    data: creators,
    isLoading,
    isError: isErrorCreators,
  } = useGetUsers(); // Calls /api/auth/users/

  
  useEffect(() => {
    if (isErrorCreators) {
      toast({ title: "Something went wrong while fetching users." });
    }
  }, [isErrorCreators, toast]);

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>

        {isLoading ? (
          <div className="flex-center w-full mt-10">
            <Loader className="animate-spin w-6 h-6 text-light-4" />
          </div>
        ) : (
          <ul className="user-grid">
            {creators?.map((creator: any) => (
              <li key={creator.id} className="flex-1 min-w-[200px] w-full">
                <UserCard user={creator} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AllUsers;

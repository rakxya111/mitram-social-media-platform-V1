import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { getImageUrl } from "@/lib/utils/image";


type UserCardProps = {
  user: {
    id: number | string;
    name: string;
    username: string;
    image?: string;
  };
};

const UserCard = ({ user }: UserCardProps) => {
  return (
    <Link to={`/profile/${user.id}`} className="user-card">
      {/* ✅ Use helper for image */}
      <img
        src={getImageUrl(user.image)}
        alt="creator"
        className="rounded-full w-14 h-14"
      />

      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1">
          {user.name}
        </p>
        <p className="small-regular text-light-3 text-center line-clamp-1">
          @{user.username}
        </p>
      </div>

      <Button type="button" size="sm" className="shad-button_primary px-5">
        Follow
      </Button>
    </Link>
  );
};

export default UserCard;

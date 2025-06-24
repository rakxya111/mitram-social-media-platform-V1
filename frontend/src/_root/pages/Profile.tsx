import { useEffect, useState } from "react";
import { Link, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import { Loader } from "lucide-react";

import { userQueries } from "@/lib/Django/queries";
import { useUserContext } from "@/context/AuthContext";
import GridPostList from "@/components/shared/GridPostList";
import { Button } from "@/components/ui/button";
import LikedPosts from "./LikedPosts";
import type { IUser, Post } from "@/types";
import { fetchUserPosts } from "@/lib/axios/api";
import { BACKEND_URL } from "@/constants";

// StatBlock component for stats display
const StatBlock = ({ value, label }: { value: string | number; label: string }) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

// Helper to get full image URL or fallback placeholder
const getFullImageUrl = (imagePath?: string) => {
  if (!imagePath) return "/assets/icons/profile-placeholder.svg";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath; // Already full URL
  }

  return `${BACKEND_URL}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
};

const Profile = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useUserContext();

  const { pathname } = useLocation();

  const [currentUser, setCurrentUser] = useState<IUser | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        setLoading(true);
        // Fetch user data
        const data = await userQueries.getUser(id);
        setCurrentUser(data);

        // Fetch user's posts
        const postsRes = await fetchUserPosts(Number(id));
        setPosts(postsRes.data.results || postsRes.data);
      } catch (error) {
        console.error("Failed to fetch user profile or posts:", error);
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  if (loading || !currentUser) {
    return (
      <div className="flex-center w-full h-full">
        <Loader className="animate-spin h-6 w-6" />
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          {/* Profile Image */}
          <img
            src={getFullImageUrl(currentUser.image)}
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full object-cover"
          />

          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full">
                {currentUser.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{currentUser.username}
              </p>
            </div>

            <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts_count ?? 0} label="Posts" />
              <StatBlock
                value={(currentUser.followers?.length ?? 0) || 20}
                label="Followers"
              />
              <StatBlock
                value={(currentUser.following?.length ?? 0) || 20}
                label="Following"
              />
            </div>

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio || "This user has not set a bio yet."}
            </p>
          </div>

          {/* Edit Profile Button if current user is the profile owner */}
          <div className="flex justify-center gap-4">
            {user.id === currentUser.id ? (
              <Link
                to={`/update-profile/${currentUser.id}`}
                className="h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg"
              >
                <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
                <p className="flex whitespace-nowrap small-medium">Edit Profile</p>
              </Link>
            ) : (
              <Button type="button" className="shad-button_primary px-8">
                Follow
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs for Posts and Liked Posts */}
      {user.id === currentUser.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}
          >
            <img src="/assets/icons/posts.svg" alt="posts" width={20} height={20} />
            Posts
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}
          >
            <img src="/assets/icons/like.svg" alt="like" width={20} height={20} />
            Liked Posts
          </Link>
        </div>
      )}

      {/* Routes to render posts or liked posts */}
      <Routes>
        <Route index element={<GridPostList posts={posts} showUser={false} />} />
        {user.id === currentUser.id && <Route path="liked-posts" element={<LikedPosts />} />}
      </Routes>

      <Outlet />
    </div>
  );
};

export default Profile;

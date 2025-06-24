import { useEffect, useState } from "react";
import { useUserContext } from "@/context/AuthContext";
import PostCard from "@/components/shared/PostCard";
import { Loader } from "lucide-react";
import type { Post } from "@/types";
import { fetchPosts } from "@/lib/axios/api";

const Home = () => {
  const { isAuthenticated, isLoading: authLoading } = useUserContext();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetchPosts();
        const postsData = res.data.results || res.data;
        setPosts(postsData);
        console.log("✅ Posts loaded:", postsData.length);
      } catch (err) {
        console.error("❌ Failed to load posts:", err);
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated && !authLoading) {
      loadPosts();
    } else if (!isAuthenticated && !authLoading) {
      // Clear posts if user is not authenticated
      setPosts([]);
      setError("");
    }
  }, [isAuthenticated, authLoading]);

  const showLoading = authLoading || loading;

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>

          {showLoading && (
            <div className="flex justify-center mt-10">
              <Loader className="animate-spin" />
              <span className="ml-2">
                {authLoading ? "Checking authentication..." : "Loading posts..."}
              </span>
            </div>
          )}

          {error && <p className="text-red-500 text-center mt-6">{error}</p>}

          {!showLoading && !error && posts.length === 0 && isAuthenticated && (
            <p className="text-gray-500 text-center mt-6">No posts available.</p>
          )}

          {!showLoading && !error && posts.length > 0 && (
            <ul className="flex flex-col gap-9 w-full">
              {posts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;

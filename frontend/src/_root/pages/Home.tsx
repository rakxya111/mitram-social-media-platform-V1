import { useEffect, useState } from "react";
// import { fetchPosts } from "@/api"; // Your API helper
import PostCard from "@/components/shared/PostCard";
import { Loader } from "lucide-react";
import { fetchPosts } from "@/lib/axios/api";
import type { Post } from "@/types"; // Adjust the import path as needed


const Home = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const res = await fetchPosts();
        setPosts(res.data.results || res.data); // depending on pagination
      } catch (err) {
        setError("Failed to load posts.");
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Home Feed</h2>

          {loading && <Loader className="animate-spin mx-auto mt-10" />}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && (
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

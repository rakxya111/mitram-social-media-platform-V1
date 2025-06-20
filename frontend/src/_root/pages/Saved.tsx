import { useEffect, useState } from "react";
import GridPostList from "@/components/shared/GridPostList";
import { Loader } from "lucide-react";
import { useUserContext } from "@/context/AuthContext";
import { fetchSavedPosts } from "@/lib/axios/api";

const Saved = () => {
  const { user, isLoading: userLoading } = useUserContext();
  const [savedPosts, setSavedPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const getSavedPosts = async () => {
      setLoading(true);
      try {
        const response = await fetchSavedPosts();
        const savedObjects = response.results || [];
        const posts = savedObjects.map((save: { post: any }) => save.post);
        setSavedPosts(posts);
      } catch (error) {
        console.error("Failed to fetch saved posts", error);
        setSavedPosts([]);
      } finally {
        setLoading(false);
      }
    };

    getSavedPosts();
  }, [user?.id]);

  if (userLoading || loading) {
    return (
      <div className="saved-container">
        <Loader className="animate-spin w-6 h-6 mt-10" />
      </div>
    );
  }

  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="saved icon"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

      {savedPosts.length === 0 ? (
        <p className="text-light-4 mt-6 text-center">No saved posts yet.</p>
      ) : (
        <GridPostList posts={savedPosts} showStats={true} />
      )}
    </div>
  );
};

export default Saved;

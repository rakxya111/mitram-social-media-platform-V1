import { useEffect, useState } from "react";
import GridPostList from "@/components/shared/GridPostList";
import { useUserContext } from "@/context/AuthContext";
import { fetchLikedPosts } from "@/lib/axios/api";
import type { Post } from "@/types"; // ✅ use correct typing

const LikedPosts = () => {
  const { user } = useUserContext();
  const [likedPosts, setLikedPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true); // optional loading state

  useEffect(() => {
    if (!user?.id) return;

    const getLikedPosts = async () => {
      setLoading(true);
      try {
        const response = await fetchLikedPosts();
        const likedObjects = response.results || [];
        const posts = likedObjects.map((like: { post: Post }) => like.post);
        setLikedPosts(posts);
      } catch (error) {
        console.error("Failed to fetch liked posts", error);
        setLikedPosts([]);
      } finally {
        setLoading(false);
      }
    };

    getLikedPosts();
  }, [user?.id]);

  if (loading) return <p className="text-light-4">Loading liked posts...</p>;

  return (
    <>
      {likedPosts.length === 0 ? (
        <p className="text-light-4">No liked posts</p>
      ) : (
        <GridPostList posts={likedPosts} showStats={false} />
      )}
    </>
  );
};

export default LikedPosts;

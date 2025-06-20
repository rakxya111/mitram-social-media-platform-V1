import GridPostList from "@/components/shared/GridPostList";
import { useUserContext } from "@/context/AuthContext";
import { fetchLikedPosts } from "@/lib/axios/api";
// import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutation"
import { use, useEffect, useState } from "react";


const LikedPosts = () => {

const { user } = useUserContext();
const [likedPosts, setLikedPosts] = useState<any[]>([]);
const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    const getLikedPosts = async () => {
      setLoading(true);
      try {
        const response = await fetchLikedPosts();
        const LikedObjects = response.results || [];
        const posts =  LikedObjects.map((like: { post: any }) => like.post);
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

  return (
    <>
    {likedPosts.length === 0 && (
      <p className="text-light-4">No liked posts</p>
    )}
      
      <GridPostList posts={likedPosts} showStats={false} />

    </>
  )
}

export default LikedPosts
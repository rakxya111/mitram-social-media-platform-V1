import React, { useState } from "react";
import { Loader } from "lucide-react";
import { toggleLikePost, toggleSavePost } from "@/lib/axios/api";

interface PostStatsProps {
  postId: number;
  userId: string;
  initialLikesCount: number;
  isInitiallyLiked: boolean;
  isInitiallySaved: boolean; // ✅ now used
}

const PostStats = ({
  postId,
  userId,
  isInitiallyLiked,
  initialLikesCount,
  isInitiallySaved,
}: PostStatsProps) => {
  const [isLiked, setIsLiked] = useState(isInitiallyLiked);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isSaved, setIsSaved] = useState(isInitiallySaved); // ✅ fixed
  const [loading, setLoading] = useState(false);

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      const res = await toggleLikePost(postId);
      const liked = res.data.is_liked;
      const count = res.data.likes_count;
      setIsLiked(liked);
      setLikesCount(count);
    } catch (err) {
      console.error("Error liking post", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setLoading(true);
    try {
      await toggleSavePost(postId);
      setIsSaved((prev) => !prev);
    } catch (err) {
      console.error("Error saving post", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-between items-center z-20 mt-3">
      <div className="flex items-center gap-2">
        <img
          src={isLiked ? "/assets/icons/liked.svg" : "/assets/icons/like.svg"}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikeClick}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likesCount}</p>
      </div>
      <div className="flex items-center gap-2 ml-5">
        {loading ? (
          <Loader size={20} />
        ) : (
          <img
            src={isSaved ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
            alt="save"
            width={20}
            height={20}
            onClick={handleSaveClick}
            className="cursor-pointer"
          />
        )}
      </div>
    </div>
  );
};

export default PostStats;

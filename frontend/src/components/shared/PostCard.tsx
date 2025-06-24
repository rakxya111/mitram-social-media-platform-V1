import { Link } from "react-router-dom";
import { multiFormatDateString } from "@/lib/utils";
import PostStats from "@/components/shared/PostStats";
import type { Post } from "@/types";
import { useUserContext } from "@/context/AuthContext";
import { useState } from "react";

interface PostCardProps {
  post: Post;
}

const PostCard = ({ post }: PostCardProps) => {
  const { user, isAuthenticated } = useUserContext();

  const [postState, ] = useState(post);

  const tags: string[] =
    typeof postState.tags === "string"
      ? postState.tags.split(",").map((tag) => tag.trim())
      : Array.isArray(postState.tags)
      ? postState.tags
      : [];

  // Fix: compare user.id and post.creator.id as numbers directly
  const isCurrentUserPost =
    isAuthenticated && user?.id !== 0 && user?.id === postState.creator.id;

console.log("user.id type & value:", typeof user?.id, user?.id);
console.log("post.creator type & value:", typeof postState.creator, postState.creator);
console.log("post.creator.id type & value:", typeof postState.creator.id, postState.creator.id);


  return (
    <div className="post-card">
      {/* Header */}
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <Link to={`/profile/${postState.creator.id}`}>
            <img
              src={
                postState.creator.image || "/assets/icons/profile-placeholder.svg"
              }
              alt="creator"
              className="w-12 h-12 rounded-full object-cover"
            />
          </Link>
          <div className="flex flex-col">
            <p className="base-medium text-light-1">{postState.creator.name}</p>
            <div className="text-light-3 text-sm">
              <span>{multiFormatDateString(postState.created_at)}</span>
              {postState.location && <span> • {postState.location}</span>}
            </div>
          </div>
        </div>

        {/* Show edit icon only if user owns post */}
        {isCurrentUserPost && (
          <Link to={`/update-post/${postState.id}`}>
            <img src="/assets/icons/edit.svg" alt="edit" width={20} height={20} />
          </Link>
        )}
      </div>

      {/* Caption and Image */}
      <Link to={`/posts/${postState.id}`}>
        <div className="text-light-1 text-sm my-4">
          <p>{postState.caption}</p>
          <ul className="flex gap-2 mt-2 flex-wrap">
            {tags.map((tag, index) => (
              <li key={index} className="text-light-3 text-xs">
                #{tag}
              </li>
            ))}
          </ul>
        </div>

        <img
          src={postState.image || "/assets/icons/profile-placeholder.svg"}
          alt="post"
          className="post-card_img w-full h-auto rounded-lg"
        />
      </Link>

      {/* Stats */}
      <PostStats
        postId={postState.id}
        userId={user?.id ? String(user.id) : ""}
        isInitiallyLiked={postState.is_liked}
        initialLikesCount={postState.likes_count}
        isInitiallySaved={postState.is_saved}
      />
    </div>
  );
};

export default PostCard;

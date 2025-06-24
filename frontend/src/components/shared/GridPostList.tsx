import { useUserContext } from "@/context/AuthContext";
import { Link } from "react-router-dom";
import PostStats from "./PostStats";

import type { Post } from "@/types";
import { getImageUrl } from "@/lib/utils/image";

type GridPostListProps = {
  posts: Post[];
  showUser?: boolean;
  showStats?: boolean;
};

const GridPostList = ({ posts, showUser = true, showStats = true }: GridPostListProps) => {
  const { user } = useUserContext();

  return (
    <ul className="grid-container">
      {posts.map((post) => (
        <li key={post.id} className="relative min-w-80 h-80">
          <Link to={`/posts/${post.id}`} className="grid-post_link">
            {/* ✅ Use helper for post image */}
            <img
              src={getImageUrl(post.image)}
              alt="post"
              className="h-full w-full object-cover"
            />
          </Link>

          <div className="grid-post_user">
            {showUser && post.creator && (
              <div className="flex items-center gap-2 flex-1">
                {/* ✅ Use helper for creator image */}
                <img
                  src={getImageUrl(post.creator.image)}
                  alt={post.creator.name || "creator"}
                  className="h-8 w-8 rounded-full"
                />
                <p className="line-clamp-1">{post.creator.name || "Unknown"}</p>
              </div>
            )}

            {showStats && user?.id && (
              <PostStats
                postId={post.id}
                userId={user.id.toString()}
                isInitiallyLiked={post.is_liked ?? false}
                isInitiallySaved={post.is_saved ?? false}
                initialLikesCount={post.likes_count ?? 0}
              />
            )}
          </div>
        </li>
      ))}
    </ul>
  );
};

export default GridPostList;

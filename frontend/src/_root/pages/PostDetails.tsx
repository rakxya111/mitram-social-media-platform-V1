import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";

import { posts } from "@/lib/Django/queries";
import { useUserContext } from "@/context/AuthContext";
import PostStats from "@/components/shared/PostStats";
import { multiFormatDateString } from "@/lib/utils";
// import { getFullImageUrl } from "@/lib/utils/imageHelper"; // ✅ Added

import type { Post } from "@/types";
import { getImageUrl } from "@/lib/utils/image";

const PostDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserContext();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchPost = async () => {
      try {
        const data = await posts.getPost(id);
        setPost(data);
      } catch (error) {
        console.error("Failed to load post:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  const handleDeletePost = async () => {
    if (!post) return;
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    setDeleting(true);
    try {
      await posts.deletePost(post.id.toString());
      navigate("/"); // redirect after deletion
    } catch (error) {
      console.error("Failed to delete post:", error);
      setDeleting(false);
    }
  };

  if (loading) {
    return <Loader className="animate-spin w-6 h-6 mx-auto mt-10" />;
  }

  if (!post) {
    return <p className="text-center mt-10">Post not found.</p>;
  }

  return (
    <div className="post_details-container">
      <div className="post_details-card max-w-5xl mx-auto">
        {/* ✅ Use helper for post image */}
        <img src={getImageUrl(post.image)} alt="post" className="post_details-img" />

        <div className="post_details-info">
          <div className="flex justify-between items-center mb-4">
            <Link
              to={`/profile/${post.creator.id}`}
              className="flex items-center gap-3"
            >
              {/* ✅ Use helper for creator image */}
              <img
                src={getImageUrl(post.creator.image)}
                alt="creator"
                className="rounded-full w-10 h-10 lg:w-12 lg:h-12"
              />
              <div>
                <p className="font-semibold text-lg">{post.creator.name}</p>
                <p className="text-sm text-gray-500">
                  {multiFormatDateString(post.created_at)}
                </p>
                {post.location && (
                  <p className="text-sm text-gray-400">{post.location}</p>
                )}
              </div>
            </Link>

            <div className="flex items-center gap-4 ml-10">
              {user?.id === post.creator.id && (
                <>
                  <Link
                    to={`/update-post/${post.id}/`}
                    className="text-blue-500 hover:underline"
                    title="Edit Post"
                  >
                    <img
                      src="/assets/icons/edit.svg"
                      alt="edit"
                      width={24}
                      height={24}
                    />
                  </Link>

                  <button
                    onClick={handleDeletePost}
                    disabled={deleting}
                    className="text-red-600 hover:text-red-800"
                    title="Delete Post"
                  >
                    <img
                      src="/assets/icons/delete.svg"
                      alt="delete"
                      width={24}
                      height={24}
                    />
                  </button>
                </>
              )}
            </div>
          </div>

          <hr className="border-gray-300 mb-4" />

          <p className="mb-2 text-base">{post.caption}</p>

          {post.tags && post.tags.length > 0 && (
            <ul className="flex flex-wrap gap-2 mb-4">
              {post.tags
                .split(",")
                .map((tag) => tag.trim())
                .filter(Boolean)
                .map((tag, i) => (
                  <li
                    key={i}
                    className="text-sm text-blue-600 bg-blue-100 px-2 py-1 rounded"
                  >
                    #{tag}
                  </li>
                ))}
            </ul>
          )}

          <div className="flex justify-between items-center mt-4">
            <PostStats
              postId={post.id}
              userId={user?.id.toString() || ""}
              initialLikesCount={post.likes_count || 0}
              isInitiallyLiked={post.is_liked || false}
              isInitiallySaved={post.is_saved || false}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetails;

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader } from "lucide-react";
import PostForm from "@/components/forms/PostForm";

import type { Post } from "@/types";
import { posts } from "@/lib/Django/queries";

const EditPost = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

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

  const handleUpdate = async (formData: { content?: string; image?: File }) => {
    try {
      if (!id) return;
      await posts.updatePost(id, formData);
      navigate(`/posts/${id}`); // redirect after update
    } catch (error) {
      console.error("Failed to update post:", error);
    }
  };

  if (loading) return <Loader className="animate-spin w-6 h-6 mx-auto mt-10" />;

  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="/assets/icons/add-post.svg"
            width={36}
            height={36}
            alt="edit"
          />
          <h2 className="h3-bold md:h2-bold text-left w-full">Edit Post</h2>
        </div>

        <PostForm action="Update" post={post ?? undefined} onSubmit={handleUpdate} />
      </div>
    </div>
  );
};

export default EditPost;

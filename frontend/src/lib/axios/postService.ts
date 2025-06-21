import axiosInstance from "@/lib/axios/axiosInstance";

// ✅ Delete Post
export const deletePost = async (id: string | number): Promise<void> => {
  await axiosInstance.delete(`/posts/${id}/delete/`); // ✅ Correct Django route
};

// ✅ Update Post
export const updatePost = async (
  id: string | number,
  data: {
    caption?: string;
    tags?: string;
    location?: string;
    image?: File | null;
  }
): Promise<any> => {
  const formData = new FormData();
  if (data.caption !== undefined) formData.append("caption", data.caption);
  if (data.tags !== undefined) formData.append("tags", data.tags);
  if (data.location !== undefined) formData.append("location", data.location);
  if (data.image !== undefined && data.image !== null) {
    formData.append("image", data.image);
  }

  const response = await axiosInstance.put(
    `/posts/${id}/update-func/`, // ✅ Correct Django route
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

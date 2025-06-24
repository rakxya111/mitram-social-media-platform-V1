// Fixed api.ts - Remove token storage from API functions

import axiosInstance from './axiosInstance';

// ==================== Auth ====================

export const registerUser = async (data: {
  name: string;
  email: string;
  username: string;
  password: string;
  password_confirm: string;
}) => {
  try {
    const res = await axiosInstance.post('register/', data);
    // REMOVED: Don't store tokens here - let AuthContext handle it
    // localStorage.setItem('access', res.data.tokens.access);
    // localStorage.setItem('refresh', res.data.tokens.refresh);
    return res.data;
  } catch (err) {
    throw new Error('Registration failed');
  }
};

export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const res = await axiosInstance.post('login/', data);
    // REMOVED: Don't store tokens here - let AuthContext handle it
    // localStorage.setItem('access', res.data.tokens.access);
    // localStorage.setItem('refresh', res.data.tokens.refresh);
    return res.data;
  } catch (err) {
    throw new Error('Login failed');
  }
};

export const logoutUser = () => {
  const refresh = localStorage.getItem('refresh');
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  return axiosInstance.post('logout/', { refresh });
};

export const getUserProfile = () => axiosInstance.get('user/');

export const updateUserProfile = (
  userId: number,
  data: { bio?: string; image?: File }
) => {
  const formData = new FormData();
  if (data.bio) formData.append('bio', data.bio);
  if (data.image) formData.append('image', data.image);

  return axiosInstance.put(`users/update/${userId}/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Posts APIs
export const fetchPosts = (params?: {
  search?: string;
  tag?: string;
  location?: string;
  ordering?: string;
  page?: number;
}) => axiosInstance.get("posts/", { params });

export const createPost = (data: {
  caption: string;
  tags: string;
  location?: string;
  image: File;
}) => {
  const formData = new FormData();
  formData.append("caption", data.caption);
  formData.append("tags", data.tags);
  if (data.location) formData.append("location", data.location);
  formData.append("image", data.image);
  return axiosInstance.post("posts/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updatePost = (
  postId: number,
  data: {
    caption?: string;
    tags?: string;
    location?: string;
    image?: File;
  }
) => {
  const formData = new FormData();
  if (data.caption) formData.append("caption", data.caption);
  if (data.tags) formData.append("tags", data.tags);
  if (data.location) formData.append("location", data.location);
  if (data.image) formData.append("image", data.image);
  return axiosInstance.put(`posts/${postId}/update-func/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updatePostGeneric = (
  postId: number,
  data: {
    caption?: string;
    tags?: string;
    location?: string;
    image?: File;
  }
) => {
  const formData = new FormData();
  if (data.caption) formData.append("caption", data.caption);
  if (data.tags) formData.append("tags", data.tags);
  if (data.location) formData.append("location", data.location);
  if (data.image) formData.append("image", data.image);
  return axiosInstance.put(`posts/${postId}/update/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const updatePostDetail = (
  postId: number,
  data: {
    caption?: string;
    tags?: string;
    location?: string;
    image?: File;
  }
) => {
  const formData = new FormData();
  if (data.caption) formData.append("caption", data.caption);
  if (data.tags) formData.append("tags", data.tags);
  if (data.location) formData.append("location", data.location);
  if (data.image) formData.append("image", data.image);
  return axiosInstance.patch(`posts/${postId}/`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deletePost = (postId: number) =>
  axiosInstance.delete(`posts/${postId}/delete/`);

export const explorePosts = (params?: {
  search?: string;
  tag?: string;
  location?: string;
  ordering?: string;
}) => axiosInstance.get("explore/", { params });

export const fetchMyPosts = () => axiosInstance.get("my-posts/");

// Fetch posts by user id (correct path with 'users')
export const fetchUserPosts = (userId: number) =>
  axiosInstance.get(`users/${userId}/posts/`);

// Fetch user profile with posts by user id
export const fetchUserProfileWithPosts = (userId: number) =>
  axiosInstance.get(`users/${userId}/profile/`);

export const fetchSavedPosts = async () => {
  const response = await axiosInstance.get("saved/");
  return response.data;
};

export const fetchLikedPosts = async () => {
  const response = await axiosInstance.get("liked/");
  return response.data;
};

export const toggleLikePost = (postId: number) =>
  axiosInstance.post(`posts/${postId}/like/`);

export const toggleSavePost = (postId: number) =>
  axiosInstance.post(`posts/${postId}/save/`);

export const getPostById = (postId: number) => axiosInstance.get(`posts/${postId}/`);

export const fetchPostsByUserId = (userId: string | number) =>
  axiosInstance.get(`posts/?user=${userId}`);

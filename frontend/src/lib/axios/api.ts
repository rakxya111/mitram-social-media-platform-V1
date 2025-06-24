//Api.ts
import axiosInstance from './axiosInstance';

// Auth APIs
export const registerUser = (data: {
  name: string;
  email: string;
  username: string;
  password: string;
  password_confirm: string;
}) => axiosInstance.post('auth/register/', data);

export const loginUser = (data: { email: string; password: string }) =>
  axiosInstance.post('auth/login/', data).then((res) => {
    // Store tokens on successful login
    localStorage.setItem('access', res.data.access);
    localStorage.setItem('refresh', res.data.refresh);
    return res.data;
  });

export const logoutUser = () => {
  localStorage.removeItem('access');
  localStorage.removeItem('refresh');
  return axiosInstance.post('auth/logout/');
};

export const getUserProfile = () => axiosInstance.get('auth/user/');

export const updateUserProfile = (data: { bio?: string; image?: File }) => {
  const formData = new FormData();
  if (data.bio) formData.append('bio', data.bio);
  if (data.image) formData.append('image', data.image);
  return axiosInstance.put('auth/profile/update/', formData, {
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
}) => axiosInstance.get('posts/', { params }); // Fixed: removed leading slash

export const createPost = (data: {
  caption: string;
  tags: string;
  location?: string;
  image: File;
}) => {
  const formData = new FormData();
  formData.append('caption', data.caption);
  formData.append('tags', data.tags);
  if (data.location) formData.append('location', data.location);
  formData.append('image', data.image);
  return axiosInstance.post('posts/', formData, { // Fixed: removed leading slash
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Multiple update options - choose the one you prefer
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
  if (data.caption) formData.append('caption', data.caption);
  if (data.tags) formData.append('tags', data.tags);
  if (data.location) formData.append('location', data.location);
  if (data.image) formData.append('image', data.image);
  return axiosInstance.put(`posts/${postId}/update-func/`, formData, { // Fixed: using function-based update
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Alternative update methods
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
  if (data.caption) formData.append('caption', data.caption);
  if (data.tags) formData.append('tags', data.tags);
  if (data.location) formData.append('location', data.location);
  if (data.image) formData.append('image', data.image);
  return axiosInstance.put(`posts/${postId}/update/`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
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
  if (data.caption) formData.append('caption', data.caption);
  if (data.tags) formData.append('tags', data.tags);
  if (data.location) formData.append('location', data.location);
  if (data.image) formData.append('image', data.image);
  return axiosInstance.patch(`posts/${postId}/`, formData, { // Using PATCH for partial updates
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const deletePost = (postId: number) =>
  axiosInstance.delete(`posts/${postId}/delete/`);

// Explore and User Posts
export const explorePosts = (params?: {
  search?: string;
  tag?: string;
  location?: string;
  ordering?: string;
}) => axiosInstance.get('explore/', { params }); // Fixed: changed from 'auth/explore/' to 'explore/'

export const fetchMyPosts = () => axiosInstance.get('my-posts/');

export const fetchUserPosts = (userId: number) =>
  axiosInstance.get(`user/${userId}/posts/`);

export const fetchUserProfileWithPosts = (userId: number) =>
  axiosInstance.get(`user/${userId}/profile/`);

// Saved Posts
export const fetchSavedPosts = async () => {
  const response = await axiosInstance.get("saved/");
  return response.data;  // your backend should return array of saved posts here
};
// Saved Posts
export const fetchLikedPosts = async () => {
  const response = await axiosInstance.get("liked/");
  return response.data;  // your backend should return array of saved posts here
};

// Like & Save toggles
export const toggleLikePost = (postId: number) =>
  axiosInstance.post(`posts/${postId}/like/`);

export const toggleSavePost = (postId: number) =>
  axiosInstance.post(`posts/${postId}/save/`);

// Additional helper functions for better error handling
export const getPostById = (postId: number) =>
  axiosInstance.get(`posts/${postId}/`);

export const fetchPostsByUserId = (userId: string | number) => {
  return axiosInstance.get(`/posts/?user=${userId}`);
};


// queries.ts

import type {
  AuthTokens,
  LoginData,
  RegisterData,
  IUser,
  Post,
  Comment,
} from '@/types';

import { useMutation, useQuery } from '@tanstack/react-query';
import axios from "axios";

// Create Axios instance with baseURL from env or default
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/',
});

// --- REQUEST INTERCEPTOR ---
// Attach access token in headers for authorized requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    // List of auth-free endpoints (no token needed)
    const authFreeEndpoints = [
      "auth/login/",
      "auth/register/",
      "auth/token/refresh/",
    ];

    // Check if current request URL is auth-free
    const isAuthFree = authFreeEndpoints.some(endpoint =>
      config.url?.includes(endpoint) || config.url?.endsWith(endpoint)
    );

    if (token && !isAuthFree) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --- RESPONSE INTERCEPTOR ---
// Automatically refresh token on 401 Unauthorized error
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken && !originalRequest.url?.includes("auth/login/")) {
        try {
          const response = await axiosInstance.post("auth/token/refresh/", {
            refresh: refreshToken,
          });

          const { access, refresh } = response.data;
          localStorage.setItem("access", access);
          localStorage.setItem("refresh", refresh);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh token failed - clear tokens & redirect to login
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/sign-in";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// --- Generic API methods wrapped on axiosInstance ---
const api = {
  get: <T = any>(url: string, config?: any) => axiosInstance.get<T>(url, config),
  post: <T = any>(url: string, data?: any, config?: any) => axiosInstance.post<T>(url, data, config),
  patch: <T = any>(url: string, data?: any, config?: any) => axiosInstance.patch<T>(url, data, config),
  put: <T = any>(url: string, data?: any, config?: any) => axiosInstance.put<T>(url, data, config),
  delete: <T = any>(url: string, config?: any) => axiosInstance.delete<T>(url, config),

  // Helper for file uploads using multipart/form-data
  uploadFile: <T = any>(url: string, file: File, otherData?: Record<string, any>) => {
    const formData = new FormData();
    formData.append('file', file);
    if (otherData) {
      Object.entries(otherData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });
    }
    return axiosInstance.post<T>(url, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  }
};

// --- API ENDPOINTS ---
// Centralized endpoints for easy modification
const ENDPOINTS = {
  AUTH: {
    LOGIN: 'auth/login/',
    REGISTER: 'auth/register/',
    LOGOUT: 'auth/logout/',
    USER_PROFILE: 'auth/user/',
    REFRESH: 'auth/token/refresh/',
  },
  USERS: {
    PROFILE: (id: string) => `auth/users/${id}/`,
    UPDATE: (id: string) => `auth/users/update/${id}/`,
    LIST: 'auth/users/list/',
    FOLLOW: (id: string) => `users/${id}/follow/`,
    UNFOLLOW: (id: string) => `users/${id}/unfollow/`,
    FOLLOWERS: (id: string) => `users/${id}/followers/`,
    FOLLOWING: (id: string) => `users/${id}/following/`,
  },
  POSTS: {
    LIST: 'posts/',
    DETAIL: (id: string) => `posts/${id}/`,
    CREATE: 'posts/',
    UPDATE: (id: string) => `posts/${id}/`,
    DELETE: (id: string) => `posts/${id}/delete/`,
    LIKE: (id: string) => `posts/${id}/like/`,
  },
  COMMENTS: {
    LIST: (postId: string) => `posts/${postId}/comments/`,
    CREATE: (postId: string) => `posts/${postId}/comments/create/`,
    UPDATE: (postId: string, commentId: string) => `posts/${postId}/comments/${commentId}/update/`,
    DELETE: (postId: string, commentId: string) => `posts/${postId}/comments/${commentId}/delete/`
  },
  MEDIA: {
    UPLOAD: 'media/upload/'
  }
};

// --- Token Manager for localStorage handling ---
const tokenManager = {
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem('access', access);
    localStorage.setItem('refresh', refresh);
  },
  getAccessToken: () => localStorage.getItem('access'),
  getRefreshToken: () => localStorage.getItem('refresh'),
  clearTokens: () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
  },
  isAuthenticated: () => !!localStorage.getItem('access'),
};

// --- AUTH QUERIES --- (login, register, logout, get user)
export const authQueries = {
  login: async (credentials: LoginData): Promise<AuthTokens> => {
    const res = await api.post<AuthTokens>(ENDPOINTS.AUTH.LOGIN, credentials);
    tokenManager.setTokens(res.data.access, res.data.refresh);
    return res.data;
  },

  register: async (data: RegisterData): Promise<IUser> => {
    const res = await api.post<IUser>(ENDPOINTS.AUTH.REGISTER, data);
    return res.data;
  },

  logout: async (): Promise<void> => {
    try {
      await api.post(ENDPOINTS.AUTH.LOGOUT);
    } finally {
      tokenManager.clearTokens();
    }
  },

  getCurrentUser: async (): Promise<IUser> => {
    const res = await api.get<IUser>(ENDPOINTS.AUTH.USER_PROFILE);
    return res.data;
  },

  refreshToken: async (): Promise<AuthTokens> => {
    const refresh = tokenManager.getRefreshToken();
    if (!refresh) throw new Error('No refresh token');
    const res = await api.post<AuthTokens>(ENDPOINTS.AUTH.REFRESH, { refresh });
    tokenManager.setTokens(res.data.access, res.data.refresh);
    return res.data;
  }
};

// --- PROFILE UPDATE ---
export interface UpdateProfileData {
  name: string;
  bio: string;
  image?: File; // optional file upload
}

export const updateProfile = async (userId: string, data: UpdateProfileData) => {
  const formData = new FormData();
  formData.append('name', data.name);
  formData.append('bio', data.bio);
  if (data.image) {
    formData.append('image', data.image);
  }

  const response = await axiosInstance.patch(ENDPOINTS.USERS.UPDATE(userId), formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

// --- POSTS QUERIES ---
export const postQueries = {
  getAllPosts: async (page = 1, limit = 10): Promise<{ results: Post[]; count: number; next: string | null; previous: string | null }> => {
    const res = await api.get(`${ENDPOINTS.POSTS.LIST}?page=${page}&limit=${limit}`);
    return res.data;
  },

  getPost: async (id: string): Promise<Post> => {
    const res = await api.get<Post>(ENDPOINTS.POSTS.DETAIL(id));
    return res.data;
  },

  createPost: async (data: { content: string; image?: File }): Promise<Post> => {
    if (data.image) {
      const res = await api.uploadFile<Post>(ENDPOINTS.POSTS.CREATE, data.image, { content: data.content });
      return res.data;
    }
    const res = await api.post<Post>(ENDPOINTS.POSTS.CREATE, { content: data.content });
    return res.data;
  },

  updatePost: async (id: string, data: { content?: string; image?: File }): Promise<Post> => {
    if (data.image) {
      const res = await api.uploadFile<Post>(ENDPOINTS.POSTS.UPDATE(id), data.image, { content: data.content });
      return res.data;
    }
    const res = await api.patch<Post>(ENDPOINTS.POSTS.UPDATE(id), { content: data.content });
    return res.data;
  },

  deletePost: async (id: string): Promise<void> => {
    await api.delete(ENDPOINTS.POSTS.DELETE(id));
  },

  toggleLikePost: async (id: string): Promise<{ liked: boolean; likes_count: number }> => {
    const res = await api.post(ENDPOINTS.POSTS.LIKE(id));
    return {
      liked: res.data.is_liked,
      likes_count: res.data.likes_count,
    };
  },
};

// --- COMMENTS QUERIES ---
export const commentQueries = {
  getComments: async (postId: string): Promise<Comment[]> => {
    const res = await api.get<Comment[]>(ENDPOINTS.COMMENTS.LIST(postId));
    return res.data;
  },

  createComment: async (postId: string, content: string): Promise<Comment> => {
    const res = await api.post<Comment>(ENDPOINTS.COMMENTS.CREATE(postId), { content });
    return res.data;
  },

  updateComment: async (postId: string, commentId: string, content: string): Promise<Comment> => {
    const res = await api.patch<Comment>(ENDPOINTS.COMMENTS.UPDATE(postId, commentId), { content });
    return res.data;
  },

  deleteComment: async (postId: string, commentId: string): Promise<void> => {
    await api.delete(ENDPOINTS.COMMENTS.DELETE(postId, commentId));
  }
};

// --- USER QUERIES ---
export const userQueries = {
  getUser: async (id: string): Promise<IUser> => {
    const res = await api.get<IUser>(ENDPOINTS.USERS.PROFILE(id));
    return res.data;
  },

  listUsers: async (): Promise<IUser[]> => {
    const res = await api.get<IUser[]>(ENDPOINTS.USERS.LIST);
    return res.data;
  },

  followUser: async (id: string): Promise<{ following: boolean; followers_count: number }> => {
    const res = await api.post(ENDPOINTS.USERS.FOLLOW(id));
    return res.data;
  },

  unfollowUser: async (id: string): Promise<{ following: boolean; followers_count: number }> => {
    const res = await api.post(ENDPOINTS.USERS.UNFOLLOW(id));
    return res.data;
  },

  getFollowers: async (id: string): Promise<IUser[]> => {
    const res = await api.get<IUser[]>(ENDPOINTS.USERS.FOLLOWERS(id));
    return res.data;
  },

  getFollowing: async (id: string): Promise<IUser[]> => {
    const res = await api.get<IUser[]>(ENDPOINTS.USERS.FOLLOWING(id));
    return res.data;
  }
};

// --- UTILITIES ---
export const apiUtils = {
  isAuthenticated: (): boolean => tokenManager.isAuthenticated(),

  handleError: (error: any): string => {
    const status = error?.response?.status;
    if (status === 401) {
      tokenManager.clearTokens();
      return 'Authentication required. Please log in.';
    }
    if (status === 403) return 'You do not have permission.';
    if (status === 404) return 'Resource not found.';
    if (status === 500) return 'Server error. Try again later.';
    return error.message || 'An unexpected error occurred.';
  },

  uploadMedia: async (file: File): Promise<{ url: string }> => {
    const res = await api.uploadFile<{ url: string }>(ENDPOINTS.MEDIA.UPLOAD, file);
    return res.data;
  }
};

// --- REACT QUERY EXAMPLES ---
// Hooks you can use inside React components

export const useGetUsers = () => {
  return useQuery({
    queryKey: ['getUsers'],
    queryFn: userQueries.listUsers,
  });
};

export const useGetPosts = () => {
  return useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      const res = await axiosInstance.get<{ results: Post[] }>(ENDPOINTS.POSTS.LIST);
      return res.data.results;
    },
  });
};

export const useSearchPosts = (search: string) => {
  return useQuery({
    queryKey: ["searchPosts", search],
    queryFn: async () => {
      const res = await axiosInstance.get(`${ENDPOINTS.POSTS.LIST}?search=${search}`);
      return res.data.results;
    },
    enabled: !!search,
  });
};

export const useUpdateProfile = (userId: string) => {
  return useMutation({
    mutationFn: (data: UpdateProfileData) => updateProfile(userId, data),
  });
};

// --- EXPORT ALL ---
// You can import these wherever you need to call API

export {
  authQueries as auth,
  postQueries as posts,
  commentQueries as comments,
  userQueries as users,
  apiUtils as utils
};

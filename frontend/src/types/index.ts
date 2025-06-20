// types.ts

// ─── AUTH & CONTEXT ─────────────────────────────────────────────

export type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
};

export type AuthTokens = {
  access: string;
  refresh: string;
};

export type LoginData = {
  email: string;
  password: string;
};

export type RegisterData = {
  name: string;
  email: string;
  username: string;
  password: string;
  password_confirm: string;
};

// ─── USER ───────────────────────────────────────────────────────

export type IUser = {
  id: string | number;
  name: string;
  username: string;
  email: string;
  image?: string; 
  bio?: string;
  posts_count?: number;
  followers?: IUser[];
  following?: IUser[];
  posts: any[];
};

export type INewUser = {
  name: string;
  email: string;
  username: string;
  password: string;
};

export type IUpdateUser = {
  userId: string | number;
  name?: string;
  bio?: string;
  image?: File; // single image upload
};

// ─── NAVIGATION ────────────────────────────────────────────────

export type INavLink = {
  imgURL: string;
  route: string;
  label: string;
};

// ─── POSTS ──────────────────────────────────────────────────────

export interface Post {
  id: number;
  caption: string;
  tags: string;
  image: string;
  imageId: string;
  location?: string;
  likes: number[];
  creator: {
    id: number;
    username: string;
    name: string;
    image?: string;
  };
  created_at: string;
  likes_count: number;
  saves_count: number;
  is_liked: boolean;
  is_saved: boolean;
}

export type INewPost = {
  caption: string;
  image: File;
  tags?: string;
  location?: string;
};

export type IUpdatePost = {
  postId: number;
  caption?: string;
  image?: File;
  tags?: string;
  location?: string;
};

// ─── COMMENTS ───────────────────────────────────────────────────

export type Comment = {
  id: number;
  user: IUser;
  post: number;
  content: string;
  created_at: string;
};

export type INewComment = {
  postId: number;
  content: string;
};

export type IUpdateComment = {
  postId: number;
  commentId: number;
  content: string;
};

// ─── FOLLOW SYSTEM ──────────────────────────────────────────────

export type FollowResponse = {
  following: boolean;
  followers_count: number;
};

// ─── PAGINATION ─────────────────────────────────────────────────

export type PaginatedResponse<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};



export interface User {
  id: number;
  username: string;
  name: string;
  email: string;
  bio?: string;
  image?: string;
}

export interface SavedPost {
  id: number;
  post: Post;
  saved_at: string;
}
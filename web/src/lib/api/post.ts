import { api } from "../utils/fecth-api";
import { Post } from "./type";

export const getPosts = () => api<Post[]>("/api/post");

export const getPost = (id: number) => api<Post>(`/api/post/${id}`);

export const getPostsByUser = (userId: number) =>
  api<Post[]>(`/api/post/user/${userId}`);

export const createPost = (post: Partial<Post>) =>
  api<Post>("/api/post", "POST", post);

export const updatePost = (id: number, post: Partial<Post>) =>
  api<Post>(`/api/post/${id}`, "PUT", post);

export const deletePost = (id: number) =>
  api<void>(`/api/post/${id}`, "DELETE");

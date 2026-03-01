import { api } from "../utils/fecth-api";
import { Comment } from "./type";

export const getCommentsByPost = (postId: number) =>
  api<Comment[]>(`/api/comment/post/${postId}`);

export const createComment = (comment: Partial<Comment>) =>
  api<Comment>("/api/comment", "POST", comment);

export const deleteComment = (id: number) =>
  api<void>(`/api/comment/${id}`, "DELETE");

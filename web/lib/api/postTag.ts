import { api } from "../utils/fecth-api";
import { PostTag } from "./type";

export const getTagsByPost = (postId: number) =>
  api<PostTag[]>(`/api/posttag/post/${postId}`);

export const createPostTag = (postTag: Partial<PostTag>) =>
  api<PostTag>("/api/posttag", "POST", postTag);

export const deletePostTag = (postId: number, tagId: number) =>
  api<void>(`/api/posttag/post/${postId}/tag/${tagId}`, "DELETE");

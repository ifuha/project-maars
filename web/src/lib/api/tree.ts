import { api } from "../utils/fecth-api";
import { Tree } from "./type";

export const getTreesByPost = (postId: number) =>
  api<{ postId: number; count: number }>(`/api/tree/post/${postId}`);

export const createTree = (tree: Partial<Tree>) =>
  api<Tree>("/api/tree", "POST", tree);

export const deleteTree = (userId: number, postId: number) =>
  api<void>(`/api/tree/user/${userId}/post/${postId}`, "DELETE");

export const getTree = async (
  userId: number,
  postId: number,
): Promise<Tree | null> => {
  try {
    return await api<Tree>(`/api/tree/user/${userId}/post/${postId}`);
  } catch {
    return null;
  }
};

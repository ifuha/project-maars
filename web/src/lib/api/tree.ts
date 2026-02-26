import { api } from "../utils/fecth-api";
import { Tree } from "./type";

export const getTreesByPost = (postId: number) =>
  api<{ postId: number; count: number }>(`/api/tree/post/${postId}`);

export const createTree = (tree: Partial<Tree>) =>
  api<Tree>("/api/tree", "POST", tree);

export const deleteTree = (id: number) =>
  api<void>(`/api/tree/${id}`, "DELETE");

import { api } from "../utils/fecth-api";
import { Tag } from "./type";

export const getTags = () => api<Tag[]>("/api/tag");

export const getTag = (id: number) => api<Tag>(`/api/tag/${id}`);

export const createTag = (tag: Partial<Tag>) =>
  api<Tag>("/api/tag", "POST", tag);

export const deleteTag = (id: number) => api<void>(`/api/tag/${id}`, "DELETE");

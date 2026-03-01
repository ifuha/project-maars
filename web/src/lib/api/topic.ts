import { api } from "../utils/fecth-api";
import { Topic } from "./type";

export const getTopicsByTree = (treeId: number) =>
  api<Topic[]>(`/api/topic/tree/${treeId}`);

export const getTopics = () => api<Topic[]>("/api/topic");

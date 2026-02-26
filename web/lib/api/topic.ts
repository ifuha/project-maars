import { api } from "../utils/fecth-api";
import { Topic } from "./type";

export const getTopicsByTree = (treeId: number) =>
  api<Topic[]>(`/api/topic/tree/${treeId}`);

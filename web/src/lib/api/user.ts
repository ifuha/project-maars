import { api } from "../utils/fecth-api";
import { User } from "./type";

export const getUsers = () => api<User[]>("/api/user");

export const getUser = (id: number) => api<User>(`/api/user/${id}`);

export const updateUser = (id: number, user: Partial<User>) =>
  api<User>(`/api/user/${id}`, "PUT", user);

export const deleteUser = (id: number) =>
  api<void>(`/api/user/${id}`, "DELETE");

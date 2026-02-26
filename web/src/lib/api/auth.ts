import { api } from "../utils/fecth-api";
import { setToken } from "../utils/access-token";
import { User } from "./type";

type RegisterDto = {
  name: string;
  email: string;
  password: string;
};

type LoginDto = {
  email: string;
  password: string;
};

type LoginResponse = {
  token: string;
  userId: number;
  name: string;
  email: string;
};

export const register = (dto: RegisterDto) =>
  api<User>("/api/auth/register", "POST", dto);

export const login = async (dto: LoginDto) => {
  const res = await api<LoginResponse>("/api/auth/login", "POST", dto);
  setToken(res.token);
  return res;
};

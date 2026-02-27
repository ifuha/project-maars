import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const getToken = () => Cookies.get("token");
export const setToken = (token: string) =>
  Cookies.set("token", token, { expires: 7 });
export const removeToken = () => Cookies.remove("token");

export const getUserId = (): number | null => {
  const token = getToken();
  if (!token) return null;
  const decoded = jwtDecode<{ [key: string]: string }>(token);
  const nameId =
    decoded[
      "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
    ];
  return nameId ? Number(nameId) : null;
};

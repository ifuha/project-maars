import { getToken } from "./access-token";

const BASE_URL = "";

type Method = "GET" | "POST" | "PUT" | "DELETE";

export async function api<T>(
  endpoint: string,
  method: Method = "GET",
  body?: unknown,
): Promise<T> {
  const token = getToken();

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || `Error ${res.status}`);
  }

  if (res.status === 204) return {} as T;

  return res.json();
}
